import React, { Component } from 'react';
import './App.css';
import { withCookies, CookiesProvider } from 'react-cookie';
import { instanceOf } from 'prop-types';

// Components
import Header from './Header';
import Calendar from './Calendar';
import Modal from './Modal';
import PopupAdd from './PopupAdd';
import Login from './Login';

// Functions
import cal from './script/dateCalculator.js';
import { getUserEvents } from './script/fetchService.js';

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
		this.getEvents();
	}

	login(user) {
		this.setState( prevState => {
			prevState.user = user;
			return { currentUser: prevState.user };
		});
		this.getEvents();
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
		let { events } = this.state;

		if ( currentUser.id ) {
			getUserEvents(`user/${ currentUser.id }/${ currentDate.getFullYear() }/${ currentDate.getMonth() }`)
			.then(result => {
				events = result.sendEvents.map( event => {
					event.startDate = new Date( event.startDate );
					event.endDate = new Date( event.endDate );
					// console.log(event);
					return event;
				} );

				this.setState({
					events: events,
				});
			})
			.catch(error => {
				console.log(error);
			});
		}
	}

	pageUp() {
		this.setState( prevState => {
			let newDate = cal.previousMonth(prevState.currentDate);
			this.getEvents();
			return { currentDate: newDate, };
		});
	}

	pageDown() {
		this.setState( prevState => {
			let newDate = cal.nextMonth(prevState.currentDate);
			this.getEvents();
			return { currentDate: newDate, };
		});
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
		this.setState( prevState => {
			prevState.currentDate = cal.today();
			this.getEvents( prevState.currentDate );
			return { currentDate: prevState.currentDate, };
		});
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
		      		clickLogout={ this.logout } />
		      	<Calendar
		      		currentDate={ currentDate }
		      		currentUser={ currentUser }
		      		allEvents={ events }
		      		openLogin={ this.toggleLogin }
		      		updateEvents={ this.getEvents } />
		      	<Modal>
		      		{ isPopupAddOpen ? <PopupAdd currentUser={ currentUser } closePopup={ this.togglePopupAdd } updateEvents={ this.getEvents } /> : null }
					{ isLoginOpen ? <Login login={ this.login } closePage={ this.toggleLogin } /> : null }
				</Modal>
	      	</div>
	    );
	  }
}

export default App;
