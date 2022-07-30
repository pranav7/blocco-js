import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { action } from '@ember/object';
import { DateTime } from 'luxon';
import { eventTypes, eventTypeNames, eventTypeColors } from 'blocco-js/models/event';
import { isPresent } from '@ember/utils';

import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import InlineCode from '@editorjs/inline-code';
import Checklist from '@editorjs/checklist';

const editorTools = {
  header: {
    class: Header,
    inlineToolbar: true,
  },
  list: {
    class: List,
    inlineToolbar: true,
    config: {
      defaultStyle: 'unordered',
    },
  },
  inlineCode: {
    class: InlineCode,
  },
  checklist: {
    class: Checklist,
    inlineToolbar: true,
  },
};
const ignoredTargetTypes = ['textarea', 'input'];

class GridConfig {
  @tracked start;
  @tracked end;

  constructor({ start, end }) {
    this.start = start;
    this.end = end;
  }
}

export default class Grid extends Component {
  @service store;
  @service router;

  gridConfig;
  eventTypes = eventTypes;
  eventTypeNames = eventTypeNames;

  @tracked events = [];
  @tracked calendar;
  @tracked showAddEventDialog = false;
  @tracked showEditEventDialog = false;
  @tracked newEventObject = {};
  @tracked calendarClickInfo;
  @tracked selectedEvent;
  @tracked currentDateTime = DateTime.local();
  @tracked weeklyNotes;
  @tracked shutdownStatus;
  @tracked weeklyNotesEditor;

  constructor() {
    super(...arguments);

    this.gridConfig = new GridConfig({ start: '8:30:00', end: '18:30:00' });
    this.args.events.map((event) => this.events.push(event));
    this.newEventObject = {
      title: null,
      eventType: eventTypes.default,
      allDay: false,
      notes: '',
    };
  }

  @action
  renderCalendar(element) {
    this.calendar = new Calendar(element, {
      plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
      headerToolbar: false,
      initialView: this.args.view,
      height: 800,
      expandRows: true,
      editable: true,
      nowIndicator: true,
      slotMinTime: this.gridConfig.start,
      slotMaxTime: this.gridConfig.end,
      events: this.events,
      dayHeaders: this.args.dayHeaders,
      defaultTimedEventDuration: '00:30',
      slotDuration: '00:15:00',
      dateClick: this.dateClick,
      eventResize: this.eventResize,
      eventDrop: this.eventDrop,
      eventClick: this.eventClick,
    });
    this.calendar.render();
  }

  @action
  async previousDay() {
    this.currentDateTime = this.currentDateTime.plus({ day: -1 });
    this.calendar.prev();
    await this.fetchWeeklyNotes();
    this.refreshEditorContent();
    this.fetchShutdownStatus();
  }

  @action
  async nextDay() {
    this.currentDateTime = this.currentDateTime.plus({ day: 1 });
    this.calendar.next();
    await this.fetchWeeklyNotes();
    await this.refreshEditorContent();
    this.fetchShutdownStatus();
  }

  @action
  async moveToToday() {
    this.currentDateTime = DateTime.local();
    this.calendar.today();
    await this.fetchWeeklyNotes();
    this.refreshEditorContent();
    this.fetchShutdownStatus();
  }

  @action
  dateClick(info) {
    this.calendarClickInfo = info;
    this.showAddEventDialog = true;
  }

  @action
  eventClick(info) {
    this.calendarClickInfo = info;
    this.store
      .findRecord('event', this.calendarClickInfo.event.id)
      .then((event) => (this.selectedEvent = event));
    this.showEditEventDialog = true;
  }

  @action
  eventResize(info) {
    this.store.findRecord('event', info.event.id).then((event) => {
      event.end = event.endDate
        .plus({
          days: info.endDelta.days,
          milliseconds: info.endDelta.milliseconds,
        })
        .toJSDate();
      event.save();
    });
  }

  @action
  eventDrop(info) {
    this.store.findRecord('event', info.event.id).then((event) => {
      event.start = event.startDate.plus({ milliseconds: info.delta.milliseconds }).toJSDate();
      event.end = event.endDate.plus({ milliseconds: info.delta.milliseconds }).toJSDate();
      event.save();
    });
  }

