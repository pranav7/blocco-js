import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { hoursOfTheDay } from 'blocco-js/models/constants';
import { isPresent } from '@ember/utils';
import { action } from '@ember/object';

export default class TopBar extends Component {
  @service store;
  @tracked showSettingsDialog = false;

  hoursOfTheDay = hoursOfTheDay;
  gridConfig;

  constructor() {
    super(...arguments);
    this.gridConfig = this.store.peekAll('grid-config').firstObject;
    console.log('topbar', this.gridConfig);
    this.findOrCreateGridConfig();
  }

  @action
  saveDayStart(event) {
    console.log(event.target.value);
    this.gridConfig.dayStart = event.target.value;
    this.gridConfig.save();
  }

  @action
  saveDayEnd(event) {
    this.gridConfig.dayEnd = event.target.value;
    this.gridConfig.save();
  }

  findOrCreateGridConfig() {
    if (!isPresent(this.gridConfig)) {
      this.gridConfig = this.store.createRecord('grid-config', {
        dayStart: '09:00:00',
        dayEnd: '18:30:00',
      });
      this.gridConfig.save();
    }
  }
}
