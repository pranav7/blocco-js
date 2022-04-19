// import JSONAPISerializer from '@ember-data/serializer/json-api';
// export default class ApplicationSerializer extends JSONAPISerializer {}

// export { default } from 'ember-local-storage/serializers/serializer';

import RESTSerializer from '@ember-data/serializer/rest';
import { underscore } from '@ember/string';

export default class ApplicationSerializer extends RESTSerializer {
  keyForAttribute(attr) {
    return underscore(attr);
  }
}
