import { attr } from '@ember-data/model';
import Fragment from 'ember-data-model-fragments/fragment';
import { fragment } from 'ember-data-model-fragments/attributes';

export default class Block extends Fragment {
  @attr('string') type;
  @fragment('editor/data') data;

  constructor() {
    super(...arguments);
    console.log('Block initialized');
  }
}
