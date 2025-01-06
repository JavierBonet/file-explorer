import fs from "fs/promises";

export const defaultPath = "/home/javier/Escritorio";

export default class FsUtils {
  static async getElementsFromDirectory(path: string) {
    const result = await fs.readdir(path, { withFileTypes: true });

    return result;
  }
}
