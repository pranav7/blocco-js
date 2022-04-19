import Model, { attr } from '@ember-data/model';
import { DateTime } from 'luxon';

export const EVENT_TYPES = {
  default: 0,
  focus: 1,
  outOfOffice: 2,
};

export default class EventModel extends Model {
  @attr('string') title;
  @attr('date') start;
  @attr('date') end;
  @attr('boolean', { defaultValue: false }) editable;
  @attr('boolean', { defaultValue: false }) allDay;
  @attr('number') eventType;
  @attr('string') color;
  @attr('string') backgroundColor;
  @attr('string') borderColor;
  @attr('string') textColor;

  get startDate() {
    return DateTime.fromJSDate(this.start);
  }

  get endDate() {
    return DateTime.fromJSDate(this.end);
  }

  get classNames() {
    return ['event-override'];
  }
}
