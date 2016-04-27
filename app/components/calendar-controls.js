import Ember from 'ember';

export default Ember.Component.extend({
	actions: {

		onClickPrev() {
			this.sendAction('action', 'onClickPrev');
		},
		onClickNext() {
			this.sendAction('action', 'onClickNext');
		},
		onClickToday() {
			this.sendAction('action', 'onClickToday');
		},
		onClickMonth() {
			this.sendAction('action', 'onClickMonth');
		},
		onClickWeek() {
			this.sendAction('action', 'onClickWeek');
		},
		onClickWeekHours() {
			this.sendAction('action', 'onClickWeekHours');
		},
		onClickMonthTest() {
			this.sendAction('action', 'onClickMonthTest');
		}
	},//end actions
});
