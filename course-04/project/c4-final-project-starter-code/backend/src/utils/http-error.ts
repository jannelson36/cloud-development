export default class CreateError extends Error {
    code: number
  
    constructor(message: string, code: number) {
      super()
      this.message = message
      this.code = code
    }
  }