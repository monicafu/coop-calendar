import React, { Component } from 'react';
import './App.css';

// Components
import Header from './Header';
import Calendar from './Calendar';

// Date calculator
import cal from './script/dateCalculator.js';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			today: cal.today(),
			currentDate: cal.today(),
			searchContent: null
		};

		this.pageUp = this.pageUp.bind(this);
		this.pageDown = this.pageDown.bind(this);
		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.jumpToday = this.jumpToday.bind(this);
	}

	componentDidMount() {
		window.addEventListener('keydown', this.handleKeyDown);
	}

	pageUp() {
		this.setState( (prevState, props) => ({
			currentDate: cal.previousMonth(prevState.currentDate),
		}));
	}

	pageDown() {
		this.setState( (prevState, props) => ({
			currentDate: cal.nextMonth(prevState.currentDate),
		}));
	}

	handleKeyDown(event) {
		switch(event.keyCode) {
			case 37:
			case 38:
				this.pageUp(); break;
			case 39: 
			case 40:
				this.pageDown(); break;
			default:
				break;
		}
	}

	jumpToday() {
		this.setState( (prevState, props) => ({
			currentDate: prevState.today
		}));
	}

  	render() {
    	return (
      		<div className="App">
		      	<Header 
		      		currentMonth={ this.state.currentDate.getMonth() }
		      		currentYear={ this.state.currentDate.getFullYear() }
		      		clickLeft={ this.pageUp }
		      		clickRight={ this.pageDown }
		      		clickToday={ this.jumpToday } />
		      	<Calendar
		      		currentDate={ this.state.currentDate }
		      		today={ this.state.today } />
	      	</div>
	    );
	  }
}

export default App;
