import Ember from 'ember';

export default Ember.Route.extend({
// Inject data storage
	holidayStorage: Ember.inject.service(),

	actions: {
	// Back to parent route when 
		closeModalDialog() {
			this.transitionTo('month');
		}// end closeModalDialog()
	},// end actions

	model(params) {

		return this.get('holidayStorage').getDataById(+params._event_id);

	}// end model
});
