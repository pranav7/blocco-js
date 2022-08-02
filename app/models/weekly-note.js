import Model, { attr } from '@ember-data/model';
import { fragmentArray } from 'ember-data-model-fragments/attributes';

export default class WeeklyNoteModel extends Model {
  @attr('string') notes;
  @attr startDate;
  @attr endDate;
  @attr('number') weekNumber;
  @attr('number') weekYear;
  @fragmentArray('editor/block', {
    polymorphic: true,
    typeKey: (data) => `editor/${data.type}`,
    defaultValue: [{ type: 'paragraph', data: { text: '' } }],
  })
  blocks;
}
