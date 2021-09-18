import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { action } from '@ember/object';

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
    this.gridConfig = new GridConfig('9:00:00', '18:00:00');
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
    });
    calendar.render();
  }
}
