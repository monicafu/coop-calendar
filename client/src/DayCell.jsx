import React, { Component } from 'react';
import './DayCell.css';

// Component
import Modal from './Modal';
import PopupAdd from './PopupAdd';
import PopupEdit from './PopupEdit';

// Date calculator
import cal from './script/dateCalculator.js';

class DayCell extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isPopupAddOpen: false,
			isPopupEditOpen: false
		}

		this.togglePopupAdd = this.togglePopupAdd.bind(this);
		this.togglePopupEdit = this.togglePopupEdit.bind(this);
	}

	togglePopupAdd() {
		this.setState( prevState => ({
			isPopupAddOpen: !prevState.isPopupAddOpen,
			isPopupEditOpen: false
		}));
	}

	togglePopupEdit() {
		this.setState( prevState => ({
			isPopupAddOpen: false,
			isPopupEditOpen: !prevState.isPopupEditOpen 
		}))
	}

	render() {
		const day = this.props.day;
		const currentDate = this.props.currentDate;

		let dayContent = []; 
		let classList = 'day-cell ';
		let ymd = [currentDate.getFullYear(), currentDate.getMonth(), day];
		let dataYmd = `${ ymd[0] }-${ ymd[1] }-${ ymd[2] }`

		if ( day <= 0 || day > cal.monthDays(currentDate) ) {
			classList += 'cell-disabled ';
		}
		else {
			if ( cal.isToday(day, currentDate) ) {
				classList += 'cell-today';
			}

			dayContent.push(
				<div className="day-num" onClick={ this.togglePopupAdd } key="num">
					{ day }
				</div>
			);

			dayContent.push(
				<div className="event-bar event-private" onClick={ this.togglePopupEdit } key="event1">
					{ 'Test Title 1' }
				</div>
			);

			// dayContent.push(
			// 	<div className="event-bar event-public" key="event2">
			// 		{ 'Test Title 2' }
			// 	</div>
			// );
		}

		return (
			<div className={ classList } data-ymd={ dataYmd } >
				{ dayContent }
				<Modal>
		      		{ this.state.isPopupAddOpen ? <PopupAdd closePopup={ this.togglePopupAdd } date={ ymd } /> : null }
		      		{ this.state.isPopupEditOpen ? <PopupEdit closePopup={ this.togglePopupEdit } date={ ymd } /> : null }
		      	</Modal>
			</div>
		);
	}
}

export default DayCell;