export interface Crypto {
  hash(text: string): Promise<string>;
  compare(text: string, encrypt: string): Promise<boolean>;
}
