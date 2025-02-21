
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    about_me?: string;
  
    @IsOptional()
    @IsString()
    street?: string;
  
    @IsOptional()
    @IsString()
    city?: string;
  
    @IsOptional()
    @IsString()
    state?: string;
  
    @IsOptional()
    @IsString()
    zip?: string;
  
    @IsOptional()
    @IsString()
    birthdate?: string;
  }