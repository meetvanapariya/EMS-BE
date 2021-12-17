const jsonResponse = (res, status, error, payload, message ='')  => {
	res.status(status).send(JSON.stringify({
		error: error,
		payload: payload,
		message: message,
		status: status.toString()
	}));
};


export default jsonResponse