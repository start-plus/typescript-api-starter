// import { RouteConfig } from './types';
import * as AuthController from './controllers/AuthController';
import { RouteConfig } from 'express-route-config/dist/types/types';

const routes: RouteConfig<'admin' | 'user'> = {
  '/register': {
    post: {
      method: AuthController.register,
      public: true,
    },
  },
};

export default routes;
