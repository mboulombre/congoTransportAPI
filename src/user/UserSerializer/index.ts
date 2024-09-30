import { User } from '../entities/user.entity';

class UserSerialized {
  idUser: number;
  lastName: string;
  firstName: string;
  email: string;
  adress1: string;
  adress2: string | null;
  tel1: string;
  tel2: string | null;
}

export class UserSerializer {
  static serialize(users: User): UserSerialized {
    const user = new UserSerialized();

    user.idUser = users.idUser;
    user.adress1 = users.adress1;
    user.adress2 = users.adress2;
    user.email = users.email;
    user.firstName = users.firstName;
    user.lastName = users.lastName;
    user.tel1 = users.tel1;
    user.tel2 = users.tel2;

    return user;
  }
}
