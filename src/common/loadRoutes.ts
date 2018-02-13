/**
 * An util to load routes
 */

import * as R from 'ramda';
// import passport from 'passport';
import * as HTTPError from 'http-errors';
import wrapAsync from 'express-wrap-async';
import { RequestHandler, Router } from 'express';
import { RouteConfig } from '../types';

/**
 * Load all routes with authentication check
 * @param {Object} router the express router
 * @param {Object} routes the route config
 */
export default function loadRoutes(router: Router, routes: RouteConfig) {
  R.toPairs(routes).forEach(([url, verbs]) => {
    R.toPairs(verbs).forEach(([verb, def]) => {
      const actions: RequestHandler[] = [
        // (req, res, next) => {
        //   if (!req.headers.authorization) {
        //     return next();
        //   }
        //   return passport.authenticate('bearer', { session: false })(req, res, next);
        // },
        (req, res, next) => {
          if (def.public) {
            next();
            return;
          }
          if (!req.user) {
            next(new HTTPError.Unauthorized());
            return;
          }
          next();
        },
      ];
      const method = def.method;
      if (!method) {
        throw new Error(`method is undefined in ${verb.toUpperCase()} ${url}`);
      }
      actions.push(method);
      router[verb](url, wrapAsync(actions));
    });
  });
}
