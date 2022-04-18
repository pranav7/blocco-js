import Model, { attr } from '@ember-data/model';
import { DateTime } from 'luxon';

export const EVENT_TYPES = {
  default: 0,
  focus: 1,
  meeting: 2,
};

export default class EventModel extends Model {
  @attr('string') title;
  @attr('date') startAt;
  @attr('date') endAt;
  @attr('boolean', { defaultValue: false }) editable;
  @attr('boolean', { defaultValue: false }) allDay;
  @attr('number') eventType;
  @attr('string') colorHex;

  get startDate() {
    return DateTime.fromJSDate(this.startAt);
  }

  get endDate() {
    return DateTime.fromJSDate(this.endAt);
  }

  get start() {
    return this.startAt;
  }

  get end() {
    return this.endAt;
  }
}
