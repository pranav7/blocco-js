import { fragment } from 'ember-data-model-fragments/attributes';
import Block from './block';

export default class List extends Block {
  @fragment('editor/list-item') data;
}
