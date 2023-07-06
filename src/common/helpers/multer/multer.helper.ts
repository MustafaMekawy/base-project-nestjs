import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';

export class MyMulter {
  static Storage(dest: string) {
    return diskStorage({
      destination: dest,
      filename: (req, file, cb) => {
        const ext = file.originalname.split('.').pop();
        const newName = Date.now() + '.' + ext;
        cb(null, newName);
      },
    });
  }

  static limits(fileLimitSize: number) {
    return { fileSize: fileLimitSize };
  }
  static fileFilter(...allowedTypes: string[]) {
    return (req: any, file: any, cb: any) => {
      if (
        allowedTypes.some((item) => file.mimetype == item) ||
        allowedTypes.length === 0
      ) {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new BadRequestException('Not Allowed File Type'));
      }
    };
  }
}
