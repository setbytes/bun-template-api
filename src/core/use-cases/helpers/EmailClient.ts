export interface EmailClient {
  send(params: EmailParam): Promise<any>
}

export type EmailParam = {
  from?: string
  to: string | Array<string>
  subject: string
  text: string
};
