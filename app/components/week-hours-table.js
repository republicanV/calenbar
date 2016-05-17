import Ember from 'ember';

export default Ember.Component.extend({
// Inject routing because of deprecation transition from view 
	routing: Ember.inject.service('-routing'),

	holidayStorage: Ember.inject.service(),

	_today_string: null,
	_timer: null,
	_week_nowmarker: null,
	_top: null,

	actions: {
	// Take the event id, get needed route from the injected routing service
	// and redirect to nested route with modal window 
		showModalDialog(event) {
			var _event_id = event.id;
			this.get('routing.router').transitionTo('week-hours.modal', _event_id);
		},// end showModalDialog()
		
	},// end actions

// Calculate top position and set the event.top 
	_setPositionTop() {

		var _day_height = Ember.$('td.day').height();// One day height 
		var _min_in_day = 60 * 24; 
		var _minute_height = _day_height / _min_in_day;
		var _days = this.get('model.days');
			
		for (var i = 0; i < _days.length; i++) {
			var _events = _days[i].get('events');
			
			for (var j = 0; j < _events.length; j++) {
				var _event_obj = _events[j];
				var _event_date = new Date(_event_obj.date * 1000);
				var _event_minutes = _event_date.getHours() * 60 + _event_date.getMinutes();
				var _event_top = _event_minutes * _minute_height;

				_event_obj.set('top', _event_top);
				
			}// end for

		}// end for
	},//end _setPositionTop()

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

		// Nowmarker
			var $_week_today = Ember.$('.week-table .today');
			var _week_nowmarker = this.get('_week_nowmarker');
			
			if (!_week_nowmarker) {
				
				_week_nowmarker = Ember.$('<div class="nowmarker"></div>').appendTo($_week_today);
				this.set('_week_nowmarker', _week_nowmarker);
				
			}
			
		}// end if (_today_checked !== _real_time) 

	},//end _getToday()

	_setNowMarker() {
		var _day_height = Ember.$('td.day').height();// One day height 
		var _min_in_day = 60 * 24; 
		var _minute_height = _day_height / _min_in_day;
		var _now = new Date();
		var _minutes_now = _now.getHours() * 60 + _now.getMinutes();
		var _height_now = _minutes_now * _minute_height;
		var _top_checked = this.get('_top');
		var _week_nowmarker = $('.nowmarker');

		if (_top_checked !== _minutes_now) {
			this.set('_top', _height_now);
			_week_nowmarker.css('top', _height_now);
		}
		
	},//end _setNowMarker()

	didRender() {
	// Run _setPositionTop with afterRender() from didRender()
		Ember.run.scheduleOnce('afterRender', this, '_setPositionTop');

	// For today-timer
		var _self = this;

		if (_self._timer) {
			clearInterval(_self._timer);
			Ember.$('.today').removeClass('today');
		}

	// Invoke _getToday() and _setNowMarker() once 
	// for mark today and nowmarker without delay
    	this._getToday(); 
    	this._setNowMarker();
		_self._timer = setInterval(function(){ 
			_self._getToday(); _self._setNowMarker(); 
		}, 1000);
	},// end didRender()

	willDestroyElement() {
		var _self = this;
		clearInterval(_self._timer);
	},

	didUpdate() {
		var _self = this;
		
		_self.set('_today_string', null);
	},

});
