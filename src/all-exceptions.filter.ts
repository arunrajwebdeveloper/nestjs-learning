import {
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';
import { MyLoggerService } from './my-logger/my-logger.service';
import mongoose from 'mongoose';

type MyResponseObj = {
  statusCode: number;
  timestamp: string;
  path: string;
  response: string | object;
  ip: string | undefined; // Add IP field
};

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  private readonly logger = new MyLoggerService(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Extract Client IP Address
    const clientIp =
      request.headers['x-forwarded-for']?.toString().split(',')[0] ||
      request.ip;

    const myResponseObj: MyResponseObj = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      timestamp: new Date().toISOString(),
      path: request.url,
      response: 'Internal Server Error',
      ip: clientIp, // Store IP Address
    };

    if (exception instanceof HttpException) {
      myResponseObj.statusCode = exception.getStatus();
      myResponseObj.response = exception.getResponse();
    } else if (exception instanceof mongoose.Error.ValidationError) {
      myResponseObj.statusCode = HttpStatus.UNPROCESSABLE_ENTITY;
      myResponseObj.response = Object.values(exception.errors)
        .map((err) => err.message)
        .join(', ');
    } else if (exception instanceof mongoose.Error.CastError) {
      myResponseObj.statusCode = HttpStatus.BAD_REQUEST;
      myResponseObj.response = `Invalid ${exception.path}: ${JSON.stringify(exception.value)}`;
    } else if ((exception as any)?.code === 11000) {
      myResponseObj.statusCode = HttpStatus.CONFLICT;
      myResponseObj.response = `Duplicate key error: ${JSON.stringify(
        (exception as any).keyValue,
      )}`;
    }

    response.status(myResponseObj.statusCode).json(myResponseObj);

    // Log the Error with Client IP
    this.logger.error(
      JSON.stringify(
        {
          error:
            exception instanceof Error ? exception.name : 'UnknownException',
          message:
            typeof myResponseObj.response === 'object'
              ? myResponseObj.response
              : { message: myResponseObj.response },
          statusCode: myResponseObj.statusCode,
          timestamp: myResponseObj.timestamp,
          path: myResponseObj.path,
          ip: myResponseObj.ip, // Log Client IP Address
        },
        null,
        2,
      ),
      AllExceptionsFilter.name,
    );

    super.catch(exception, host);
  }
}
