import { RouteConfig } from './types';
import * as AuthController from './controllers/AuthController';

const routes: RouteConfig = {
  '/register': {
    post: {
      method: AuthController.register,
      public: true,
    },
  },
};

export default routes;
