import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { hoursOfTheDay } from 'blocco-js/models/constants';
import { inject as service } from '@ember/service';
import { isPresent } from '@ember/utils';
import { action } from '@ember/object';

export default class TopBar extends Component {
  @service store;
  @tracked showSettingsDialog = false;

  hoursOfTheDay = hoursOfTheDay;
  gridConfig;

  constructor() {
    super(...arguments);
    this.findOrCreateGridConfig();
  }

  @action
  saveDayStart(event) {
    this.gridConfig.dayStart = event.target.value;
    this.gridConfig.save();
  }

  @action
  saveDayEnd(event) {
    this.gridConfig.dayEnd = event.target.value;
    this.gridConfig.save();
  }

  findOrCreateGridConfig() {
    this.gridConfig = this.store.peekAll('grid-config').firstObject;

    if (!isPresent(this.gridConfig)) {
      this.gridConfig = this.store.createRecord('grid-config', {
        dayStart: '09:00:00',
        dayEnd: '19:00:00',
      });
      this.gridConfig.save();
    }
  }
}
