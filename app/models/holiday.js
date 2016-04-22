import DS from 'ember-data';

export default DS.Model.extend({
	id: DS.attr(),
	title: DS.attr(),
	date: DS.attr()
});
