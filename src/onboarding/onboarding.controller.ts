import { Controller, Get, Put, Body } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';

@Controller('onboarding')
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Get('config')
  async getConfig() {
    return this.onboardingService.getConfig();
  }

  @Put('config')
  async updateConfig(@Body() config: any[]) {
    return this.onboardingService.updateConfig(config);
  }
}