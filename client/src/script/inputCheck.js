

const checkEmptyInput = (input) => {
	if ( input === '' ) {
		return true;
	}

	return false;
};

const checkVPword = (vpword, pword) => {
	if ( vpword === pword ) {
		return true;
	}

	return false;
};

const check = {
	empty: (input) => {
		return checkEmptyInput(input);
	},
	vpword: (vpword, pword) => {
		return checkVPword(vpword, pword); 
	},
};

export default check;