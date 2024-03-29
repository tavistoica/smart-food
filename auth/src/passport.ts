import passport from "passport";
import strategy from "passport-facebook";
import jwt from "jsonwebtoken";
import { logger } from "./utils/logger";

import { User } from "./models/user.model";
import { UserType, UserEnum } from "@ostoica/common";

import {
  generateAccessToken,
  generateRefreshToken,
} from "./utils/generateToken";

const FacebookStrategy = strategy.Strategy;

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj: typeof User, done) {
  done(null, obj);
});

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL!,
      profileFields: ["email", "name"],
    },
    async (_accessToken, _refreshToken, profile: strategy.Profile, done) => {
      const { email, id } = profile._json;
      logger.info(`test profile ${JSON.stringify(profile._json)}`);
      const userData: { email: string; role: UserType } = {
        email: email || id,
        role: UserEnum.Customer,
      };
      logger.info(`userData ${JSON.stringify(userData)}`);

      const checkUser = await User.findOne({ email: email || id });
      logger.info(`checkUser ${JSON.stringify(checkUser)}`);
      if (!checkUser) {
        const user = await User.build(userData).save();

        //  @ts-ignore
        const accessToken = generateAccessToken(user);
        //  @ts-ignore
        const refreshToken = generateRefreshToken(user);

        logger.info(
          `data in checkUser ${accessToken} ${refreshToken} ${JSON.stringify(
            profile
          )}`
        );

        done(null, profile, { accessToken, refreshToken });
        return;
      }

      //  @ts-ignore
      const accessToken = generateAccessToken(checkUser);
      //  @ts-ignore
      const refreshToken = generateRefreshToken(checkUser);

      logger.info(
        `data in checkUser ${accessToken} ${refreshToken} ${JSON.stringify(
          profile
        )}`
      );

      done(null, profile, { accessToken, refreshToken });
    }
  )
);
