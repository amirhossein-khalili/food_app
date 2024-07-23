import express from 'express';
import App from './services/ExpressApp';
import dbConnection from './services/Database';
import { PORT } from './config';
import fs from 'fs';
import expressListEndpoints from 'express-list-endpoints';
import path from 'path';

const startServer = async () => {
  const app = express();

  try {
    await dbConnection();
    await App(app);

    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
