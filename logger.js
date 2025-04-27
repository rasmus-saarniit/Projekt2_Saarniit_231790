// logger.js
const { createLogger, format, transports } = require('winston');

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message, ...meta }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`;
    })
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'app.log' })
  ]
});

function logCreate(model, user, data) {
  logger.info(`${model} created`, { user, data });
}
function logDelete(model, user, params) {
  logger.info(`${model} deleted`, { user, params });
}
function logWarnNotFound(model, user, params) {
  logger.warn(`${model} not found for delete`, { user, params });
}
function logError(model, action, error, meta) {
  logger.error(`Error ${action} ${model}`, { error, ...meta });
}

module.exports = Object.assign(logger, {
  logCreate,
  logDelete,
  logWarnNotFound,
  logError
});
