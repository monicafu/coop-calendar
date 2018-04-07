import React, { Component } from 'react';
import './DayCell.css';

// Date calculator
import cal from './script/dateCalculator.js';

class DayCell extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const day = this.props.day;
		const currentDate = this.props.currentDate;

		let dayContent = [];
		dayContent.push(
			<div className="day-num" key="num">
				{ day }
			</div>
		);

		dayContent.push(
			<div className="event-bar event-private" key="event1">
				{ 'Test Title 1' }
			</div>
		);

		dayContent.push(
			<div className="event-bar event-public" key="event2">
				{ 'Test Title 2' }
			</div>
		);

		return (
			<div className={ `day-cell ${ day <= 0 || day > cal.monthDays(currentDate) ? 'cell-disabled' : '' }` }>
				{ day <= 0 || day > cal.monthDays(currentDate) ? '' : dayContent }
			</div>
		);
	}
}

export default DayCell;