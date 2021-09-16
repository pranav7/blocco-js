import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import moment from 'moment';
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';

class GridConfig {
  @tracked start;
  @tracked end;

  constructor(start, end) {
    this.start = start;
    this.end = end;
  }
}

export default class Grid extends Component {
  gridConfig;

  constructor() {
    super(...arguments);

    this.gridConfig = new GridConfig(9, 18);
  }

  get timeSlots() {
    let slots = [];
    let startTime = moment(this.gridConfig.start, 'HH::mm');
    let endTime = moment(this.gridConfig.end, 'HH::mm');

    while (startTime <= endTime) {
      slots.push(startTime.format('h:mm a'));
      startTime.add(60, 'minutes');
    }

    return slots;
  }

  renderCalendar(element) {
    let calendar = new Calendar(element, {
      plugins: [dayGridPlugin],
      initialView: 'dayGridWeek',
    });
    calendar.render();
  }
}
