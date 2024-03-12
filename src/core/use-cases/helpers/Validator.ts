export namespace Validator {
  export type Input = {
    [key: string]: any;
    email?: string
    password?: string
  }
  export type Output = {
    success: boolean
    message: string
  }
}
export interface Validator {
  verify(param: Validator.Input): Validator.Output
}
