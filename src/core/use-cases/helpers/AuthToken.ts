export interface AuthToken {
  generate(payload: any, secret?: string): Promise<string>;
  decode(token: string): Promise<any>;
  verify(token: string, secret?: string): Promise<any>;
}
