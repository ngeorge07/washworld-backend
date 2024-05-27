import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class UpdateUserGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const body = request.body;
    const params = request.params;

    // If the user is not an admin and they are trying to update a different user's record
    // or they are trying to update the roles field, deny the request
    if (!user.roles.includes('admin')) {
      if (
        user.sub !== +params.id ||
        (body.roles && body.roles.includes('admin'))
      )
        throw new ForbiddenException(
          'You do not have permission to perform this action',
        );
    }

    return true;
  }
}
