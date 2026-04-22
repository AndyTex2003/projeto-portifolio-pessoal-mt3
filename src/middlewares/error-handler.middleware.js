export const errorHandler = (error, _request, response, _next) => {
  if (error.statusCode) {
    return response.status(error.statusCode).json({
      message: error.message,
      details: error.details ?? null
    });
  }

  console.error(error);

  return response.status(500).json({
    message: 'Internal server error'
  });
};
