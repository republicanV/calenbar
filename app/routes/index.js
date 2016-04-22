import Ember from 'ember';

export default Ember.Route.extend({
	start_date:  new Date(), // Current date

	beforeModel() {
	    /*this.transitionTo('month');*/
	    let _date = this.get('start_date');
	    this.transitionTo('/month/'+_date.getTime());
	},
	/*model() {
		return this.store.findAll('holiday');
	}*/

});
