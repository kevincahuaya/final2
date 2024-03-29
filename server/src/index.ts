import express from 'express';
import cors from 'cors';
import { log } from 'debug';
import winston from 'winston';
import expressWinston from 'express-winston';

import UserRoutes from './infrastructure/http/routes/user.routes';
import CommonRoutes from './infrastructure/http/routes/common.routes';
import expressErrorHandler from "./infrastructure/http/middlewares/ExpressErrorHandler";

const app: express.Application = express();

const loggerOptions: expressWinston.LoggerOptions = {
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
      winston.format.json(),
      winston.format.prettyPrint(),
      winston.format.colorize({ all: true })
  ),
};

if (!process.env.DEBUG) {
    loggerOptions.meta = false; // when not debugging, log requests as one-liners
}

app.use(expressWinston.logger(loggerOptions));

const routes: Array<CommonRoutes> = [];

app.use(cors());
app.use(express.json());

routes.push(new UserRoutes(app));

app.use(expressErrorHandler.handle);

app.listen(3000, () => {
  routes.forEach((route: CommonRoutes) => {
    log(`Routes configured for ${route.getName()}`);
  });
  log('Server listening on port 3000');
});
