import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { DateTime } from 'luxon';

export default class TopBar extends Component {
  @service store;

  get today() {
    return {
      date: this.args.currentDateTime.toFormat('d'),
      month: this.args.currentDateTime.toFormat('LLLL'),
      year: this.args.currentDateTime.toFormat('yyyy'),
      day: this.args.currentDateTime.toFormat('cccc'),
    };
  }

  @action
  syncTomorrowsEvents() {
    fetch('http://localhost:3000/google_calendar/sync_events', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        time_min: DateTime.local().plus({ days: 1 }).startOf('day').toISO(),
        time_max: DateTime.local().plus({ days: 1 }).endOf('day').toISO(),
      }),
    }).then(() => {
      this.store.findAll('event');
    });
  }

  @action
  syncTodaysEvents() {
    fetch('http://localhost:3000/google_calendar/sync_events', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(() => {
      this.store.findAll('event');
    });
  }
}
