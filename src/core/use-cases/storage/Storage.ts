import { DeleteFile } from "./DeleteFile";
import { UploadFile } from "./UploadFile";

export interface Storage extends UploadFile, DeleteFile { }
