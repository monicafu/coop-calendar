import React, { Component } from 'react';
import './PopupEdit.css';

// Components
import DayPickerInput from 'react-day-picker/DayPickerInput';
import MDSpinner from 'react-md-spinner';
import 'react-day-picker/lib/style.css';

// Functions
import check from './script/inputCheck.js';
import { editEvent, deleteEvent } from './script/fetchService.js';

class PopupEdit extends Component {
	constructor(props) {
		super(props);
		this.state = {
			event: props.event,
			warning: {
				title: '',
				date: '',
			},
			editLoading: false,
			deleteLoading: false,
		}

		this.handleEditEvent = this.handleEditEvent.bind(this);
		this.handleDeleteEvent = this.handleDeleteEvent.bind(this);
		this.handleInput = this.handleInput.bind(this);
		this.handleCheckbox = this.handleCheckbox.bind(this);
		this.handleStartDayChange = this.handleStartDayChange.bind(this);
		this.handleEndDayChange = this.handleEndDayChange.bind(this);
		this.resetLoading = this.resetLoading.bind(this);
	}

	handleEditEvent() {
		let { event, warning } = this.state;
		const { user, updateEvents, closePopup } = this.props;

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
				editLoading: true,
			});

			editEvent(`user/event/${ user.id }`, event)
			.then( result => {
				if ( result.isUpdated === true ) {
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

	handleDeleteEvent() {
		const { user, closePopup, updateEvents } = this.props;

		deleteEvent(`user/event/${ user.id }`)
		.then( result => {
			if ( result.isDeleted === true ) {
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
			editLoading: false,
			deleteLoading: false,
		});
	}

	render() {
		const { user, closePopup } = this.props;
		const { event, warning, editLoading, deleteLoading } = this.state;
		const isCreator = user.username === event.creator ? true : false;
		// const isCreator = true;

		return (
			<div className="popup-edit">
				<div className="mask" onClick={ closePopup }></div>
				<div className="panel">
					<div className="field">
						<label htmlFor="title">Title<span className="warning">{ warning.title }</span></label>
						<input id="title" type="text" name="title" placeholder="Title" value={ event.title } onChange={ this.handleInput } />
					</div>
					<div className="field date">
						<label>Date<span className="warning">{ warning.date }</span></label>
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
					{ isCreator ? (
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
						) : null
					}
					<div className="field">
						<label htmlFor="note">Note</label>
						<textarea id="note" type="text" placeholder="Note" name="description" value={ event.description } onChange={ this.handleInput } />
					</div>
					{ isCreator ? null : (
						<div className="field">
							<label htmlFor="creator">Creator</label>
							<div id="creator" className="creator">{ event.creator }</div>
						</div>
						)
					}
					<div className="field">
						<button className="btn-save" onClick={ this.handleEditEvent } >{ editLoading ? <MDSpinner size={ 15 } singleColor="#797979" /> : 'Save' }</button>
						{ isCreator ? <button className="btn-delete" onClick={ this.handleDeleteEvent } >{ deleteLoading ? <MDSpinner size={ 15 } singleColor="#797979" /> : 'Save' }</button> : null }
					</div>
				</div>
			</div>
		);
	}
}

export default PopupEdit;