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
			currentEvent: null,
			isPopupAddOpen: false,
			isPopupEditOpen: false,
		}

		this.togglePopupAdd = this.togglePopupAdd.bind(this);
		this.togglePopupEdit = this.togglePopupEdit.bind(this);
		this.handleEdit = this.handleEdit.bind(this);
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
		}));
	}

	handleEdit(event, evt) {
		this.setState( prevState => ({
			currentEvent: event,
		}));
		this.togglePopupEdit();
	}


	generateDayContent() {
		const day = this.props.day;
		let events = this.props.events;

		let dayContent = []; 

		dayContent.push(
			<div className="day-num" onClick={ this.togglePopupAdd } key="num">
				{ day }
			</div>
		);

		dayContent = [...dayContent, ...events.map( ( event, index ) => {
			return (
				<div className={ `event-bar event-${ event.category }` } onClick={ this.handleEdit.bind(this, event) } key={ index } >
					{ event.title }
				</div>
			);
		})];

		return dayContent;
	}

	render() {
		let dayContent = [];
		const day = this.props.day;
		const currentDate = this.props.currentDate;
		let classList = 'day-cell ';
		let dataYmd = `${ this.props.ymd[0] }-${ this.props.ymd[1] }-${ this.props.ymd[2] }`

		if ( day <= 0 || day > cal.monthDays(currentDate) ) {
			classList += 'cell-disabled ';
		}
		else {
			if ( cal.isToday(day, currentDate) ) {
				classList += 'cell-today';
			}

			dayContent = this.generateDayContent();
		}

		return (
			<div className={ classList } data-ymd={ dataYmd } >
				{ dayContent }
				<Modal>
	      			{ this.state.isPopupAddOpen ? <PopupAdd closePopup={ this.togglePopupAdd } date={ this.props.ymd } /> : null }
	      			{ this.state.isPopupEditOpen ? <PopupEdit closePopup={ this.togglePopupEdit } date={ this.props.ymd } event={ this.state.currentEvent } /> : null }
	      		</Modal>
			</div>
		);
	}
}

export default DayCell;