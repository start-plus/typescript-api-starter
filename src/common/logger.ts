/**
 * Global logger
 */

import * as bunyan from 'bunyan';

const logger = bunyan.createLogger({
  name: 'app',
  serializers: bunyan.stdSerializers,
});

export default logger;
