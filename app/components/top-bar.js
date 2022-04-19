import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { DateTime } from 'luxon';

export default class TopBar extends Component {
  @service store;
  @tracked currentDateTime = DateTime.local();

  get today() {
    return {
      date: this.currentDateTime.toFormat('d'),
      month: this.currentDateTime.toFormat('LLLL'),
      year: this.currentDateTime.toFormat('yyyy'),
      day: this.currentDateTime.toFormat('cccc'),
    };
  }

  @action
  syncTodaysEvents() {
    console.log('syncing...');
    fetch('http://localhost:3000/google_calendar/sync_todays_events', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      console.log('sycning finished', response);
      this.store.findAll('event');
    });
  }
}
