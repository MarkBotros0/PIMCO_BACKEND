import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext
} from '@nestjs/common';

export const UserId = createParamDecorator(
  (data: any, ctx: ExecutionContext): number | undefined => {
    const request = ctx.switchToHttp().getRequest();
    if (request?.user) {
      return request.user.id;
    }
    throw new BadRequestException(
      'Instructor role must be signed in or admin must add instructorId in the body.'
    );
  }
);
