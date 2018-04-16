import React, { Component } from 'react';
import './PopupAdd.css';

// Components
import DayPickerInput from 'react-day-picker/DayPickerInput';
import MDSpinner from 'react-md-spinner';
import 'react-day-picker/lib/style.css';

// Functions
import check from './script/inputCheck.js';
import { createEvent } from './script/fetchService.js';

class PopupAdd extends Component {
	constructor(props) {
		super(props);
		this.state = {
			event: {
				title: '',
				description: '',
				startDate: props.date ? new Date( props.date[0], props.date[1], props.date[2] ) : undefined,
				endDate: props.date ? new Date( props.date[0], props.date[1], props.date[2] ) : undefined,
				category: 'private',
				location: '',
			},
			warning: {
				title: '',
				date: '',
			},
			loading: false,
		}

		this.handleAddEvent = this.handleAddEvent.bind(this);
		this.handleInput = this.handleInput.bind(this);
		this.handleCheckbox = this.handleCheckbox.bind(this);
		this.handleStartDayChange = this.handleStartDayChange.bind(this);
		this.handleEndDayChange = this.handleEndDayChange.bind(this);
		this.resetLoading = this.resetLoading.bind(this);
	}

	handleAddEvent() {
		let { event, warning } = this.state;
		const { closePopup, updateEvents } = this.props;

		if ( check.empty(warning.title) || check.empty(warning.date) ) {
			if ( check.empty(warning.title) ) {
				warning.title = 'Title can not be empty';
			}
			if ( check.empty(warning.date) ) {
				warning.date = 'Start Date and End Date can not be empty';
			}

			this.setState({
				warning,
			});
		}
		else {
			this.setState({
				loading: true,
			});

			createEvent('user/event', event)
			.then( result => {
				if ( result.isCreated === true ) {
					updateEvents();
					closePopup();
				}

				this.resetLoading();
			})
			.catch( error => {
				console.log(error);
				this.resetLoading();
			});
		}
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

	resetLoading() {
		this.setState({
			loading: false,
		});
	}

	render() {
		const { closePopup } = this.props;
		const { event, warning, loading } = this.state;

		return (
			<div className="popup-add" >
				<div className="mask" onClick={ closePopup } ></div>
				<div className="panel">
					<div className="field">
						<label htmlFor="title">Title<span className="warning">{ warning.title }</span></label>
						<input id="title" type="text" name="title" placeholder="For what" onChange={ this.handleInput } />
					</div>
					<div className="field">
						<label>Date<span className="warning">{ warning.date }</span></label>
						<div className="date-form">
							<DayPickerInput value={ event.startDate } onDayChange={ this.handleStartDayChange } />
							<span className="date-connector">to</span>
							<DayPickerInput value={ event.endDate } onDayChange={ this.handleEndDayChange } />
						</div>
					</div>
					<div className="field">
						<label htmlFor="location">Location</label>
						<input id="location" type="text" placeholder="Where it happens" onChange={ this.handleInput } />
					</div>
					<div className="field">
						<label>Publicity</label>
						<div className="toggle-btn">
							<input id="publicity-btn" type="checkbox" name="category" onChange={ this.handleCheckbox } />
							<label className="btn-label" htmlFor="publicity-btn">
								<span className="circle"></span>
								<span className="text on">Public</span>
								<span className="text off">Private</span>
							</label>
						</div>
					</div>
					<div className="field">
						<label htmlFor="note">Note</label>
						<textarea id="note" type="text" name="description" placeholder="Note" onChange={ this.handleInput } />
					</div>
					<div className="field">
						<button className="btn-add" onClick={ this.handleAddEvent }>{ loading ? <MDSpinner size={ 15 } singleColor="#797979" /> : 'Add Event' }</button>
					</div>
				</div>
			</div>
		);
	}
}

export default PopupAdd;