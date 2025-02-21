import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { CreateConfigDto } from './dto/createConfig.dto';
import { SupabaseClient as Supabase } from '@supabase/supabase-js';
import { CustomLogger } from '../common/logger/logger.service';

@Injectable()
export class ConfigService {
  constructor(
    @Inject('SUPABASE_CLIENT')
    private supabase: Supabase,
    private logger: CustomLogger,
  ) {
    this.logger.setContext('ConfigService');
  }

  async create(createConfigDto: CreateConfigDto) {
    try {
      this.logger.log('Starting configuration creation');
      this.logger.debug('Validating configuration components', { components: createConfigDto.components });
      
      this.validateConfig(createConfigDto.components);
      this.logger.log('Configuration validation passed');

      const { data, error } = await this.supabase
        .from('onboarding_config')
        .insert(createConfigDto.components)
        .select();

      if (error) {
        this.logger.error('Failed to insert configuration', error.message);
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }

      this.logger.log('Successfully created configuration');
      return data;
    } catch (error) {
      this.logger.error(
        'Error in create configuration', 
        error instanceof Error ? error.stack : 'Unknown error'
      );
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error creating configuration',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findAll() {
    try {
      this.logger.log('Fetching all configurations');
      
      const { data, error } = await this.supabase
        .from('onboarding_config')
        .select('*')
        .order('page_number');

      if (error) {
        this.logger.error('Failed to fetch configurations', error.message);
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }

      this.logger.log(`Successfully fetched ${data?.length || 0} configurations`);
      return data;
    } catch (error) {
      this.logger.error(
        'Error in fetch configurations', 
        error instanceof Error ? error.stack : 'Unknown error'
      );
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error fetching configuration',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async update(updateConfigDto: CreateConfigDto) {
    try {
      this.logger.log('Starting configuration update');
      this.logger.debug('Validating update components', { components: updateConfigDto.components });
      
      this.validateConfig(updateConfigDto.components);
      this.logger.log('Update validation passed');

      this.logger.log('Deleting existing configuration');
      const { error: deleteError } = await this.supabase
        .from('onboarding_config')
        .delete()
        .not('id', 'eq', '00000000-0000-0000-0000-000000000000');

      if (deleteError) {
        this.logger.error('Failed to delete existing configuration', deleteError.message);
        throw new HttpException(deleteError.message, HttpStatus.BAD_REQUEST);
      }

      this.logger.log('Inserting new configuration');
      const { data: insertData, error: insertError } = await this.supabase
        .from('onboarding_config')
        .insert(updateConfigDto.components)
        .select();

      if (insertError) {
        this.logger.error('Failed to insert new configuration', insertError.message);
        throw new HttpException(insertError.message, HttpStatus.BAD_REQUEST);
      }

      this.logger.log('Successfully updated configuration');
      return insertData;
    } catch (error) {
      this.logger.error(
        'Error in update configuration', 
        error instanceof Error ? error.stack : 'Unknown error'
      );
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error updating configuration',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  private validateConfig(components: any[]) {
    this.logger.debug('Starting component validation', { components });
    
    const page2Components = components.filter(c => c.page_number === 2);
    const page3Components = components.filter(c => c.page_number === 3);

    this.logger.debug('Component counts', {
      page2Count: page2Components.length,
      page3Count: page3Components.length
    });

    if (page2Components.length === 0 || page3Components.length === 0) {
      this.logger.warn('Invalid component count', {
        page2Count: page2Components.length,
        page3Count: page3Components.length
      });
      throw new HttpException(
        'Each page must have at least one component',
        HttpStatus.BAD_REQUEST
      );
    }

    if (page2Components.length > 2 || page3Components.length > 2) {
      this.logger.warn('Too many components', {
        page2Count: page2Components.length,
        page3Count: page3Components.length
      });
      throw new HttpException(
        'Each page can have a maximum of two components',
        HttpStatus.BAD_REQUEST
      );
    }

    const validComponents = ['about_me', 'address', 'birthdate'];
    const hasInvalidComponent = components.some(
      c => !validComponents.includes(c.component_name)
    );

    if (hasInvalidComponent) {
      this.logger.warn('Invalid component name found', { components });
      throw new HttpException(
        `Component names must be one of: ${validComponents.join(', ')}`,
        HttpStatus.BAD_REQUEST
      );
    }

    this.logger.debug('Component validation passed');
  }
}