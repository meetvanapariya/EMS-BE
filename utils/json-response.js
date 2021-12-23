const jsonResponse = (res, status, error, payload, message = "") => {
  res.status(status).json({
    error: error,
    payload: payload,
    message: message,
    status: status.toString(),
  });
};

export default jsonResponse;
