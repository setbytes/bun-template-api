import multer from "multer";

export class MulterMiddleware {
  public static apply(): any {
    const maxSize = 10 * 1024 * 1024; // 10 MB
    return multer({ storage: multer.memoryStorage(), limits: { fileSize: maxSize } }).single("file");
  }
}
