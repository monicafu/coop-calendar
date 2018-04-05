import React from 'react';
import './Header.css';

const Header = ( {currentMonth, currentYear, clickLeft, clickRight, clickToday} ) => {
	const monthStr= ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

	return (
		<header>
			<div className="panel">
				<div className="date-control">
					<div className="paging">
						<svg className="left-icon" onClick={ clickLeft } fill="#b1b1b1" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
						    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
						</svg>
						<button className="today" onClick={clickToday}>Today</button>
						<svg className="right-icon" onClick={ clickRight } fill="#b1b1b1" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
						    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
						</svg>
					</div>
					<div className="display">{ `${ monthStr[currentMonth] }, ${ currentYear }` }</div>
				</div>
				<div className="search">
					<input type="text" />
					<svg className="search-icon" fill="#b1b1b1" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
					    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
					</svg>
				</div>
				<div className="tools">
					<svg className="add-icon" fill="#797979" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
					    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
					</svg>
					<span className="login">Login</span>
				</div>
			</div>
		</header>
	);	
};

export default Header;