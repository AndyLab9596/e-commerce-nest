import { Expose } from 'class-transformer';
import { Roles } from 'src/utilities/common/user-roles.enum';

export class UserDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  roles: Roles[];
}
