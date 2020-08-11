import { get } from 'lodash';

class LoggerBase {
  static LEVEL_NUM_MAPPING = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };
  static LEVEL_MAPPING = {
    debug: 'debug',
    info: 'info',
    warn: 'warn',
    error: 'error',
  };

  static instance = {};
  static getInstance(scope) {
    if (!get(LoggerBase.instance, scope)) {
      LoggerBase.instance[scope] = new LoggerBase(scope);
    }
    return LoggerBase.instance[scope];
  }

  constructor(scope) {
    const { NODE_ENV } = process.env;
    this.scope = `[${scope}]`;
    this.outputLevel = LoggerBase.LEVEL_NUM_MAPPING.debug;

    if (NODE_ENV === 'production') {
      this.outputLevel = LoggerBase.LEVEL_NUM_MAPPING.info;
    }
  }

  debug(...args) {
    if (this.outputLevel <= LoggerBase.LEVEL_NUM_MAPPING.debug) {
      console.debug(this.scope, ...args);
    }
  }

  info(...args) {
    if (this.outputLevel <= LoggerBase.LEVEL_NUM_MAPPING.info) {
      console.info(this.scope, ...args);
    }
  }


  warn(...args) {
    if (this.outputLevel <= LoggerBase.LEVEL_NUM_MAPPING.warn) {
      console.warn(this.scope, ...args);
    }
  }

  error(...args) {
    if (this.outputLevel <= LoggerBase.LEVEL_NUM_MAPPING.error) {
      console.error(this.scope, ...args);
    }
  }

  log(level, ...args) {
    if (this.outputLevel <= get(LoggerBase.LEVEL_NUM_MAPPING, level, 'info')) {
      get(console, get(LoggerBase.LEVEL_MAPPING, level, 'info'))(this.scope, ...args);
    }
  }

}

export const Logger = LoggerBase.getInstance;
export default Logger;
