import Model, { attr } from '@ember-data/model';

export default class WeeklyNoteModel extends Model {
  @attr('string') notes;
  @attr startDate;
  @attr endDate;
}
