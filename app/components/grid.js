import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { action } from '@ember/object';
import { DateTime } from 'luxon';

class GridConfig {
  @tracked start;
  @tracked end;

  constructor(start, end) {
    this.start = start;
    this.end = end;
  }
}

class Event {
  @tracked title;
  @tracked start;
  @tracked end;
  @tracked editable;

  constructor({ title, start, end, editable, defaultTimedEventDuration, color }) {
    this.title = title;
    this.start = start;
    this.end = end;
    this.editable = editable || false;
    this.color = color;
  }
}

export default class Grid extends Component {
  gridConfig;
  dateTime = DateTime;
  events = [];
  calendar;

  @tracked showAddEventDialog = false;
  @tracked newEventTitle;
  @tracked newEventInfo;

  constructor() {
    super(...arguments);
    this.gridConfig = new GridConfig('9:00:00', '18:00:00');
    this.events.push(
      // fixed events
      new Event({
        title: 'Shower + Coffee',
        start: this.dateTime.fromObject({ hour: 9 }).toString(),
        end: this.dateTime.fromObject({ hour: 9, minute: 30 }).toString(),
        color: '#2B4162',
      }),
      new Event({
        title: 'Stand up',
        start: this.dateTime.fromObject({ hour: 9, minute: 30 }).toString(),
        end: this.dateTime.fromObject({ hour: 9, minute: 45 }).toString(),
        color: '#2B4162',
      }),
      new Event({
        title: 'Lunch [Block]',
        start: this.dateTime.fromObject({ hour: 12, minute: 30 }).toString(),
        end: this.dateTime.fromObject({ hour: 13, minute: 30 }).toString(),
        color: '#2B4162',
      }),
      new Event({
        title: 'Wrap up and shutdown',
        start: this.dateTime.fromObject({ hour: 17, minute: 30 }).toString(),
        end: this.dateTime.fromObject({ hour: 18 }).toString(),
        color: '#2B4162',
      }),
      // todays events
      new Event({
        title: 'w/ Eamon',
        start: this.dateTime.fromObject({ hour: 9, minute: 45 }).toString(),
        end: this.dateTime.fromObject({ hour: 10, minute: 30 }).toString(),
      }),
      new Event({
        title: 'Rock&Roll w/ Ember.js',
        start: this.dateTime.fromObject({ hour: 11, minute: 0 }).toString(),
        end: this.dateTime.fromObject({ hour: 12, minute: 0 }).toString(),
      }),
      new Event({
        title: 'Blocco',
        start: this.dateTime.fromObject({ hour: 14, minute: 15 }).toString(),
        end: this.dateTime.fromObject({ hour: 14, minute: 45 }).toString(),
        color: 'green',
      }),
      new Event({
        title: 'SMS Opt-ins',
        start: this.dateTime.fromObject({ hour: 15, minute: 0 }).toString(),
        end: this.dateTime.fromObject({ hour: 16, minute: 30 }).toString(),
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
      dateClick: this.dateClick,
    });
    this.calendar.render();
  }

  @action
  dateClick(info) {
    this.showAddEventDialog = true;
    this.newEventInfo = info;
  }

  @action
  createEvent() {
    this.calendar.addEvent(
      new Event({
        title: this.newEventTitle || 'New event',
        start: this.newEventInfo.dateStr,
        editable: true,
      }),
    );

    this.showAddEventDialog = false;
    this.newEventInfo = null;
    this.newEventTitle = null;
  }

  get today() {
    let dateTime = DateTime.local();
    return {
      date: dateTime.toFormat('d'),
      month: dateTime.toFormat('LLLL'),
      year: dateTime.toFormat('yyyy'),
      day: dateTime.toFormat('cccc'),
    };
  }
}
