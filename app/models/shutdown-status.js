import Model, { attr } from '@ember-data/model';

export default class ShutdownStatus extends Model {
  @attr('boolean', { default: false }) complete;
  @attr('number') weekDay;
  @attr('number') weekNumber;
  @attr('number') weekYear;
  @attr createdAt;

  get isComplete() {
    return this.complete;
  }
}
