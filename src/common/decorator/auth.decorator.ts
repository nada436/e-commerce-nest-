import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';

import { RolesGuard } from '../guards/Authorization guard';
import { AuthGuard } from '../guards/Authentication';

export function Auth(roles) {
  return applyDecorators(
    UseGuards(AuthGuard, RolesGuard), // Apply both AuthGuard and RolesGuard
    SetMetadata('roles', roles), // Set metadata with the provided roles
  );
}
