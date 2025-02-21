import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { SupabaseClient } from '../database/database.module';
import { SupabaseClient as Supabase } from '@supabase/supabase-js';
import { CustomLogger } from '../common/logger/logger.service';

@Injectable()
export class OnboardingService {
  constructor(
    @Inject(SupabaseClient)
    private readonly supabase: Supabase,
    private logger: CustomLogger,
  ) {
    this.logger.setContext('OnboardingService');
  }

  async getConfig() {
    try {
      this.logger.log('Fetching onboarding configuration');
      
      const { data, error } = await this.supabase
        .from('onboarding_config')
        .select('*')
        .order('page_number');

      if (error) {
        this.logger.error('Failed to fetch onboarding configuration', error.message);
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }

      this.logger.log('Successfully retrieved onboarding configuration');
      return data;
    } catch (error) {
      this.logger.error(
        'Error fetching onboarding configuration', 
        error instanceof Error ? error.stack : 'Unknown error'
      );
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        'Error fetching onboarding configuration',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateConfig(config: any[]) {
    try {
      this.logger.log('Starting onboarding configuration update');
      
      this.validateConfig(config);

      const { error: deleteError } = await this.supabase
        .from('onboarding_config')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (deleteError) {
        this.logger.error('Failed to delete existing configuration', deleteError.message);
        throw new HttpException(deleteError.message, HttpStatus.BAD_REQUEST);
      }

      const { data, error } = await this.supabase
        .from('onboarding_config')
        .insert(config)
        .select();

      if (error) {
        this.logger.error('Failed to insert new configuration', error.message);
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }

      this.logger.log('Successfully updated onboarding configuration');
      return data;
    } catch (error) {
      this.logger.error(
        'Error updating onboarding configuration', 
        error instanceof Error ? error.stack : 'Unknown error'
      );
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        'Error updating onboarding configuration',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  private validateConfig(config: any[]) {
    const page2Components = config.filter(c => c.page_number === 2);
    const page3Components = config.filter(c => c.page_number === 3);

    if (page2Components.length === 0 || page3Components.length === 0) {
      this.logger.warn('Validation failed: Each page must have at least one component');
      throw new Error('Each page must have at least one component');
    }

    if (page2Components.length > 2 || page3Components.length > 2) {
      this.logger.warn('Validation failed: Each page can have a maximum of two components');
      throw new Error('Each page can have a maximum of two components');
    }
  }
}