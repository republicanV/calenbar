import Ember from 'ember';
import config from '../config/environment';


export default Ember.Route.extend({

	holidayStorage: Ember.inject.service(),

	_week_start: config.weekStartsOnSunday,

	start_date: new Date(), // Current date

	weeks: null,

	days: Ember.Object.create({}),

	_today_current: false,

// Get day of the week number, from 0(Mon) to 6(Sun)
	_getDay(date) { 
		var _week_start = this.get('_week_start');
        var day = date.getDay();
        if (_week_start) {
        	return day;
        }
        if (day === 0) {
        	day = 7;
    	}
        return day - 1;
    },//end _getDay()

// Get the week index from 0 to ...
	/*_getWeekIndex(date) {
    	var _zero = Math.abs(_start) + 1; // absolute value number
    	var _week_number = Math.ceil((date + _zero) / 7);
    	return _week_number - 1;
    },*///end _getWeekIndex()

// Switch week day start
    _getWeekDay(weekStart) {
    	let _day_names = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];
    	if (weekStart) {
    		var _start_day = _day_names.pop();
    		_day_names.unshift(_start_day);
    	}
    	return _day_names;
    },//end _getWeekDay()

// Get the fulldate strng for the key to the day object
    _getStringDate(date) {
    	var today = new Date();
    	
    	var _string_date = date.getFullYear() + '-' + 
    		   		       date.getMonth() + '-' + 
    		   		   	   date.getDate();
    		   		   	   
    	return _string_date;
    },//end _getStringDate()

	actions: {

		onClickPrev() {
			let _date = this.get('start_date');
			_date.setMonth(_date.getMonth() - 1);
			this.set('start_date', _date);
			this.transitionTo('/month/' +_date.getTime());
			Ember.$('a#cal-btn-today').removeClass('active');
		},
		onClickNext() {
			let _date = this.get('start_date');
			_date.setMonth(_date.getMonth() + 1);
			this.set('start_date', _date);
			this.transitionTo('/month/'+_date.getTime());
			Ember.$('a#cal-btn-today').removeClass('active');
		},
		onClickToday() {
			let _date = new Date();
			_date.setMonth(_date.getMonth());
			this.set('start_date', _date);
			this.transitionTo('/month/'+_date.getTime());
			this.set('_today_current', true);
			Ember.$('a#cal-btn-today').addClass('active');
		},
		onClickMonth() {
			this.refresh();
		},

		onClickWeekHours() {
			let _trans = this.get('start_date');
			this.transitionTo('/week-hours/'+_trans.getTime());
		},
		
		onClickWeek() {
			var _trans = this.get('start_date');
			this.transitionTo('/week/'+_trans.getTime());
		},
		
		onNavClick(method) {// action caller from the component
			this.actions[method].call(this);
		},
		
	},//end actions

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
		// для теста this._getWeekIndex(): _start_date = new Date('2016-5-25');
		this.set('start_date', _start_date);

		var	_year = _start_date.getFullYear(),
      		_month = _start_date.getMonth(),
      		_first_of_month = new Date(_year, _month, 1),
	    	_last_of_month = new Date(_year, _month+1, 0);


		var _week_start = this.get('_week_start');

		var _day_names = this._getWeekDay(_week_start);
      	
	    var _number_weeks = Math.ceil( 
	    		(this._getDay(_first_of_month) + 
	    		_last_of_month.getDate()) / 7
	    	);//end _number_weeks

	    var _maxDays = _number_weeks * 7;
	    var _weeks = []; 

	    var _week_index = 0;
		var _start = _first_of_month.getDate() - 
					 this._getDay(_first_of_month);

	    var _days = this.get('days');

	// Fill _weeks[] by days
		for(var j = 0, i = _start; i < _maxDays + _start; i++, j++) {

		// Init weeks
			if(!(j%7)) {
				_weeks.push([]);
			}
			
			var _date = new Date(
								_first_of_month.getFullYear(),
								_first_of_month.getMonth(),
								i
							);
		// Fill days 
			var _fulldate_key = this._getStringDate(_date);
			
			_days.set(
				_fulldate_key, 
				Ember.Object.create({
					day : _date.getDate(), 
					month : _date.getMonth() + 1,
					events: Ember.A(),
					dateString: _fulldate_key
			}));
		// Fill weeks by days
			_weeks[_week_index].pushObject(
								_days.get(_fulldate_key)
								);

			if((j+1)%7 === 0) {
				_week_index ++;
			}
			
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
				if(_days.get(_holiday_stringdate)) {
					_days.get(_holiday_stringdate)
						 .get('events')
						 .pushObject(_holiday_attributes);
				}
				
			}//end for

		}, function(reason) {
			console.log("Oops... error!!");
		});// end get data with Promise
	    
		return {
			'header': _day_names,
			'weeks': _weeks
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
