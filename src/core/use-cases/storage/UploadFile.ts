import { FileBlob } from "@/core/models/FileBlob";

export interface UploadFile {
  save(fileBlob: FileBlob, prefix: string, fileName?: string): Promise<string>
}
