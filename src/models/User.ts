import { Sequelize, DataTypes, Model } from "sequelize";
import bcrypt from "bcryptjs";

class User extends Model {
    declare name: string;
    declare email: string;
    declare password: string;
    declare username: string;
    declare resetPasswordToken: string;
    declare resetPasswordTime: string;
};

const UserSchema = (sequelize: Sequelize) => {
    User.init({
        id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        },
        name: {
        type: DataTypes.STRING,
        allowNull: false,
        },
        email: {
        type: DataTypes.STRING,
        },
        password: {
        type: DataTypes.STRING,
        },
        username: {
        type: DataTypes.STRING,
        },
        resetPasswordToken: {
        type: DataTypes.STRING,
        },
        resetPasswordTime: {
        type: DataTypes.DATE,
        },
    }, {
        hooks: {
            // Hash the password before creating a new user
            beforeCreate: async (user: any) => {
              const hashedPassword = await hashPassword(user.password);
              user.password = hashedPassword;
            },
            // Hash the password before updating an existing user
            beforeUpdate: async (user) => {
              if (user.password) {
                const hashedPassword = await hashPassword(user.password);
                user.password = hashedPassword;
              }
            },
          },
        sequelize 
    })

    sequelize.models.Users = User;
};

// Hash a password using bcrypt
const hashPassword = async (password: string) => {
  try {
    const saltRounds = 10; // Number of salt rounds to use
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (err) {
    console.error(err);
  }
};

export default UserSchema;