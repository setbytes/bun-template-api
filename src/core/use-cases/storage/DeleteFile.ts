export interface DeleteFile {
  delete(path: string): Promise<void>
}
