import path from "path";
import fileStream from "fs";
// import sharp from "sharp";
import { Storage } from "@/core/use-cases/storage/Storage";
import { FileBlob } from "@/core/models/FileBlob";
import { UniqueIdentifier } from "@/core/use-cases/helpers/UniversallyUniqueIdentifier";

export class MachineStorage implements Storage {
  constructor(
    private readonly universallyUniqueIdentifier: UniqueIdentifier
  ) { }

  async save(fileBlob: FileBlob, prefix: string, fileName?: string): Promise<string> {
    const fileExtension = path.extname(fileBlob.name);
    const uniqueCode = this.universallyUniqueIdentifier.generate();
    // const resizedImageBuffer = String(fileBlob.mimetype).startsWith("image/")
    //   ? await sharp(fileBlob.buffer).toFormat(fileExtension.replace(".", "") as any).jpeg({ quality: 80 }).toBuffer() : fileBlob.buffer;
    const resizedImageBuffer = fileBlob.buffer;

    const FILE_PATH = prefix;
    const FOLDER = path.join(__dirname, "../../presentation" + FILE_PATH);
    if (!fileStream.existsSync(FOLDER)) {
      fileStream.mkdirSync(FOLDER);
    }
    const generateFileName = fileName || (uniqueCode + fileExtension);
    return new Promise((resolve, reject) => fileStream.writeFile(FOLDER + generateFileName, resizedImageBuffer, error => error ? reject(error) : resolve(FILE_PATH + generateFileName)));
  }

  async delete(uri: string): Promise<void> {
    const CURRENT_LOCATION = path.join(__dirname, "../../presentation" + uri);
    return new Promise((resolve, reject) => fileStream.unlink(CURRENT_LOCATION, error => error ? reject(error) : resolve()));
  }
}
