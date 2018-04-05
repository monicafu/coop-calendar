import React, { Component } from 'react';
import './Calendar.css';

// Date calculator
import cal from './script/dateCalculator.js';

class Calendar extends Component {
	constructor(props) {
		super(props);
		this.generateGrid = this.generateGrid.bind(this);
	}

	generateGrid() {
		let grid = [];
		let currentDate = this.props.currentDate;

		for (let col = 0; col < cal.column(currentDate); ++col) {
			let rows = [];

			for (let row = 0; row < 7; ++row) {
				let cellIndex = col * 7 + row;
				let day = cellIndex - cal.firstDay(currentDate) + 1;

				rows.push(
					<div className={ `day-cell ${ day <= 0 || day > cal.monthDays(currentDate) ? 'cell-disabled' : '' }` } key={row}>{ day <= 0 || day > cal.monthDays(currentDate) ? '' : day }</div>
				);
			}

			grid.push (
				<div className="day-col" key={col}>
					{ rows }
				</div>
			);
		}

		return grid;
	}

	render() {
		const grid = this.generateGrid();
		console.log(cal.column(this.props.currentDate));

		return (
			<main>
				<div className="week-col">
					<div className="week-cell">Sunday</div>
					<div className="week-cell">Monday</div>
					<div className="week-cell">Tuesday</div>
					<div className="week-cell">Wednesday</div>
					<div className="week-cell">Thursday</div>
					<div className="week-cell">Friday</div>
					<div className="week-cell">Saturday</div>
				</div>
				<div className="grid">
					{ grid }
				</div>
			</main>
		);
	}
}

export default Calendar;