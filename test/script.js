const isLeap = (year) => {
	return (year % 100 === 0) ? ( (year % 400) === 0 ? 1 : 0 ) : ( (year % 4 === 0) === 0 ? 1 : 0 );
}



let myDate = new Date();
let year = myDate.getFullYear();
let daysPerMonth = [31, 28 + isLeap(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
let month = myDate.getMonth();
let days = daysPerMonth[month];

let today = new Date(2018, 11, 1);
let day = today.getDay();

let trCount = Math.ceil( (days + day) / 7 );

let tableContent = '';

for (let i = 0; i < trCount; i++) {
	tableContent += '<tr>';
	for (let j = 0; j < 7; j++) {
		let idx = i * 7 + j;
		let data = idx - day + 1;

		if (data < 0 || data > days) {
			tableContent += '<td></td>';
		}
		else {
			tableContent += '<td>' + data + '</td>';
		}
	}
	tableContent += '</tr>';
}



document.querySelector('#calendar').innerHTML = tableContent;