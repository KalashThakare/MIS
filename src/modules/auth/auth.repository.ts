import { UserModel } from "../user/user.model";
import { CreateUserInput, User } from "../user/user.types";

export class AuthRepository {
  async create(input: CreateUserInput): Promise<User> {
    const user = await UserModel.create({
      ...input,
      email: input.email.toLowerCase()
    });

    return user.get({ plain: true });
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({
      where: {
        email: email.toLowerCase()
      }
    });

    return user?.get({ plain: true }) ?? null;
  }

  async findById(id: string): Promise<User | null> {
    const user = await UserModel.findByPk(id);

    return user?.get({ plain: true }) ?? null;
  }
}
