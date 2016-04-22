import Ember from 'ember';

// import MutableEnumerable from '../ember-runtime/mixins/mutable_enumerable';

export default Ember.Service.extend({

	_DATA: Ember.Object.extend(Ember.MutableArray),

	isRemove: false,

	//isDestroyed: false,

	getData() {
		var _that = this;
		var _getData = this.get('_DATA');
		if (_getData.length) {
			//return _getDataPromise;
			return Ember.RSVP.Promise.resolve(_getData);
		}

		return new Promise(function(resolve, reject) {
						$.getJSON('/holidays')
							.done(function(json) {
								_that.set('_DATA', json.data);
								//_that.removeItem(1);
								/*if (_that.isRemove === true) {
									_that.removeItem(8);
								}*/					
								resolve(_that.get('_DATA'));
							})
							.fail(function() {
								reject(reason);
							});		
						});
		//this.set('_getDataPromise', _getDataPromise);
		
		// return _getDataPromise;		
	},

	getDataById(id) {
		return this.getData().then(function(data) {
			return data.findBy('id', id);		
		});
	},

	removeItem(id) {
	
		var _data = this.get('_DATA');
		var _item = _data.findBy('id', id);
		var _item_index = _data.indexOf(_item, 0);
		
		_data.removeAt(_item_index);

		
		//this.set('isRemove', true);
		//this.set('isDestroyed', true);
		
		/*for (var _i = 0; _i < _data.length; _i++) {
			var _data_array = _data[_i];
		
			if (_data_array.id === id) {
				var _item = _data.findBy('id', id);
				var _item_index = _data.indexOf(_item, 0);
				
				_data.removeAt(_item_index);
			}
		}*/
		//console.log(this.get('isRemove'));
		
	}
	
});
