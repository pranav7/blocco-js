import { attr } from '@ember-data/model';
import Data from './data';

export default class ChecklistItem extends Data {
  @attr('boolean') checked;
}
