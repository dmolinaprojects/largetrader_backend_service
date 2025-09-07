/* eslint-disable @typescript-eslint/no-unsafe-return */

/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import {
  HttpErrorCode,
  InternalExceptionError,
} from '../filters/internal/internal-exception-error';

@Injectable()
export class FileExtensionValidationPipe implements PipeTransform {
  transform(file: Express.Multer.File, metadata: ArgumentMetadata) {
    if (!file) {
      throw new InternalExceptionError(HttpErrorCode.FILE_NOT_PROVIDED);
    }
    if (!file.mimetype.match(/image\/jpeg|image\/png/)) {
      throw new InternalExceptionError(HttpErrorCode.WRONG_FILE_EXTENSION);
    }
    return file;
  }
}
