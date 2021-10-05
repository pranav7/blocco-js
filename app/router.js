import EmberRouter from '@ember/routing/router';
import config from 'blocco-js/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('year', { path: ':year' }, function () {
    this.route('month', { path: ':month' }, function () {
      this.route('day', { path: ':day' });
    });
  });
});
