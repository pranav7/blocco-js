import { attr } from '@ember-data/model';
import Fragment from 'ember-data-model-fragments/fragment';

export default class Data extends Fragment {
  @attr('string') text;
  @attr('string') style;
  @attr('array') items;

  constructor() {
    super(...arguments);
    console.log('Data initialized');
  }
}
