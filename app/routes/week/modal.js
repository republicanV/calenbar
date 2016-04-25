import Ember from 'ember';

export default Ember.Route.extend({
// Inject data storage
	holidayStorage: Ember.inject.service(),

	actions: {
	// Back to parent route when 
		closeModalDialog() {
			this.transitionTo('week');
		},// end closeModalDialog()

		deleteEvent(id) {
			var _event_data = this.get('holidayStorage');
			
				_event_data.removeItem(id).then(() => {
					this.transitionTo('week');
				});
		}
	},// end actions

	model(params) {
		
		return this.get('holidayStorage').getDataById(+params._event_id);

	}// end model
});
