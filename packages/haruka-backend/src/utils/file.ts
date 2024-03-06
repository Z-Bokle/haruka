import { mkdir, stat, writeFile } from 'fs';
import { join } from 'path';

interface WriteFileConfigs {
  targetPath: string;
  targetName: string;
  file: Express.Multer.File;
}

export class FileManager {
  static async writeFile(configs: WriteFileConfigs) {
    const { targetPath, targetName, file } = configs;
    const target = join(targetPath, targetName);

    stat(targetPath, (err) => {
      if (err && err.code === 'ENOENT') {
        throw new Error('保存文件失败，目录不存在');
      }
    });

    stat(target, (err) => {
      if (!err) {
        throw new Error('保存文件失败，文件已存在');
      }
    });

    writeFile(target, file.buffer, (err) => {
      if (err) {
        throw new Error('保存文件失败');
      }
    });
  }

  /** 尝试创建目录，如果目录已存在则不做任何处理 */
  static createDir(path: string) {
    stat(path, (err) => {
      if (err) {
        mkdir(path, (err) => {
          if (err) {
            throw new Error(`创建目录失败`);
          }
        });
      }
    });
  }
}
