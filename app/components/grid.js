import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { action } from '@ember/object';
import { DateTime } from 'luxon';

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

  @tracked events = [];
  @tracked calendar;
  @tracked showAddEventDialog = false;
  @tracked newEventTitle;
  @tracked newEventInfo;
  @tracked currentDateTime = DateTime.local();

  constructor() {
    super(...arguments);
    this.gridConfig = new GridConfig({ start: '9:00:00', end: '18:00:00' });
    this.args.events.map((event) => this.events.push(event.toJSON({ includeId: true })));
    this.events.push(
      // fixed events
      this.store.createRecord('event', {
        title: '☕️ Coffee + Prep',
        startTime: '9:00',
        endTime: '9:30',
        daysOfWeek: [1, 2, 3, 4, 5],
        color: '#2B4162',
      }),
      this.store.createRecord('event', {
        title: 'Standup',
        startTime: '9:30',
        endTime: '9:45',
        daysOfWeek: [1, 2, 3, 4, 5],
        color: '#2B4162',
      }),
      this.store.createRecord('event', {
        title: '🍕 Lunch',
        startTime: '12:30',
        endTime: '13:30',
        daysOfWeek: [1, 2, 3, 4, 5],
        color: '#2B4162',
      }),
      this.store.createRecord('event', {
        title: 'Wrap up and shutdown',
        startTime: '17:30',
        endTime: '18:00',
        daysOfWeek: [1, 2, 3, 4, 5],
        color: '#2B4162',
      }),
    );
  }

  @action
  renderCalendar(element) {
    this.calendar = new Calendar(element, {
      plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
      headerToolbar: false,
      initialView: 'timeGridDay',
      height: 675,
      expandRows: true,
      editable: true,
      nowIndicator: true,
      slotMinTime: this.gridConfig.start,
      slotMaxTime: this.gridConfig.end,
      events: this.events,
      dayHeaders: false,
      defaultTimedEventDuration: '00:30',
      slotDuration: '00:15:00',
      dateClick: this.dateClick,
      eventResize: this.eventResize,
      eventDrop: this.eventDrop,
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
  dateClick(info) {
    this.showAddEventDialog = true;
    this.newEventInfo = info;
  }

  @action
  eventResize(info) {
    let event = this.store.peekRecord('event', info.event.id);
    event.end = event.endDate
      .plus({
        days: info.endDelta.days,
        milliseconds: info.endDelta.milliseconds,
      })
      .toJSDate();
    event.save();
  }

  @action
  eventDrop(info) {
    let event = this.store.peekRecord('event', info.event.id);
    event.start = event.startDate.plus({ milliseconds: info.delta.milliseconds }).toJSDate();
    event.end = event.endDate.plus({ milliseconds: info.delta.milliseconds }).toJSDate();
    event.save();
  }

  @action
  createEvent() {
    let startDate = DateTime.fromJSDate(this.newEventInfo.date);
    let endDate = startDate.plus({ minutes: 30 });

    let event = this.store.createRecord('event', {
      title: this.newEventTitle || 'New event',
      start: startDate.toJSDate(),
      end: endDate.toJSDate(),
      editable: true,
    });
    event.save();
    this.calendar.addEvent(event);

    this.showAddEventDialog = false;
    this.newEventInfo = null;
    this.newEventTitle = null;
  }

  get today() {
    return {
      date: this.currentDateTime.toFormat('d'),
      month: this.currentDateTime.toFormat('LLLL'),
      year: this.currentDateTime.toFormat('yyyy'),
      day: this.currentDateTime.toFormat('cccc'),
    };
  }
}
