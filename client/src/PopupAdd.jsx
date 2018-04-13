import React, { Component } from 'react';
import './PopupAdd.css';

// Date picker
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';

class PopupAdd extends Component {
	constructor(props) {
		super(props);
		this.state = {
			event: {
				title: '',
				description: '',
				startDate: undefined,
				endDate: undefined,
				category: 'private',
				location: '',
			},
		}
	}

	handleStartDayChange(selectedDay) {
		let event = this.state.event;
		event.startDate = selectedDay;

		this.setState({
			event,
		});
	}

	handleEndDayChange(selectedDay) {
		let event = this.state.event;
		event.endDate = selectedDay;

		this.setState({
			event,
		});
	}

	render() {
		const date = this.props.date;
		const event = this.state.event;

		return (
			<div className="popup-add" >
				<div className="mask" onClick={ this.props.closePopup } ></div>
				<div className="panel">
					<div className="field">
						<label htmlFor="title">Title</label>
						<input id="title" type="text" placeholder="For what" />
					</div>
					<div className="field">
						<label>Date</label>
						<div className="date-form">
							<DayPickerInput value={ event.startDate } onDayChange={ this.handleStartDayChange } />
							<span className="date-connector">to</span>
							<DayPickerInput value={ event.endDate } onDayChange={ this.handleEndDayChange } />
						</div>
					</div>
					<div className="field">
						<label htmlFor="location">Location</label>
						<input id="location" type="text" placeholder="Where it happens" />
					</div>
					<div className="field">
						<label>Publicity</label>
						<div className="toggle-btn">
							<input id="publicity-btn" type="checkbox" />
							<label className="btn-label" htmlFor="publicity-btn">
								<span className="circle"></span>
								<span className="text on">Public</span>
								<span className="text off">Private</span>
							</label>
						</div>
					</div>
					<div className="field">
						<label htmlFor="note">Note</label>
						<textarea id="note" type="text" placeholder="Note" />
					</div>
					<div className="field">
						<button className="btn-add">Add Event</button>
					</div>
				</div>
			</div>
		);
	}
}

export default PopupAdd;