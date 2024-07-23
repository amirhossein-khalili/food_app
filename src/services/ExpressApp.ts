import express, { Application } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cors from 'cors';
import { json, urlencoded } from 'express';
import { CustomerRoute } from '../api/v1/routes';

export default async (app: Application): Promise<Application> => {
  /*
    ----------------------------------------------------------------


        initialize the express application packages
        
    
    ----------------------------------------------------------------
    */
  app.use(helmet());
  app.use(morgan('combined'));
  app.use(cors());
  app.use(compression());
  app.use(json());
  app.use(urlencoded({ extended: true }));
  app.use(json());

  app.use('/api/v1/customer', CustomerRoute);

  // Middleware for error handling (should be placed after all other app.use() calls)
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('please try again later .');
  });

  return app;
};
