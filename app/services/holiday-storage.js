import Ember from 'ember';

//
const _Event = Ember.Object.extend({
									id: '',
						 			title: '',
						 			date: '',
						 			top: 0,
						 			cssTop: Ember.computed('top', function () {
	    								return new Ember.String.htmlSafe("top: " + 
	    									this.get('top') + "px");
									})
						 		});//end _Event


export default Ember.Service.extend(Ember.Evented, {

	_DATA: Ember.A(),
	_getDataPromise: null,

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
								 			top: 0
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
	}
	
});// Ember.Service.extend
