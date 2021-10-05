import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { DateTime } from 'luxon';
import { tracked } from '@glimmer/tracking';

class GridConfig {
  @tracked start;
  @tracked end;

  constructor({ start, end }) {
    this.start = start;
    this.end = end;
  }
}

export default class DayRoute extends Route {
  @service store;

  model(params) {
    let date = DateTime.fromObject({
      year: this.paramsFor('year').year,
      month: this.paramsFor('year.month').month,
      day: Number(params.day),
    });

    return {
      events: this.store.findAll('event'),
      date,
      gridConfig: new GridConfig({ start: '9:00:00', end: '18:00:00' }),
    };
  }
}