  @action
  createEvent() {
    let startDate = DateTime.fromJSDate(this.calendarClickInfo.date);
    let endDate = startDate.plus({ minutes: 30 });

    let title = '';
    if (
      isPresent(eventTypeNames[this.newEventObject.eventType]) &&
      this.newEventObject.eventType !== eventTypes.default
    ) {
      title =
        `${eventTypeNames[this.newEventObject.eventType]}: ${this.newEventObject.title}` ||
        '(No title)';
    } else {
      title = this.newEventObject.title || '(No title)';
    }

    let event = this.store.createRecord('event', {
      title,
      eventType: this.newEventObject.eventType,
      start: startDate.toJSDate(),
      end: endDate.toJSDate(),
      editable: true,
      notes: this.newEventObject.notes,
      allDay: this.newEventObject.allDay,
      backgroundColor: eventTypeColors[this.newEventObject.eventType]?.backgroundColor,
      borderColor: eventTypeColors[this.newEventObject.eventType]?.borderColor,
      textColor: eventTypeColors[this.newEventObject.eventType]?.textColor,
    });

    event.save().then(() => {
      this.calendar.addEvent(event);
      this.showAddEventDialog = false;
      this._clearSessionFields();
    });
  }

  @action
  saveEvent() {
    this.calendarClickInfo.event.setProp('title', this.selectedEvent.title);
    this.selectedEvent.save();

    this._clearSessionFields();
    this.showEditEventDialog = false;
  }

  @action
  deleteEvent() {
    this.calendarClickInfo.event.remove();
    this.selectedEvent.destroyRecord();
    this._clearSessionFields();
    this.showEditEventDialog = false;
  }

  @action
  async fetchWeeklyNotes() {
    let startOfWeek = this.currentDateTime.startOf('week');
    let endOfWeek = this.currentDateTime.endOf('week');

    await this.store
      .queryRecord('weekly-note', {
        start_date: startOfWeek.toISODate(),
        end_date: endOfWeek.toISODate(),
      })
      .then((notes) => {
        if (isPresent(notes)) {
          this.weeklyNotes = notes;
        } else {
          this.weeklyNotes = this.store.createRecord('weekly-note', {
            startDate: startOfWeek.toISODate(),
            endDate: endOfWeek.toISODate(),
          });
          this.weeklyNotes.save();
        }
      });
  }

  @action
  saveWeeklyNotes() {
    console.log('saving weekly notes');
    this.weeklyNotesEditor.save().then((outputData) => {
      console.log('saveWeeklyNotes', outputData.blocks);
      this.weeklyNotes.blocks = outputData.blocks;
      this.weeklyNotes.save();
    });
  }

  @action
  fetchShutdownStatus() {
    this.store
      .queryRecord('shutdown-status', {
        created_at: this.currentDateTime.toISODate(),
      })
      .then((response) => {
        if (isPresent(response)) {
          console.log('found shutdown status', response);
          this.shutdownStatus = response;
        } else {
          console.log('creating shutdown status', { created_at: this.currentDateTime.toISODate() });
          this.shutdownStatus = this.store.createRecord('shutdown-status', {
            createdAt: this.currentDateTime.toISODate(),
          });
          this.shutdownStatus.save();
        }
      });
  }

  @action
  toggleShutdownStatus() {
    this.shutdownStatus.complete = !this.shutdownStatus.complete;
    this.shutdownStatus.save();
  }

  @action
  registerKeypressListener() {
    document.addEventListener('keydown', (event) => {
      if (
        ignoredTargetTypes.includes(event.target.type) ||
        event.target.className.match(/ce-/g) ||
        event.target.className.match(/cdx-/g)
      ) {
        return;
      }

      switch (event.key) {
        case '[':
          this.previousDay();
          break;
        case ']':
          this.nextDay();
          break;
        case '.':
          this.moveToToday();
          break;
        case 'd':
          this.router.transitionTo('index');
          break;
        case 'w':
          this.router.transitionTo('week');
          break;
        case 'r':
          location.reload();
          break;
        case 'c':
          this.toggleShutdownStatus();
          break;
      }
    });
  }

  @action
  setupWeeklyNotesEditor(element) {
    console.log('setup editor', this.weeklyNotes.blocks.serialize());
    this.weeklyNotesEditor = new EditorJS({
      holder: element.id,
      tools: editorTools,
      data: {
        blocks: this.weeklyNotes.blocks.serialize(),
      },
      onChange: () => {
        this.saveWeeklyNotes();
      },
    });
  }

  async refreshEditorContent() {
    await this.weeklyNotesEditor.render({ blocks: this.weeklyNotes.blocks.serialize() });
  }

  _clearSessionFields() {
    this.calendarClickInfo = null;
    this.selectedEvent = null;
    this.newEventObject = {
      title: null,
      eventType: eventTypes.default,
      notes: '',
      allDay: false,
    };
  }
}
