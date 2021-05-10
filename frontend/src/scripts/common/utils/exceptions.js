import { get } from 'lodash';

import { Logger } from './logger';

export class ApiError extends Error {
  constructor(reason) {
    super();
    const DEFAULT_ERR_CODE = 500;
    this.isApiError = true;
    this.level = 'error';
    this.message = get(reason, 'message', '未知的错误类型');
    this.data = get(reason, 'data', null);
    this.errcode = get(reason, 'code', DEFAULT_ERR_CODE);
    Logger('ApiAdaptor').log(this.level, `(${this.code})${this.message}`);
  }
}

export class NetworkError extends Error {
  constructor() {
    super();
    this.message = '网络连接好像有点不正常';
    this.level = 'warn';
    Logger('ApiAdaptor').log(this.level, this.message);
  }
}

export class UserCancelRequestError extends Error {
  constructor() {
    super();
    this.message = '用户取消了请求操作';
    this.level = 'debug';
    Logger('ApiAdaptor').log(this.level, this.message);
  }
}
