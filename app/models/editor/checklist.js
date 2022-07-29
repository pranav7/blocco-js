import { fragment } from 'ember-data-model-fragments/attributes';
import Block from './block';

export default class Checklist extends Block {
  @fragment('editor/checklist-data') data;
}
