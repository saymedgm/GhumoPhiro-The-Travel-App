// models are used to define blueprint
// HttpError is inbuilt class in javascript
class HttpError extends Error {
  constructor(message, errorCode) {
    super(message); //forward message to superclass and adds message property
    this.code = errorCode; // add code prooperty
  }
}

module.exports = HttpError;
