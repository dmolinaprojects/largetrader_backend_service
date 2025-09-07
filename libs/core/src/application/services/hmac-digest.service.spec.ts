import { Test, TestingModule } from '@nestjs/testing';
import { createHmac } from 'crypto';
import { HmacAlgorithms } from '../enums';
import { HmacDigestService } from './hmac-digest.service';

describe('HmacDigestService', () => {
  let service: HmacDigestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HmacDigestService],
    }).compile();

    service = module.get<HmacDigestService>(HmacDigestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should calculate hmac digest', () => {
    /**
     * SECTION: Arrange
     */
    const secret = 'secret';
    const payload = JSON.stringify({ name: 'John Doe' });
    const expected = createHmac(HmacAlgorithms.HMAC_SHA256_HEX, secret)
      .update(Buffer.from(payload, 'utf8'))
      .digest('hex');

    /**
     * SECTION: Act
     */
    const digest = service.calculateHmacDigest(
      HmacAlgorithms.HMAC_SHA256_HEX,
      payload,
      secret,
    );

    /**
     * SECTION: Assert
     */
    expect(digest).toBe(expected);
  });
});
