import Model, { attr } from '@ember-data/model';

export default class ShutdownStatus extends Model {
  @attr('boolean') complete;
  @attr createdAt;

  get isComplete() {
    return this.complete;
  }
}
