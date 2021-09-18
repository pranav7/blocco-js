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

  constructor({ title, start, end, editable }) {
    this.title = title;
    this.start = start;
    this.end = end;
    this.editable = editable || true;
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
      new Event({
        title: 'Stand up',
        start: this.dateTime.fromObject({ hour: 9, minute: 30 }).toString(),
        end: this.dateTime.fromObject({ hour: 9, minute: 45 }).toString(),
        editable: false,
      }),
    );
  }

  @action
  renderCalendar(element) {
    let calendar = new Calendar(element, {
      plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
      initialView: 'timeGridDay',
      height: 800,
      expandRows: true,
      editable: true,
      headerToolbar: false,
      nowIndicator: true,
      slotMinTime: this.gridConfig.start,
      slotMaxTime: this.gridConfig.end,
      events: this.events,
    });
    calendar.render();
  }
}
