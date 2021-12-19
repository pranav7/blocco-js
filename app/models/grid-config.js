import Model, { attr } from '@ember-data/model';

export default class GridConfig extends Model {
  @attr('date') dayStart;
  @attr('date') dayEnd;
}
