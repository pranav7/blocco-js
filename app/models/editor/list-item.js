import { attr } from '@ember-data/model';
import Data from './text';

export default class ListItem extends Data {
  @attr('string') style;
  @attr('array') items;
}
