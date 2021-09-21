import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class Test extends Component {
  @tracked isOpen = false;
}
