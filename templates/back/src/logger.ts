import winston from 'winston';

export function createLogger(logLevel?: string) {
  let level = 'info';
  if (logLevel) {
    level = logLevel;
  }

  const logger = winston.createLogger({
    level,
    format: winston.format.json(),
    transports: [
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' }),
    ],
  });

  if (process.env.NODE_ENV !== 'production') {
    logger.add(
      new winston.transports.Console({
        format: winston.format.simple(),
      }),
    );
  }

  return logger;
}

const logger = createLogger(process.env.SERVER_LOGLEVEL);

export default logger;
