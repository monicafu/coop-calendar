import React, { Component } from 'react';
import './PopupEdit.css';

// Date picker
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';

class PopupEdit extends Component {
	constructor(props) {
		super(props);
		this.state = {
			event: props.event,
		}

		this.handleInput = this.handleInput.bind(this);
		this.handleCheckbox = this.handleCheckbox.bind(this);
		this.handleStartDayChange = this.handleStartDayChange.bind(this);
		this.handleEndDayChange = this.handleEndDayChange.bind(this);
	}

	handleInput(evt) {
		let event = this.state.event;
		event[evt.target.name] = evt.target.value;

		this.setState({
			event,
		});
	}

	handleCheckbox(evt) {
		let event = this.state.event;
		event[evt.target.name] = evt.target.checked ? 'public' : 'private';

		this.setState({
			event,
		});
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
		const event = this.state.event;

		return (
			<div className="popup-edit">
				<div className="mask" onClick={ this.props.closePopup }></div>
				<div className="panel">
					<div className="field">
						<label>Title</label>
						<input id="title" type="text" name="title" placeholder="Title" value={ event.title } onChange={ this.handleInput } />
					</div>
					<div className="field date">
						<label>Date</label>
						<div className="date-form">
							<DayPickerInput value={ event.startDate } onDayChange={ this.handleStartDayChange } />
							<span className="date-connector">to</span>
							<DayPickerInput value={ event.endDate } onDayChange={ this.handleEndDayChange } />
						</div>
					</div>
					<div className="field">
						<label htmlFor="location">Location</label>
						<input id="location" type="text" name="location" placeholder="Location" value={ event.location } onChange={ this.handleInput } />
					</div>
					<div className="field">
						<label>Publicity</label>
						<div className="toggle-btn">
							<input id="publicity-btn" type="checkbox" name="category" checked={ event.category === 'public' ? true : false } onChange={ this.handleCheckbox } />
							<label className="btn-label" htmlFor="publicity-btn">
								<span className="circle"></span>
								<span className="text on">Public</span>
								<span className="text off">Private</span>
							</label>
						</div>
					</div>
					<div className="field">
						<label htmlFor="note">Note</label>
						<textarea id="note" type="text" placeholder="Note" name="description" value={ event.description } onChange={ this.handleInput } />
					</div>
					<div className="field">
						<label htmlFor="creator">Creator</label>
						<div id="creator" className="creator">{ event.creator }</div>
					</div>
					<div className="field">
						<button className="btn-save">Save</button>
					</div>
				</div>
			</div>
		);
	}
}

export default PopupEdit;