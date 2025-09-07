import { Injectable } from '@nestjs/common';
import { createHmac } from 'crypto';
import { HmacAlgorithms } from '../enums';

@Injectable()
export class HmacDigestService {
  calculateHmacDigest(
    algorithm: HmacAlgorithms,
    payload: string,
    secretKey: string,
  ): string {
    return createHmac(algorithm, secretKey)
      .update(Buffer.from(payload, 'utf8'))
      .digest('hex');
  }
}
