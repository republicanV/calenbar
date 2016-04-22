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

	actions: {

		onClickPrev() {
			let _date = this.get('start_date');
			_date.setDate(_date.getDate() - 7);
			this.set('start_date', _date);
			this.transitionTo('/week-hours/'+_date.getTime());
		},

		onClickNext() {
			let _date = this.get('start_date');
			_date.setDate(_date.getDate() + 7);
			this.set('start_date', _date);
			this.transitionTo('/week-hours/'+_date.getTime());
		},

		onClickToday() {
			let _date = new Date();
			_date.setDate(_date.getDate());
			this.set('start_date', _date);
			this.transitionTo('/week-hours/'+_date.getTime());
		},

		onClickMonth() {
			var _trans = this.get('start_date');
			this.transitionTo('/month/'+_trans.getTime());
		},

		onClickWeek() {
			var _trans = this.get('start_date');
			this.transitionTo('/week/'+_trans.getTime());
		},

		onClickWeekHours() {
			this.refresh();
			console.log("refresh");
		},

		onDelete(id) {
			var _hol = this.get('holidayStorage');
			var _model = this.get('model');
			this.actions.onClickWeekHours();
			//this.call(onClickWeekHours(), this);
			//_hol.removeItem(id);
			console.log(id, 'onDelete');
			//console.log(_model;
			//this.refresh();
			//this.transitionTo('/week-hours/');
			//destroy(this);
		},

		onNavClick(method) {
			this.actions[method].call(this);
		}
	},//end actions

	beforeModel() {
		var _hol = this.get('holidayStorage');
		var _is_remove = _hol.get('isRemove');
		if (_is_remove) {
			this.refresh();
		}
		//this.refresh();
		//console.log(_is_remove);
	},

	willDestroyElement() {

	},

	model(params) {

		var _self = this;

		var _timestamp = params.timestamp; // get milliseconds from url as param
		var _start_date = new Date(+_timestamp); // param to format date

		this.set('start_date', _start_date);

		var	_day_names = ['пн,', 'вт,', 'ср,', 'чт,', 'пт,', 'сб,', 'вс,'];
		var _hours = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', 
					  '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', 
					  '20', '21', '22', '23'];
		var	_days = [];
		var _days_object = this.get('days');

	// Take start date
		var _first_day_of_the_week = new Date(_start_date);
		// And set this date for getting first full date of the week 
			_first_day_of_the_week.setDate(
										_start_date.getDate() - 
										(_start_date.getDay() - 1) 
									);
	// Get the first date of the week
		var _first = _first_day_of_the_week.getDate();

	// Fill days
		for (var i = 0; i < _day_names.length; i++) {
			var _date = new Date(_first_day_of_the_week);
			_date.setDate(_first + i);

			var _fulldate_key = _self._getStringDate(_date);
			_days_object.set(
				_fulldate_key,
				Ember.Object.create({
					day: _date.getDate(),
					month: _date.getMonth() + 1,
					events: Ember.A(),
					dateString: _fulldate_key
				})
			);

			// Fill _days Array
			_days.pushObject(
				_days_object.get(_fulldate_key)
			);

		}//end for

	// Get Data with Promise
		this.get('holidayStorage').getData().then(function(json) {
			//console.log(json)
			//_self.refresh();
			var _json_holidays = json;
		// Create pattern for the event object
		// Computed method for dynamicly calculate top property
			var _Event = Ember.Object.extend({
									id: '',
						 			title: '',
						 			date: '',
						 			top: 0,
						 			cssTop: Ember.computed('top', function () {
	    								return new Ember.String.htmlSafe("top: " + this.get('top') + "px");
									})
						 		});//end _Event

			for(var i = 0; i < _json_holidays.length; i++) {
				
				var _holiday_date = _json_holidays[i].attributes.date * 1000;
				_holiday_date = new Date(_holiday_date);
				
				var _holiday_attributes = _json_holidays[i].attributes; 

				var _holiday_stringdate = _self._getStringDate(_holiday_date);
			// Fill events of the day object
				if(_days_object.get(_holiday_stringdate)) {
					_days_object.get(_holiday_stringdate)
						 		.get('events')
						 		.pushObject(
						 			_json_holidays[i]
						 		// _Event.create({
						 		// 	id: _holiday_attributes.id,
									// title: _holiday_attributes.title,
						 		// 	date: _holiday_attributes.date,
						 		// 	top: 0
						 		// })

						 		);// end pushObject()
				}// end if
				
			}//end for

		}, function(reason) {
			console.log("Oops... error!!");
		});// end get data with Promise

		return {
			header: _day_names,
			days: _days,
			hours: _hours
		}

	}//end model

});
