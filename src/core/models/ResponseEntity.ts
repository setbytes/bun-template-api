export class ResponseEntity<T = any> {
  public statusCode: number;

  constructor(
    public body: T,
    public pageNumber?: number,
    public pageSize?: number,
    public total?: number
  ) {}
}
