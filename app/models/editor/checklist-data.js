import { attr } from '@ember-data/model';
import { fragmentArray } from 'ember-data-model-fragments/attributes';
import Data from './text';

export default class ChecklistData extends Data {
  @attr('boolean') checked;
  @fragmentArray('editor/checklist-item') items;
}
