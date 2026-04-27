class ApiError extends Error {
  constructor(statusCode, message) {
    super(message)
    this.statusCode = statusCode
    this.message = message
    if (!message) {
      this.message = "something went wrong"
    }
  }
}

module.exports = ApiError
