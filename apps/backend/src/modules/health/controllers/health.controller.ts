import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('health')
export class HealthController {
  @ApiOperation({
    summary: 'Project Health',
  })
  @ApiResponse({
    status: 200,
    description: 'Executed successfully.',
  })
  @Get()
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
