import colors from 'colors';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import app from './app';
import { errorLogger, logger } from './shared/logger';
import { socketHelper } from './helpers/socket';
import { config } from './config';
import os from 'os';
import cluster from 'cluster';

// Number of CPU cores
const numCPUs = os.cpus().length;


//uncaught exception
process.on('uncaughtException', error => {
  errorLogger.error('UnhandleException Detected', error);
  process.exit(1);
});

if (cluster.isMaster) {
  // Fork workers for each CPU core
  logger.info(colors.green(`Master process started, forking ${numCPUs} workers...`));
  
  // Fork workers for each core
  for (let i = 0; i < numCPUs; i++) {
    console.log("num of CPUs forking 🍴 numCPUs i", i);
    cluster.fork();
  }

  // When a worker dies, log it and fork a new worker
  cluster.on('exit', (worker, code, signal) => {
    logger.error(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });

} else {

  let server: any;

  async function main() {
    try {
      await mongoose.connect(config.database.mongoUrl as string);
      logger.info(colors.green('🚀 Database connected successfully'));
      const port =
        typeof config.port === 'number' ? config.port : Number(config.port);
      server = app.listen(port, config.backend.ip as string, () => {
        logger.info(
          colors.yellow(
            `♻️  Application listening on port ${config.backend.baseUrl}/v1`,
          ),
        );
      });
      //socket
      const io = new Server(server, {
        pingTimeout: 60000,
        cors: {
          origin: '*',
        },
      });
      socketHelper.socket(io);
      // @ts-ignore
      global.io = io;
    } catch (error) {
      errorLogger.error(colors.red('🤢 Failed to connect Database'));
    }

    //handle unhandledRejection
    process.on('unhandledRejection', error => {
      if (server) {
        server.close(() => {
          errorLogger.error('UnhandledRejection Detected', error);
          process.exit(1);
        });
      } else {
        process.exit(1);
      }
    });
  }

  main();

  //SIGTERM
  process.on('SIGTERM', () => {
    logger.info('SIGTERM IS RECEIVE');
    if (server) {
      server.close();
    }
  });

}