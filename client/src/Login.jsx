import React, { Component } from 'react';
import './Login.css';
import 'react-tabs/style/react-tabs.css';

// Component
// import { Tab } from 'semantic-ui-react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

class Login extends Component {

	render() {
		return (
			<div className="login-modal">
				<span className="btn-close-login" onClick={ this.props.closePage }>X</span>
				<div className="panel">
					<Tabs>
						<TabList>
							<Tab>Sign In</Tab>
							<Tab>Sign Up</Tab>
						</TabList>

						<TabPanel>
							<div className="tab-container">
								<div className="field">
									<label htmlFor="un-signin">Username</label>
									<input id="un-signin" type="text" />
								</div>
								<div className="field">
									<label htmlFor="pw-signin">Password</label>
									<input id="pw-signin" type="password" />
								</div>
							</div>
						</TabPanel>
						<TabPanel>
							<div className="tab-container">
								<div className="field">
									<label htmlFor="un-signin">Username</label>
									<input id="un-signup" type="text" />
								</div>
								<div className="field">
									<label htmlFor="pw-signin">Password</label>
									<input id="pw-signup" type="password" />
								</div>
								<div className="field">
									<label htmlFor="pwc-signin">Confirm Password</label>
									<input id="pwc-signup" type="password" />
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