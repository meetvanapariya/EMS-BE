const jsonResponse = (res, status, error, payload, message = "") => {
  res.status(status).send(
    JSON.stringify({
      error: error,
      payload: payload,
      messages: message,
      status: status.toString(),
    })
  );
};

export default jsonResponse;
