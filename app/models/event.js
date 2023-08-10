import Model, { attr } from '@ember-data/model';
import { array } from 'ember-data-model-fragments/attributes';

import { isPresent } from '@ember/utils';
import { DateTime } from 'luxon';

export const eventTypes = {
  default: 'default',
  focus: 'focusTime',
  outOfOffice: 'outOfOffice',
  break: 'break',
  meeting: 'meeting',
};

export const eventTypeNames = {
  [eventTypes.default]: 'Default',
  [eventTypes.focus]: '🎧 Focus',
  [eventTypes.outOfOffice]: '🚫 OOO',
  [eventTypes.break]: '🍕 Break',
  [eventTypes.meeting]: '💬 Meeting',
};

export const eventTypeStyles = {
  [eventTypes.break]: {
    backgroundColor: '#e2f9ff',
    borderColor: '#3788d8',
    textColor: '#346da5',
    classNames: ['calendar-event', 'calendar-event__break'],
  },
  [eventTypes.outOfOffice]: {
    backgroundColor: '#e2f9ff',
    borderColor: '#3788d8',
    textColor: '#346da5',
    classNames: ['calendar-event', 'calendar-event__out-of-office'],
  },
  [eventTypes.meeting]: {
    backgroundColor: '#ffcdb3',
    borderColor: '#fe7032',
    textColor: '#ca3800',
    classNames: ['calendar-event'],
  },
};

export default class EventModel extends Model {
  @attr('string') title;
  @attr('date') start;
  @attr('date') end;
  @attr('boolean', { defaultValue: false }) editable;
  @attr('boolean', { defaultValue: false }) allDay;
  @attr('string') eventType;
  @attr('string') color;
  @attr('string') notes;
  @attr('string') googleEventId;
  @attr('string') meetingLink;
  @attr('string') creator;
  @array('string') attendees;

  get backgroundColor() {
    return eventTypeStyles[this.eventType]?.backgroundColor;
  }

  get borderColor() {
    return eventTypeStyles[this.eventType]?.borderColor;
  }

  get textColor() {
    return eventTypeStyles[this.eventType]?.textColor;
  }

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
    return eventTypeStyles[this.eventType]?.classNames || ['calendar-event'];
  }
}
