import { diskStorage } from 'multer';

export class MyMulter {
  static Storage = (dest: string) => {
    return diskStorage({
      destination: dest,
      filename: (req, file, cb) => {
        const ext = file.originalname.split('.').pop();
        const newName = Date.now() + '.' + ext;
        cb(null, newName);
      },
    });
  };
}
