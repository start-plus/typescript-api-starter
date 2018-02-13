import * as http from 'http';
import * as express from 'express';
import * as cors from 'cors';
import * as mongoose from 'mongoose';
// import {Strategy as BearerStrategy} from 'passport-http-bearer';
// import passport from 'passport';
import * as bodyParser from 'body-parser';
import domainMiddleware = require('express-domain-middleware');
import { errorHandler, notFoundHandler } from 'express-api-error-handler';
import * as config from 'config';
import './bootstrap';
import routes from './routes';
import loadRoutes from './common/loadRoutes';
import logger from './common/logger';
// import { BearerToken, User } from './models';

const app = express();
app.set('port', config.PORT);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(domainMiddleware);

// passport.use(new BearerStrategy(async (token, done) => {
//   const bearerToken = await BearerToken.findById(token);
//   if (!bearerToken) {
//     return done(null, false);
//   }
//   const user = await User.findById(bearerToken.userId);
//   if (!user) {
//     return done(null, false);
//   }
//   return done(null, user);
// }));

const apiRouter = express.Router();

loadRoutes(apiRouter, routes);

app.use('/api', apiRouter);

app.use(
  errorHandler({
    log: ({ err, req, body }: any) => {
      logger.error(err, `${body.status} ${req.method} ${req.url}`);
    },
  }),
);

app.use(
  notFoundHandler({
    log: ({ req }: any) => {
      logger.error(`404 ${req.method} ${req.url}`);
    },
  }),
);

if (!module.parent) {
  const server = http.createServer(app);
  mongoose.connect(config.MONGODB_URL).then(() => {
    server.listen(app.get('port'), () => {
      logger.info(
        `Express server listening on port ${app.get('port')} in ${
          process.env.NODE_ENV
        } mode`,
      );
    });
  });
}

export default app;
