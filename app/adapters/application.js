import RESTAdapter from '@ember-data/adapter/rest';

export default class ApplicationAdapter extends RESTAdapter {
  host = 'http://localhost:3000';
}

// export { default } from 'ember-local-storage/adapters/local';
