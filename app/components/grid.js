import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import luxonPlugin from '@fullcalendar/luxon';
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

  constructor({ title, start, end, editable }) {
    this.title = title;
    this.start = start;
    this.end = end;
    this.editable = editable || false;
  }
}

export default class Grid extends Component {
  gridConfig;
  dateTime = DateTime;
  events = [];

  constructor() {
    super(...arguments);
    this.gridConfig = new GridConfig('9:00:00', '18:00:00');
    this.events.push(
      // fixed events
      new Event({
        title: 'Shower + Coffee',
        start: this.dateTime.fromObject({ hour: 9 }).toString(),
        end: this.dateTime.fromObject({ hour: 9, minute: 30 }).toString(),
      }),
      new Event({
        title: 'Stand up',
        start: this.dateTime.fromObject({ hour: 9, minute: 30 }).toString(),
        end: this.dateTime.fromObject({ hour: 9, minute: 45 }).toString(),
      }),
      new Event({
        title: 'Lunch [Block]',
        start: this.dateTime.fromObject({ hour: 13 }).toString(),
        end: this.dateTime.fromObject({ hour: 13, minute: 30 }).toString(),
      }),
      new Event({
        title: 'Wrap up and shutdown',
        start: this.dateTime.fromObject({ hour: 17, minute: 30 }).toString(),
        end: this.dateTime.fromObject({ hour: 18 }).toString(),
      }),
      // todays events
      new Event({
        title: 'w/ Eamon',
        start: this.dateTime.fromObject({ hour: 9, minute: 45 }).toString(),
        end: this.dateTime.fromObject({ hour: 10, minute: 15 }).toString(),
      }),
    );
  }

  @action
  renderCalendar(element) {
    let calendar = new Calendar(element, {
      plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
      headerToolbar: false,
      initialView: 'timeGridDay',
      height: 800,
      expandRows: true,
      editable: true,
      nowIndicator: true,
      slotMinTime: this.gridConfig.start,
      slotMaxTime: this.gridConfig.end,
      events: this.events,
      dayHeaders: false,
    });
    calendar.render();
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
