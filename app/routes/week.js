import Ember from 'ember';

export default Ember.Route.extend({

	holidayStorage: Ember.inject.service(),

	start_date : new Date(),

	days: Ember.Object.create({}),

	// Get the fulldate strng for the key to the day object
    _getStringDate(date) {
    	var _string_date = date.getFullYear() + '-' + 
    		   		       date.getMonth() + '-' + 
    		   		   	   date.getDate();
    	return _string_date;
    },//end _getStringDate()

	actions : {
	// redirect to nested route with modal window 
		showModalDialog(event) {
			var _event_id = event.id;
			this.transitionTo('week.modal', _event_id);
		},// end showModalDialog()

		onClickPrev() {
			let _date = this.get('start_date');
			_date.setDate(_date.getDate() - 7);
			this.set('start_date', _date);
			this.transitionTo('/week/'+_date.getTime());
		},

		onClickNext() {
			let _date = this.get('start_date');
			_date.setDate(_date.getDate() + 7);
			this.set('start_date', _date);
			this.transitionTo('/week/'+_date.getTime());
		},

		onClickToday() {
			let _date = new Date();
			_date.setDate(_date.getDate());
			this.set('start_date', _date);
			this.transitionTo('/week/'+_date.getTime());
		},

		onClickMonth() {
			var _trans = this.get('start_date');
			this.transitionTo('/month/'+_trans.getTime());
		},

		onClickWeekHours() {
			let _trans = this.get('start_date');
			this.transitionTo('/week-hours/'+_trans.getTime());
		},

		onClickWeek() {
			this.refresh();
		},

		onNavClick(method) {
			this.actions[method].call(this);
		}
	},// end actions 

	/**
	 * [beforeModel description]
	 * @return {[type]} [description]
	 */
	beforeModel() {
		this.get('holidayStorage').on('eventRemoved', this, '_removeEvent');
	},


	/**
	 * [willDestroyElement description]
	 * @return {[type]} [description]
	 */
	willDestroyElement() {
		this.get('holidayStorage').off('eventRemoved', this, '_removeEvent');
	},

	model(params) {

		var _self = this;
		
		var _timestamp = params.timestamp; // get milliseconds from url as param
		var _start_date = new Date(+_timestamp); // param to format date

		this.set('start_date', _start_date); // set start_date prop to got 

		var	_day_names = ['пн,', 'вт,', 'ср,', 'чт,', 'пт,', 'сб,', 'вс,'];
		var	_days = [];
		var _days_object = this.get('days');

		var _first_day_of_the_week = new Date(_start_date);
			_first_day_of_the_week.setDate(
										_start_date.getDate() - 
										(_start_date.getDay() - 1) 
									);

		var _first = _first_day_of_the_week.getDate();

	// Fill days
		for (var i = 0; i <_day_names.length; i++) {

			var _date = new Date(_first_day_of_the_week);
			_date.setDate(_first + i);

			var _fulldate_key = this._getStringDate(_date);
			_days_object.set(
				_fulldate_key,
				Ember.Object.create({
					day: _date.getDate(),
					month: _date.getMonth() + 1,
					events: Ember.A()
				})
			);
			// Fill _days Array
			_days.pushObject(
				_days_object.get(_fulldate_key)
			);
		}//end for

	// Get Data with Promise
		this.get('holidayStorage').getData().then(function(json) {
			var _json_holidays = json;

			for(var i = 0; i < _json_holidays.length; i++) {
				
				var _holiday_date = _json_holidays[i].date * 1000;
				_holiday_date = new Date(_holiday_date);
				
				var _holiday_attributes = _json_holidays[i]; 

				var _holiday_stringdate = _self._getStringDate(_holiday_date);
			// Fill events of the day object
				if(_days_object.get(_holiday_stringdate)) {
					_days_object.get(_holiday_stringdate)
						 		.get('events')
						 		.pushObject(_holiday_attributes);
				}
				
			}//end for

		}, function(reason) {
			console.log("Oops... error!!");
		});// end get data with Promise

		return {
			'header' : _day_names,
			'days'   : _days
		};
	},//end model

	/**
	 * [_removeEvent description]
	 * @return {[type]} [description]
	 */
	_removeEvent(eventData) {

		var _days_object = this.get('days');
		
		var _holiday_date = eventData.date * 1000;
				_holiday_date = new Date(_holiday_date);

		var _holiday_stringdate = this._getStringDate(_holiday_date);

		if(_days_object.get(_holiday_stringdate)) {
			_days_object.get(_holiday_stringdate)
				 		.get('events')
				 		.removeObject(
				 			eventData
				 		);// end removeObject()
		}// end if
	}// end _removeEvent()
});
