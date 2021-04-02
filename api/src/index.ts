import "reflect-metadata";
import { createConnection } from "typeorm";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import Express from "express";
import session from "express-session";
import connectRedis from "connect-redis";
import { redis } from "./redis";
import { COOKIE_NAME } from "./utils/constants";

//import { formatError } from "./utils/formatError";

import cors from "cors";
import { AppContext } from "./appContext";

const main = async () => {
  await createConnection();
  const schema = await buildSchema({
    resolvers: [__dirname + "/resolvers/**/*.ts"],
  });

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }) => ({ req, res, redis } as AppContext),
    //formatError,
  });

  const RedisStore = connectRedis(session);

  const app = Express();

  app.use(
    cors({
      credentials: true,
      origin: "http://localhost:3000",
    })
  );

  app.use(
    session({
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      name: COOKIE_NAME,
      secret: "aslkdfjoiq12312",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
      },
    })
  );
  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.listen(4000, () => {
    console.log("server started on http://localhost:4000/graphql");
  });
};
main();
