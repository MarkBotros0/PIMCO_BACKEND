import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext
} from '@nestjs/common';

export const UserId = createParamDecorator(
  (data: any, ctx: ExecutionContext): number | undefined => {
    const request = ctx.switchToHttp().getRequest();
    const userId =
      request.user?.id || request.body?.userId || request.params?.userId;

    throw new BadRequestException(
      'User role must be signed in or admin must add instructorId in the body.'
    );
  }
);
