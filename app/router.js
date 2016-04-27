import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('week', {path: '/week/'});
  this.route('week', {path: '/week/:timestamp'}, function() {
    this.route('modal', {path: '/:_event_id'});
  });

  this.route('month', {path:'/month/'});
  this.route('month', {path:'/month/:timestamp'}, function() {
    this.route('modal', {path: '/:_event_id'});
  });

  this.route('week-hours', {path: '/week-hours/'});
  this.route('week-hours', {path: '/week-hours/:timestamp'}, function() {
    this.route('modal', {path: '/:_event_id'});
  });
  this.route('newmonth', {path: '/newmonth/'});
  this.route('newmonth', {path: '/newmonth/:timestamp'});
});


export default Router;
