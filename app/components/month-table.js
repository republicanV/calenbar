import Ember from 'ember';

export default Ember.Component.extend({
// Inject routing because of deprecation transition from view 
	routing: Ember.inject.service('-routing'),

	_today_string: null,

	_timer: null,

	actions: {
	// Take the event id, get needed route from the injected routing service
	// and redirect to nested route with modal window 
		showModalDialog(event) {
			var _event_id = event.id;
			this.get('routing.router').transitionTo('month.modal', _event_id);
		},// end showModalDialog()
		
	},// end actions 

// Mark current date and activate today button
	_getToday() {
		var _today_checked = this.get('_today_string');

		var today = new Date();
		var _real_time = today.getFullYear() + '-' + 
					   	 today.getMonth() + '-' +
					   	 today.getDate();

   	// Set _today_string to _real_time,
   	// for get class name with current date
   	// add or remove 'today' class depend on _today_checked
   	    if (_today_checked !== _real_time) {
			this.set('_today_string', _real_time);

			if (_today_checked !== null) {
				Ember.$('.today').removeClass('today');
			}

			Ember.$('td.'+ _real_time).addClass('today');
		} 

	// Add 'active' class to today-btn depend on current day 
		var _today_class = Ember.$('.today');
		
		if (_today_class.hasClass('today')) {
			Ember.$('a#cal-btn-today').addClass('active');
		} 
		
	}//end _getToday()

,	didRender() {
		var _self = this;

		if (_self._timer) {
			clearInterval(_self._timer);
			Ember.$('.today').removeClass('today');
		}

	// Invoke _getToday() once for mark today without delay
    	this._getToday(); 
		_self._timer = setInterval(function(){ _self._getToday() }, 1000);
	},//end didRender()

	willDestroyElement() {
		var _self = this;
		clearInterval(_self._timer);
	},

	didUpdate() {
		var _self = this;
		
		_self.set('_today_string', null);
	},

});
