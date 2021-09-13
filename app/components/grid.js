import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import moment from 'moment';

class GridConfig {
  @tracked start;
  @tracked end;

  constructor(start, end) {
    this.start = start;
    this.end = end;
  }
}

export default class GridComponent extends Component {
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
      slots.push(startTime.format('h:mm'));
      startTime.add(15, 'minutes');
    }

    return slots;
  }
}
