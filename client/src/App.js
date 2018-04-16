import React, { Component } from 'react';
import './App.css';

// Components
import Header from './Header';
import Calendar from './Calendar';
import Modal from './Modal';
import PopupAdd from './PopupAdd';
import Login from './Login';

// Functions
import cal from './script/dateCalculator.js';
import { getUserEvents } from './script/fetchService.js';

// Test data
import testEvents from './test/events.js';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currentDate: cal.today(),
			currentUser: {},
			events: [],
			searchContent: '',
			isLoginOpen: false,
			isPopupAddOpen: false,
		};

		this.login = this.login.bind(this);
		this.logout = this.logout.bind(this);
		this.getEvents = this.getEvents.bind(this);
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

	login(user) {
		this.setState({
			currentUser: user,
		});
	}

	logout() {
		this.setState({
			currentDate: cal.today(),
			currentUser: {},
			events: [],
			searchContent: '',
			isLoginOpen: false,
			isPopupAddOpen: false,
		});
	}

	getEvents() {
		const { currentDate, currentUser } = this.state;

		if ( currentUser.id ) {
			getUserEvents(`user/${ currentUser.id }/${ currentDate.getFullYear() }/${ currentDate.getMonth() }`)
			.then(result => {
				this.setState({
					events: result,
				});
			})
			.catch(error => {
				console.log(error);
			});
		}
	}

	pageUp() {
		this.setState( prevState => ({
			currentDate: cal.previousMonth(prevState.currentDate),
		}));
		this.getEvents();
	}

	pageDown() {
		this.setState( prevState => ({
			currentDate: cal.nextMonth(prevState.currentDate),
		}));
		this.getEvents();
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
		this.getEvents();
	}

	togglePopupAdd() {
		this.setState( prevState => ({
			isPopupAddOpen: !prevState.isPopupAddOpen,
			isPopupEditOpen: false,
		}));
	}

	toggleLogin() {
		this.setState( prevState => ({
			isLoginOpen: !prevState.isLoginOpen,
		}))
	}

  	render() {
  		const { currentDate, currentUser, events } = this.state;
  		const { isLoginOpen, isPopupAddOpen } = this.state;

    	return (
      		<div className="App">
		      	<Header 
		      		currentMonth={ currentDate.getMonth() }
		      		currentYear={ currentDate.getFullYear() }
		      		currentUser={ currentUser }
		      		clickLeft={ this.pageUp }
		      		clickRight={ this.pageDown }
		      		clickToday={ this.jumpToday }
		      		clickAdd={ this.togglePopupAdd }
		      		clickLogin={ this.toggleLogin }
		      		userLogin={ this.login }
		      		userLogout={ this.logout } />
		      	<Calendar
		      		currentDate={ currentDate }
		      		currentUser={ currentUser }
		      		allEvents={ events }
		      		updateEvents={ this.getEvents } />
		      	<Modal>
		      		{ isPopupAddOpen ? <PopupAdd closePopup={ this.togglePopupAdd } updateEvents={ this.getEvents } /> : null }
					{ isLoginOpen ? <Login closePage={ this.toggleLogin } /> : null }
				</Modal>
	      	</div>
	    );
	  }
}

export default App;
