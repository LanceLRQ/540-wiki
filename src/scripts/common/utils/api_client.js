import axios, { CancelToken } from 'axios';
import { get } from 'lodash';
import { ApiError, UserCancelRequestError, NetworkError } from './exceptions';
import { getContestLoginStatus } from 'scripts/common/logic/contest/account/selector';
axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';
axios.defaults.xsrfCookieName = 'csrftoken';

const defaultOptions = {
  url: '/',
  method: 'get',
  responseType: 'json',
  data: null,
  withCredentials: true,
  headers: {
    // 'Pref-Debug': 1,
  },
};

const clientBase = (_baseURL, appName = '') => {
  const { API_HOST = '' } = process.env;
  let baseUrl = `${API_HOST}/${appName}`;
  // 如果不设置baseURL，则自动mapping到默认的接口
  const baseURL = _baseURL || baseUrl;
  return (options) => {
    const {
      ...requestOptions
    } = {
      ...defaultOptions,
      ...options,
    };
    const source = CancelToken.source();
    return {
      result: axios({
        baseURL,
        cancelToken: source.token,
        ...requestOptions,
      }),
      client: source,
    };
  };
};
const WEJUDGE_ERROR = 550;
const HTTP_SERVER_ERROR = 500;
const HTTP_SERVER_GATEWAY_TIMEOUT = 502;
const HTTP_NOT_FOUND = 404;
const HTTP_NOT_ALLOW = 400;
const HTTP_FORBIDDEN = 403;
const HTTP_METHOD_NOT_ALLOW = 405;
const HTTP_REQUEST_TOO_LARGE = 413;

axios.interceptors.response.use((resp) => {
  const result = resp.data;
  const perfInfo = get(result, 'perf_info', '');
  if (perfInfo !== null && perfInfo !== '') {
    console.log(`[接口]${get(resp, 'config.url', '')}`);
    console.log(get(result, 'perf_info'));
  }
  return resp;
});

// 添加响应拦截器
axios.interceptors.response.use(null, (error) => {
  // 对响应错误做点什么
  if (axios.isCancel(error)) {
    throw new UserCancelRequestError();
  }
  if (error.response) {
    if (error.response.status >= WEJUDGE_ERROR) {
      const errorEntity = get(error.response, 'data.errors.0', {
        errcode: error.response.status,
        message: '未知的服务端错误类型',
      });
      if (get(errorEntity, 'errcode') === '550.3') {
        const { store } = require('scripts/common/logic/store');
        const { AccountSelectors } = require('scripts/common/logic/account');
        const session = AccountSelectors.getLoginStatus(store.getState());
        // 如果已经是登录状态，等一段时间后刷新页面
        if (session.logined) {
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      }
      if (get(errorEntity, 'errcode') === '554.9') {
        const { store } = require('scripts/common/logic/store');
        const { ContestAccountSelectors } = require('scripts/common/logic/contest');
        const session = ContestAccountSelectors.getContestLoginStatus(store.getState());
        // 如果已经是登录状态，等一段时间后刷新页面
        if (session.logined) {
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      }
      throw new ApiError(errorEntity);
    }
    switch (error.response.status) {
      case HTTP_NOT_FOUND:
        throw new ApiError({
          errcode: error.response.status,
          message: '请求接口不存在',
        });
      case HTTP_NOT_ALLOW:
      case HTTP_FORBIDDEN:
        throw new ApiError({
          errcode: error.response.status,
          message: '请求的接口被禁用',
        });
      case HTTP_METHOD_NOT_ALLOW:
        throw new ApiError({
          errcode: error.response.status,
          message: '请求方式不被允许',
        });
      case HTTP_REQUEST_TOO_LARGE:
        throw new ApiError({
          errcode: error.response.status,
          message: '请求内容过大，无法正确处理',
        });
      case HTTP_SERVER_ERROR:
        if (process.env.NODE_ENV === 'development') {
          const dbg = get(error.response, 'data.errors.0.debug', '');
          if (dbg) {
            const w = window.open('', 'WeJudge ServerEnd Debug');
            w.document && w.document.write(dbg);
          }
        }
        throw new ApiError({
          errcode: error.response.status,
          message: '服务端开小差啦',
        });
      case HTTP_SERVER_GATEWAY_TIMEOUT:
        document.getElementById('wejudge-server-failed-cover').style.display = 'block';
        document.getElementById('wejudge-init-loader-cover').style.display = 'none';
        break;
      default:
        throw new ApiError({
          errcode: error.response.status,
          message: '未知的错误状态码',
        });
    }
  }
  // 未能收到应答内容
  if (error.request) {
    if (error.request.status === HTTP_SERVER_GATEWAY_TIMEOUT) {
      document.getElementById('wejudge-server-failed-cover').style.display = 'block';
      document.getElementById('wejudge-init-loader-cover').style.display = 'none';
    }
    throw new  NetworkError(error.config.url);
  }
  throw error;
});

export const ServerApi = clientBase(null, '');

export default clientBase;
