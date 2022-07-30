import { attr } from '@ember-data/model';
import Data from './data';

export default class ListItem extends Data {
  @attr('string') style;
  @attr('array') items;

  constructor() {
    super(...arguments);
    console.log('Data > ListItem initialized');
  }
}
