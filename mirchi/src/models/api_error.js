class ApiError {
  constructor(error, status_code) {
    this.error = error.error || error;
    this.error_message = error.message || error;
  }
}

module.exports = ApiError;
