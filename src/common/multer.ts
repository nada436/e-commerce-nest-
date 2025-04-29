
import { diskStorage } from 'multer';
import { BadRequestException } from '@nestjs/common';
import { extname } from 'path';

export const fileTypes = {
  image: ["image/png", "image/jpeg", "image/gif"],
  video: ["video/mp4"],
  audio: ["audio/mpeg"],
  pdf: ["application/pdf"]
};

export const multer_cloudinary = (allowedTypes: string[]) => {
  return {
    storage: diskStorage({
    }),
    fileFilter: (req, file, cb) => {
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new BadRequestException('Invalid file format'), false);
      }
    }
  };
};
