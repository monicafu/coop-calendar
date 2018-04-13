
const checkPwordc = (pwc, pw) => {
	if ( pwc === pw ) {
		return true;
	}

	return false;
}

const check = {
	pwordc: (pwc, pw) => {
		return checkPwordc(pwc, pw); 
	},
};

export default check;