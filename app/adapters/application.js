import RESTAdapter from '@ember-data/adapter/rest';
import { decamelize, underscore } from '@ember/string';
import { pluralize } from 'ember-inflector';

export default class ApplicationAdapter extends RESTAdapter {
  host = 'http://localhost:3000';

  pathForType(type) {
    return pluralize(underscore(decamelize(type)));
  }
}

// export { default } from 'ember-local-storage/adapters/local';
