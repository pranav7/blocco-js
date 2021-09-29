import Model, { attr } from '@ember-data/model';
import { DateTime } from 'luxon';

export default class EventModel extends Model {
  @attr('string') title;
  @attr('date') start;
  @attr('date') end;
  @attr('boolean', { defaultValue: false }) editable;
  @attr('string') color;

  get startDate() {
    return DateTime.fromJSDate(this.start);
  }

  get endDate() {
    return DateTime.fromJSDate(this.end);
  }
}
