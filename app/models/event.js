import Model, { attr } from '@ember-data/model';
import { array } from 'ember-data-model-fragments/attributes';

import { isPresent } from '@ember/utils';
import { DateTime } from 'luxon';

export const eventTypes = {
  default: 0,
  focus: 1,
  outOfOffice: 2,
  break: 3,
  meeting: 4,
};

export const eventTypeNames = {
  [eventTypes.default]: 'Default',
  [eventTypes.focus]: '🎧 Focus',
  [eventTypes.outOfOffice]: '🚫 OOO',
  [eventTypes.break]: '🍕 Break',
  [eventTypes.meeting]: '💬 Meeting',
};

export const eventTypeColors = {
  [eventTypes.break]: {
    backgroundColor: '#e2f9ff',
    borderColor: '#3788d8',
    textColor: '#346da5',
  },
  [eventTypes.outOfOffice]: {
    backgroundColor: '#e2f9ff',
    borderColor: '#3788d8',
    textColor: '#346da5',
  },
  [eventTypes.meeting]: {
    backgroundColor: '#ffcdb3',
    borderColor: '#fe7032',
    textColor: '#ca3800',
  },
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
  @attr('string') notes;
  @attr('string') googleEventId;
  @attr('string') meetingLink;
  @attr('string') creator;
  @array('string') attendees;

  get isExternal() {
    return isPresent(this.googleEventId);
  }

  get startDate() {
    return DateTime.fromJSDate(this.start);
  }

  get endDate() {
    return DateTime.fromJSDate(this.end);
  }

  get classNames() {
    return ['event__override'];
  }
}
