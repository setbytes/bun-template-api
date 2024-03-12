import path from "path";

export class FileBlob {
  public name: string;
  public file: File;
  public buffer: any;
  public size: number;
  public mimetype: string;
  public extension: string;

  public constructor(data: any) {
    this.name = data.file?.originalname;
    this.file = data.file;
    this.buffer = data.file?.buffer;
    this.size = data.file?.size;
    this.mimetype = data.file?.mimetype;
    this.extension = path.extname(data.file?.originalname);
  }
}
