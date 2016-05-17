import Ember from 'ember';

export default Ember.Component.extend({
	filterEvent: Ember.inject.service(),

	actions: {
		
		onFilter(elId) {
			this.get('filterEvent').onFilter(elId);
			
			//this.sendAction('action', 'onFilter', filters);
		},

		clearFilter() {
			this.get('filterEvent').clearFilter();
		},
	},

	/*click(e) {
	    this.sendAction('action', 'onFilter');
	},*/
});
