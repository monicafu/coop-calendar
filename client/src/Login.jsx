import React, { Component } from 'react';
import './Login.css';
import 'react-tabs/style/react-tabs.css';

// Component
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

// Assets
import google from './icon/icon-google.svg';

// Check functions
import check from './script/inputCheck.js';

class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			userLogin: {
				uname: '',
				pword: '',
			},
			userSignup: {
				uname: '',
				pword: '',
				pwordc: '',
			},
		};

		this.handleInput = this.handleInput.bind(this);
	}

	handleInput(evt) {
		let { userLogin, userSignup } = this.state;
		let sec = evt.target.id.split('-');

		if ( sec[0] === 'login' ) {
			userLogin[ sec[1] ] = evt.target.value;
		}
		else {
			userSignup[ sec[1] ] = evt.target.value;
		}

		this.setState({
			userLogin,
			userSignup,
		});
	}

	render() {
		const { userLogin, userSignup } = this.state;
		console.log(userSignup);
		console.log(userLogin);

		return (
			<div className="login-modal">
				<span className="btn-close-login" onClick={ this.props.closePage }>X</span>
				<div className="panel">
					<Tabs>
						<TabList>
							<Tab>Log In</Tab>
							<Tab>Sign Up</Tab>
						</TabList>

						<TabPanel>
							<div className="tab-container">
								<div className="field">
									<label htmlFor="login-uname">Username</label>
									<input id="login-uname" type="text" placeholder="Username" value={ userLogin.uname } onChange={ this.handleInput } />
								</div>
								<div className="field">
									<label htmlFor="login-pword">Password</label>
									<input id="login-pword" placeholder="Password" type="password" value={ userLogin.pword } onChange={ this.handleInput } />
								</div>
								<div className="field">
									<button>Login In</button>
									<a className="btn-google" href="http://localhost:8000/auth/google"><img src={ google } alt="google" />Google</a>
								</div>
							</div>
						</TabPanel>
						<TabPanel>
							<div className="tab-container">
								<div className="field">
									<label htmlFor="signup-uname">Username</label>
									<input id="signup-uname" type="text" placeholder="Username" value={ userSignup.uname } onChange={ this.handleInput } />
								</div>
								<div className="field">
									<label htmlFor="signun-pword">Password</label>
									<input id="signup-pword" type="password" placeholder="Password" value={ userSignup.pword } onChange={ this.handleInput } />
								</div>
								<div className="field">
									<label htmlFor="signup-pwordc">Confirm Password</label>
									<input id="signup-pwordc" type="password" placeholder="Confirm Password" value={ userSignup.pwordc } onChange={ this.handleInput } />
								</div>
								<div className="field">
									<button>Sign Up</button>
								</div>
							</div>
						</TabPanel>
					</Tabs>
				</div>
			</div>
		);
	}
}

export default Login;