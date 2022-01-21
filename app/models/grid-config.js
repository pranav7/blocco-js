import Model, { attr } from '@ember-data/model';

export default class GridConfig extends Model {
  @attr('string') dayStart;
  @attr('string') dayEnd;
}
