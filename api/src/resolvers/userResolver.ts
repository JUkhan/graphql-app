import { FORGOT_PASSWORD } from "./../utils/constants";
import { AppContext } from "./../appContext";
import { AppUser } from "./../entity/user";
import "reflect-metadata";
import { MinLength, IsEmail } from "class-validator";
import { COOKIE_NAME } from "../utils/constants";
import { v4 } from "uuid";
import { sendEmail } from "../utils/sendEmail";

import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import bcrypt from "bcryptjs";

@InputType()
class RegisterInput {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @MinLength(3)
  userName: string;

  @Field()
  @MinLength(5)
  password: string;
}
@ObjectType()
export class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
export class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => AppUser, { nullable: true })
  user?: AppUser;
}

@Resolver(() => AppUser)
export class UserResolver {
  @Mutation(() => UserResponse)
  async login(
    @Arg("userName") userName: string,
    @Arg("password") password: string,
    @Ctx() { req }: AppContext
  ): Promise<UserResponse> {
    const user = await AppUser.findOne({
      where: [{ userName }, { email: userName }],
    });
    if (!user)
      return {
        errors: [
          {
            field: "userName",
            message: "User name not exist",
          },
        ],
      };
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "password is incorrect",
          },
        ],
      };
    } else {
      req.session.userId = user.id;
      return { user };
    }
  }

  @Mutation(() => UserResponse)
  async registerUser(
    @Arg("input")
    { firstName, lastName, userName, email, password }: RegisterInput,
    @Ctx() { req }: AppContext
  ): Promise<UserResponse> {
    console.log(firstName);
    const hashedPass = await bcrypt.hash(password, 12);
    let user;
    try {
      user = await AppUser.create({
        firstName,
        lastName,
        email,
        userName,
        password: hashedPass,
      }).save();
    } catch (ex) {
      console.log(ex.code);
      const error = new FieldError();

      if (ex.detail.includes("email")) {
        error.field = "email";
        error.message = "email already exists";
      } else if (ex.detail.includes("userName")) {
        error.field = "userName";
        error.message = "userName already exists";
      }
      return {
        errors: [error],
      };
    }
    req.session.userId = user.id;
    return { user };
  }

  @Query(() => AppUser, { nullable: true })
  async me(@Ctx() { req }: AppContext) {
    if (!req.session.userId) return null;
    return await AppUser.findOne(req.session.userId);
  }
  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: AppContext) {
    return new Promise((resolver) => {
      req.session.destroy((err) => {
        if (err) {
          console.log("Logout Error: ", err);
          resolver(false);
          return;
        }
        res.clearCookie(COOKIE_NAME);
        resolver(true);
      });
    });
  }
  @Mutation(() => Boolean)
  async changePasswordEmailVarification(
    @Arg("email") email: string,
    @Ctx() { redis }: AppContext
  ): Promise<boolean> {
    const user = await AppUser.findOne({ where: { email } });

    if (user) {
      const token = v4();
      await redis.set(
        FORGOT_PASSWORD + token,
        user.id,
        "ex",
        1000 * 60 * 60 * 24
      ); //24 hours
      const link = `<a href="http://localhost:3000/change-password/${token}">Change Password</a>`;
      await sendEmail(email, link);
      return true;
    }
    return false;
  }

  @Query(() => String, { nullable: true })
  async validatePasswordChangeToken(
    @Arg("token") token: string,
    @Ctx() { redis }: AppContext
  ): Promise<string | null> {
    return await redis.get(FORGOT_PASSWORD + token);
  }

  @Mutation(() => Boolean)
  async changePassword(
    @Arg("token") token: string,
    @Arg("password") password: string,
    @Ctx() { redis }: AppContext
  ): Promise<boolean> {
    console.log(token);
    const userId = await redis.get(FORGOT_PASSWORD + token);
    if (userId) {
      const user = await AppUser.findOne(userId);
      if (user) {
        const hashedPass = await bcrypt.hash(password, 12);
        user.password = hashedPass;

        await user.save();
        await redis.del(FORGOT_PASSWORD + token);
        return true;
      }
    }
    return false;
  }
}
