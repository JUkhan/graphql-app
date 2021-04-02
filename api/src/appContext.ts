import { Request, Response } from "express";
import { Redis } from "ioredis";
export type AppContext = {
  req: Request & { session: { userId: number } };
  res: Response;
  redis: Redis;
};
