import Model, { attr } from '@ember-data/model';

export default class EventModel extends Model {
  @attr('string') title;
  @attr('date') start;
  @attr('date') end;
  @attr('boolean', { defaultValue: false }) editable;
  @attr('string') color;
}
