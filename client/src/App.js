import React, { Component } from 'react';
import './App.css';

// Components
import Header from './Header';
import Calendar from './Calendar';
import Modal from './Modal';
import PopupAdd from './PopupAdd';
import Login from './Login';

// Date calculator
import cal from './script/dateCalculator.js';

// Test data
import testEvents from './test/events.js';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currentDate: cal.today(),
			currentUser: {},
			events: testEvents,
			searchContent: null,
			isLogin: false,
			isPopupAddOpen: false,
			isPopupEditOpen: false,
		};

		this.pageUp = this.pageUp.bind(this);
		this.pageDown = this.pageDown.bind(this);
		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.jumpToday = this.jumpToday.bind(this);
		this.togglePopupAdd = this.togglePopupAdd.bind(this);
		this.toggleLogin = this.toggleLogin.bind(this);
	}

	componentDidMount() {
		window.addEventListener('keydown', this.handleKeyDown);
	}

	pageUp() {
		this.setState( prevState => ({
			currentDate: cal.previousMonth(prevState.currentDate),
		}));
	}

	pageDown() {
		this.setState( prevState => ({
			currentDate: cal.nextMonth(prevState.currentDate),
		}));
	}

	handleKeyDown(event) {
		switch(event.keyCode) {
			case 33:
				this.pageUp(); break;
			case 34:
				this.pageDown(); break;
			default:
				break;
		}
	}

	jumpToday(event) {
		this.setState( prevState => ({
			currentDate: cal.today()
		}));
		event.target.blur();
	}

	togglePopupAdd() {
		this.setState( prevState => ({
			isPopupAddOpen: !prevState.isPopupAddOpen,
			isPopupEditOpen: false,
		}));
	}

	toggleLogin() {
		this.setState( prevState => ({
			isLogin: !prevState.isLogin,
		}))
	}

  	render() {
    	return (
      		<div className="App">
		      	<Header 
		      		currentMonth={ this.state.currentDate.getMonth() }
		      		currentYear={ this.state.currentDate.getFullYear() }
		      		clickLeft={ this.pageUp }
		      		clickRight={ this.pageDown }
		      		clickToday={ this.jumpToday }
		      		clickAdd={ this.togglePopupAdd }
		      		clickLogin={ this.toggleLogin } />
		      	<Calendar
		      		currentDate={ this.state.currentDate }
		      		today={ this.state.today }
		      		allEvents={ this.state.events } />
		      	<Modal>
		      		{ this.state.isPopupAddOpen ? <PopupAdd closePopup={ this.togglePopupAdd } /> : null }
		      	</Modal>
				<Modal>
					{ this.state.isLogin ? <Login closePage={ this.toggleLogin } /> : null }
				</Modal>
	      	</div>
	    );
	  }
}

export default App;
