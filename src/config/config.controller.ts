import { Controller, Get, Post, Body, Put } from '@nestjs/common';
import { ConfigService } from './config.service';
import { CreateConfigDto } from './dto/createConfig.dto';

@Controller('config')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Post()
  create(@Body() createConfigDto: CreateConfigDto) {
    return this.configService.create(createConfigDto);
  }

  @Get()
  findAll() {
    return this.configService.findAll();
  }

  @Put()
  update(@Body() updateConfigDto: CreateConfigDto) {
    return this.configService.update(updateConfigDto);
  }
}