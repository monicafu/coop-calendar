import React, { Component } from 'react';
import './PopupEdit.css';

class PopupEdit extends Component {

	render() {
		const date = this.props.date;

		return (
			<div className="popup-edit">
				<div className="mask" onClick={ this.props.closePopup }></div>
				<div className="panel">
					<div className="field">
						<label>Title</label>
						<input id="title" type="text" />
					</div>
					<div className="field date">
						<label htmlFor="start-date">Start Date</label>
						<div className="date-form">
							<input id="start-date" type="number" name="year" defaultValue={ date ? date[0] : null } />
							<input type="number" name="month" defaultValue={ date ? date[1] + 1 : null } />
							<input type="number" name="day" defaultValue={ date ? date[2] : null } />
						</div>
					</div>
					<div className="field date">
						<label htmlFor="end-date">End date</label>
						<div className="date-form">
							<input id="end-date" type="number" name="year" defaultValue={ date ? date[0] : null } />
							<input type="number" name="month" defaultValue={ date ? date[1] + 1 : null } />
							<input type="number" name="day" defaultValue={ date ? date[2] : null } />
						</div>
						<div className="field">
							<label htmlFor="location">Location</label>
							<input id="location" type="text" />
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
							<label htmlFor="creator">Creator</label>
							<div id="creator" className="creator">Hongbin</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default PopupEdit;