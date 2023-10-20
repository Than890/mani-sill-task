import * as bcrypt from 'bcrypt';

export class Helpers {
  constructor() {}

  public static async hashPassword(password: string) {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }
}
