import { Handler } from 'express';
import { JoiObject } from 'joi';

export type Verb = 'post' | 'get' | 'put' | 'delete';

export type RouteDef = {
  [index in Verb]?: {
    method: Handler;
    public?: boolean;
  }
};

export type RouteConfig = {
  [index: string]: RouteDef;
};

export interface ServiceFn {
  <T, RT>(arg1: T): RT;
  params?: string[];
  schema?: {
    [s: string]: JoiObject;
  };
}

declare module 'mongoose' {
  interface Model<T extends Document> {
    // see implementation in models/index.ts
    findByIdOrError(
      id: string,
      projection: any,
      options: any,
    ): DocumentQuery<T | null, T>;
  }
}

declare global {
  namespace Express {
    interface Request {
      user: {
        id?: string;
      };
    }
  }
}
