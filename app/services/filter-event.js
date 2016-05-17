import Ember from 'ember';

export default Ember.Service.extend(Ember.Evented, {

	filters: null,

	init() {
		this._super(...arguments);
		this.set('filters', []);
	},

	onFilter(elId) {
		var elem = this.filters.indexOf(elId);
		var filterStore = this.get('filters');
		if (elem === -1) {
			filterStore.push(elId);
		}
		
		this.trigger('filterClick', elId);	
	},

	clearFilter() {
		var filterStore = this.get('filters');
		filterStore.length = 0;
		console.log(filterStore);
	}
	
});
