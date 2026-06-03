import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { User } from "./user.types";

type UserCreationAttributes = Optional<User, "id" | "createdAt">;

export class UserModel extends Model<User, UserCreationAttributes> implements User {
  declare id: string;
  declare email: string;
  declare name: string;
  declare passwordHash: string;
  declare readonly createdAt: Date;
}


export function defineUserModel(sequelize: Sequelize) {
  UserModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      passwordHash: {
        type: DataTypes.STRING,
        allowNull: false
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    },
    {
      sequelize,
      tableName: "users",
      indexes: [
        { unique: true, fields: ["email"] },
      ],
      timestamps: true,
      updatedAt: false
    }
  );
}
