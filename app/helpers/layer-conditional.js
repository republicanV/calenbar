import Ember from 'ember';

export function layerConditional(params/*, hash*/) {
	var eventType = params[1];
	var filters = params[0];
	var elem = filters.indexOf(eventType);

	if (elem === -1) {
		console.log(false);
		return false;
	}

	/*for (var i = 0; i < filters.length; i++) {
		var result = filters[i] === eventType;
	}*/
	console.log(true);
  return true;
}

export default Ember.Helper.helper(layerConditional);
