import * as path from 'path';
import * as fs from 'fs';
import * as util from 'util';
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const unlinkFile = util.promisify(fs.unlink);
export class FileSystemHelper {
  static getFilePath(relativePath: string) {
    return path.join(__dirname, relativePath);
  }
  static createDir(dirPath: string) {
    try {
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
    } catch (error) {
      throw new Error(error);
    }
  }
  static async removeFile(relativePath: string) {
    await unlinkFile(this.getFilePath(relativePath));
  }
  static async readFile(relativePath: string, options: any = {}) {
    const filePath = this.getFilePath(relativePath);
    return await readFile(filePath, options);
  }
  static async writeFile(
    relativePath: string,
    data: string | NodeJS.ArrayBufferView,
    options: any = {},
  ) {
    const filePath = this.getFilePath(relativePath);
    return await writeFile(filePath, data, options);
  }
}
