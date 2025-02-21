import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { SupabaseClient } from '../database/database.module';
import { SupabaseClient as Supabase } from '@supabase/supabase-js';
import { CustomLogger } from '../common/logger/logger.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @Inject(SupabaseClient)
    private readonly supabase: Supabase,
    private logger: CustomLogger,
  ) {
    this.logger.setContext('UsersService');
  }

  async createUser(userData: any) {
    try {
      this.logger.log('Starting user creation process');
      this.logger.debug('Processing user data', { email: userData.email });

      const hashedPassword = await bcrypt.hash(userData.password, 10);
      this.logger.log('Password hashed successfully');
      
      const { data: user, error: userError } = await this.supabase
        .from('users')
        .insert([
          {
            email: userData.email,
            password: hashedPassword,
          },
        ])
        .select()
        .single();

      if (userError) {
        this.logger.error('Failed to create user in database', userError.message);
        throw new HttpException(userError.message, HttpStatus.BAD_REQUEST);
      }

      this.logger.log('User created successfully in database');

      const { error: profileError } = await this.supabase
        .from('user_profiles')
        .insert([
          {
            user_id: user.id,
            ...userData.profile,
          },
        ]);

      if (profileError) {
        this.logger.error('Failed to create user profile', profileError.message);
        await this.supabase
          .from('users')
          .delete()
          .match({ id: user.id });
          
        throw new HttpException(profileError.message, HttpStatus.BAD_REQUEST);
      }

      this.logger.log('User profile created successfully');
      return user;
    } catch (error) {
      this.logger.error(
        'Error in user creation process', 
        error instanceof Error ? error.stack : 'Unknown error'
      );
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error creating user',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getAllUsers() {
    try {
      this.logger.log('Starting to fetch all users');

      const { data: users, error } = await this.supabase
        .from('users')
        .select(`
          *,
          user_profiles (*)
        `);

      if (error) {
        this.logger.error('Failed to fetch users from database', error.message);
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }

      this.logger.log(`Successfully fetched ${users?.length || 0} users`);
      return users;
    } catch (error) {
      this.logger.error(
        'Error fetching users', 
        error instanceof Error ? error.stack : 'Unknown error'
      );
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error fetching users',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateUserProfile(updateData: any) {
    try {
      this.logger.log('Starting user profile update process');
  
      // Validate user_id
      if (!updateData.user_id) {
        this.logger.error('Missing user_id in update request');
        throw new HttpException('user_id is required', HttpStatus.BAD_REQUEST);
      }
  
      // Assuming the updateData contains the user_id and user_profiles array
      const profileUpdates = updateData.user_profiles[0];
      
      const { data: profile, error: profileError } = await this.supabase
        .from('user_profiles')
        .update({
          about_me: profileUpdates.about_me,
          street_address: profileUpdates.street_address,
          city: profileUpdates.city,
          state: profileUpdates.state,
          zip: profileUpdates.zip,
          birthdate: profileUpdates.birthdate,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', updateData.user_id)  // Match the user_id
        .select()
        .single();
  
      if (profileError) {
        this.logger.error('Failed to update user profile', profileError.message);
        throw new HttpException(profileError.message, HttpStatus.BAD_REQUEST);
      }
  
      this.logger.log('User profile updated successfully');
      
      // Return the updated user with profile
      const { data: user, error: userError } = await this.supabase
        .from('users')
        .select('*, user_profiles(*)')
        .eq('id', updateData.user_id)
        .single();
  
      if (userError) {
        this.logger.error('Failed to fetch updated user', userError.message);
        throw new HttpException(userError.message, HttpStatus.BAD_REQUEST);
      }
  
      return user;
    } catch (error) {
      this.logger.error(
        'Error in user profile update process',
        error instanceof Error ? error.stack : 'Unknown error'
      );
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error updating user profile',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}