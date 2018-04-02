import React from 'react';
import './Header.css';

const Header = () => {
	return (
		<header>
			<div className="panel">
				<div className="date-control">
					<div className="display"></div>
					<div className=""></div>
				</div>
				<div className="search">
					<div className=""></div>
				</div>
				<div className="tools">
					<div className=""></div>
				</div>
			</div>
		</header>
	);	
};

export default Header;