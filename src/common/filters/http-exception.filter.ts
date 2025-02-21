import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import { Response } from 'express';
import { ApiResponse } from '../interfaces/api-response.interace';
  
  @Catch()
  export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      
      const status = 
        exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR;
  
      const message = 
        exception instanceof HttpException
          ? exception.message
          : 'Internal server error';
  
      const errorResponse: ApiResponse<null> = {
        success: false,
        message: message,
        data: null,
        error: exception.response?.message || exception.message,
      };
  
      response.status(status).json(errorResponse);
    }
  }