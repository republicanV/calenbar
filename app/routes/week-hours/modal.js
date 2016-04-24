import Ember from 'ember';

export default Ember.Route.extend({
// Inject data storage
	holidayStorage: Ember.inject.service(),

	_event_id: null,

	actions: {
	// Back to parent route when 
		closeModalDialog() {
			this.transitionTo('week-hours');
		},// end closeModalDialog()

		deleteEvent(id) {
			var _event_data = this.get('holidayStorage');
					_event_data.removeItem(id).then(() => {
						this.transitionTo('week-hours');
					});
		}
	},// end actions

	model(params) {
		var _params_event_id = +params._event_id;
		var _event_data = this.get('holidayStorage').getDataById(_params_event_id);

		return _event_data;
	}// end model
});
