import Ember from 'ember';

//
const _Event = Ember.Object.extend({
									id: '',
						 			title: '',
						 			date: '',
						 			type: null,
						 			top: 0,
						 			is_hidden: false,
						 			cssTop: Ember.computed('top', function () {
	    								return new Ember.String.htmlSafe("top: " + 
	    									this.get('top') + "px");
									})
						 		});//end _Event


export default Ember.Service.extend(Ember.Evented, {

	filterEvent: Ember.inject.service(),

	_DATA: Ember.A(),
	_getDataPromise: null,

	/**
	 * @return {[type]}
	 */
	init() {
		this.get('filterEvent').on('filterClick', this, 'filter');
	},


	/**
	 * [getData description]
	 * @return {[type]} [description]
	 */
	getData() {
		var _that = this;
		if (_that.get('_getDataPromise')) {
			return _that.get('_getDataPromise');
		}

		var _getDataPromise = new Ember.RSVP.Promise(function(resolve, reject) {
						Ember.$.getJSON('/holidays')
							.done(function(json) {
								var _Data = _that.get('_DATA');
								json.data.forEach(function(event) {
									 _Data.addObject(_Event.create({
								 			id: event.attributes.id,
											title: event.attributes.title,
								 			date: event.attributes.date,
								 			type: event.attributes.type,
								 			top: 0,
								 			is_hidden: false
								 		}));
								});
								resolve(_Data);
							})
							.fail(function(reason) {
								reject(reason);
							});		
						});

		_that.set('_getDataPromise', _getDataPromise);
		return _getDataPromise;		
	},// end getData()


	/**
	 * [getDataById description]
	 * @param  {[type]} id [description]
	 * @return {[type]}    [description]
	 */
	getDataById(id) {
		return this.getData().then(function(data) {
			return data.findBy('id', id);		
		});
	},


	/**
	 * [removeItem description]
	 * @param  {[type]} id [description]
	 * @return {[type]}    [description]
	 */
	removeItem(id) {
		return this.getDataById(id).then((itemData) => {
			this.get('_DATA').removeObject(itemData);
			this.trigger('eventRemoved', itemData);
		});
	},


	filter(id) {
		var _Data = this.get('_DATA');
		_Data.forEach((holiday) => {
			if (holiday.type == id) {
				holiday.set('is_hidden', false);
			} else {
				holiday.set('is_hidden', true);
			}
		});
	}
	
});// Ember.Service.extend
