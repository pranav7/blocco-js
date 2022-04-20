import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { action } from '@ember/object';
import { DateTime } from 'luxon';
import { eventTypes, eventTypeEmoji } from 'blocco-js/models/event';
import { isPresent } from '@ember/utils';

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

  gridConfig;
  eventTypes = eventTypes;

  @tracked events = [];
  @tracked calendar;
  @tracked showAddEventDialog = false;
  @tracked showEditEventDialog = false;
  @tracked newEventObject = {};
  @tracked calendarClickInfo;
  @tracked selectedEvent;
  @tracked currentDateTime = DateTime.local();

  constructor() {
    super(...arguments);

    this.gridConfig = new GridConfig({ start: '9:00:00', end: '18:30:00' });
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
  previousDay() {
    this.currentDateTime = this.currentDateTime.plus({ day: -1 });
    this.calendar.prev();
  }

  @action
  nextDay() {
    this.currentDateTime = this.currentDateTime.plus({ day: 1 });
    this.calendar.next();
  }

  @action
  moveToToday() {
    this.currentDateTime = DateTime.local();
    this.calendar.today();
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

    let title = null;
    if (isPresent(eventTypeEmoji[this.newEventObject.eventType])) {
      title =
        `${eventTypeEmoji[this.newEventObject.eventType]} ${this.newEventObject.title}` ||
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
