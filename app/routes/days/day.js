import Route from '@ember/routing/route';
import { tracked } from '@glimmer/tracking';

class Day {
  @tracked slug;

  constructor(slug) {
    this.slug = slug;
  }
}

export default class DayRoute extends Route {
  model(params) {
    return new Day(params.slug);
  }
}
