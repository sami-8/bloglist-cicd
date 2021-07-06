const Test = require('supertest').Test

Test.prototype.expectErrorMessage = function (message) {
  return this.expect((res) => {
    const { body } = res

    if (!body.error) {
      return Error(
        `Expected an error with a message "${message}", `+
        'but the response did not return any errors.',
      )
    }
    if (body.error !== message) {
      return Error(
        `Expected an error message "${message}", but got "${body.error}".`,
      )
    }
    return false
  })
}
