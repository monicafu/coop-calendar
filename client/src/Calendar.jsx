import React, { Component } from 'react';
import './Calendar.css';

// Component
import DayCell from './DayCell';

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
					<DayCell day={ day } currentDate={ currentDate } key={ row } />
				);
			}

			grid.push (
				<div className="day-col" key={ col }>
					{ rows }
				</div>
			);
		}

		return grid;
	}

	render() {
		const grid = this.generateGrid();

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