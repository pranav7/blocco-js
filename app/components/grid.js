import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { action } from '@ember/object';
import { DateTime } from 'luxon';

class GridConfig {
  @tracked start;
  @tracked end;

  constructor({ start, end }) {
    this.start = start;
    this.end = end;
  }
}

export default class Grid extends Component {
  @service store;

  gridConfig;
  dateTime = DateTime;
  events = [];
  calendar;

  @tracked showAddEventDialog = false;
  @tracked newEventTitle;
  @tracked newEventInfo;

  constructor() {
    super(...arguments);
    this.gridConfig = new GridConfig({ start: '9:00:00', end: '18:00:00' });
    this.args.events.map((event) => this.events.push(event.toJSON({ includeId: true })));
    this.events.push(
      // fixed events
      this.store.createRecord('event', {
        title: '☕️ Coffee + Prep',
        start: this.dateTime.fromObject({ hour: 9, minute: 0 }).toString(),
        end: this.dateTime.fromObject({ hour: 9, minute: 30 }).toString(),
        color: '#2B4162',
      }),
      this.store.createRecord('event', {
        title: 'Stand up',
        start: this.dateTime.fromObject({ hour: 9, minute: 30 }).toString(),
        end: this.dateTime.fromObject({ hour: 9, minute: 45 }).toString(),
        color: '#2B4162',
      }),
      this.store.createRecord('event', {
        title: '🍕 Lunch',
        start: this.dateTime.fromObject({ hour: 12, minute: 30 }).toString(),
        end: this.dateTime.fromObject({ hour: 13, minute: 30 }).toString(),
        color: '#2B4162',
      }),
      this.store.createRecord('event', {
        title: 'Wrap up and shutdown',
        start: this.dateTime.fromObject({ hour: 17, minute: 30 }).toString(),
        end: this.dateTime.fromObject({ hour: 18 }).toString(),
        color: '#2B4162',
      }),
      // today's events
    );
  }

  @action
  renderCalendar(element) {
    this.calendar = new Calendar(element, {
      plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
      headerToolbar: false,
      initialView: 'timeGridDay',
      height: 675,
      expandRows: true,
      editable: true,
      nowIndicator: true,
      slotMinTime: this.gridConfig.start,
      slotMaxTime: this.gridConfig.end,
      events: this.events,
      dayHeaders: false,
      defaultTimedEventDuration: '00:30',
      dateClick: this.dateClick,
      eventResize: this.eventResize,
      eventDrop: this.eventDrop,
    });
    this.calendar.render();
  }

  @action
  dateClick(info) {
    this.showAddEventDialog = true;
    this.newEventInfo = info;
  }

  @action
  eventResize(info) {
    let event = this.store.peekRecord('event', info.event.id);
    event.end = event.endDate
      .plus({
        days: info.endDelta.days,
        milliseconds: info.endDelta.milliseconds,
      })
      .toJSDate();
    event.save();
  }

  @action
  eventDrop(info) {
    let event = this.store.peekRecord('event', info.event.id);
    event.start = event.startDate.plus({ milliseconds: info.delta.milliseconds }).toJSDate();
    event.end = event.endDate.plus({ milliseconds: info.delta.milliseconds }).toJSDate();
    event.save();
  }

  @action
  createEvent() {
    let startDate = DateTime.fromJSDate(this.newEventInfo.date);
    let endDate = startDate.plus({ minutes: 30 });

    let event = this.store.createRecord('event', {
      title: this.newEventTitle || 'New event',
      start: startDate.toJSDate(),
      end: endDate.toJSDate(),
      editable: true,
    });
    event.save();
    this.calendar.addEvent(event);

    this.showAddEventDialog = false;
    this.newEventInfo = null;
    this.newEventTitle = null;
  }

  get today() {
    let dateTime = DateTime.local();
    return {
      date: dateTime.toFormat('d'),
      month: dateTime.toFormat('LLLL'),
      year: dateTime.toFormat('yyyy'),
      day: dateTime.toFormat('cccc'),
    };
  }
}
