import { Controller, Post, Body, Get, Put } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('') 
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('users')  
  async createUser(@Body() userData: any) {
    return this.usersService.createUser(userData);
  }

  @Get('users')  
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Get('data')   
  async getData() {
    return this.usersService.getAllUsers();
  }

  @Put('users')  // New PUT endpoint
  async updateUserProfile(@Body() updateData: any) {
    return this.usersService.updateUserProfile(updateData);
  }
}