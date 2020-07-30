import axios, { CancelToken } from 'axios';
import { ApiError, UserCancelRequestError } from './exceptions';
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
  const baseUrl = `${API_HOST}/${appName}`;
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
const HTTP_SERVER_ERROR = 500;
const HTTP_NOT_FOUND = 404;
const HTTP_NOT_ALLOW = 400;
const HTTP_FORBIDDEN = 403;
const HTTP_METHOD_NOT_ALLOW = 405;
const HTTP_REQUEST_TOO_LARGE = 413;

// 添加响应拦截器
axios.interceptors.response.use(null, (error) => {
  // 对响应错误做点什么
  if (axios.isCancel(error)) {
    throw new UserCancelRequestError();
  }
  if (error.response) {
    if (!error.response.status) {
      throw new ApiError(error.response);
    }
    switch (error.status) {
      case HTTP_NOT_FOUND:
        throw new ApiError({
          errcode: error.response.code,
          message: '请求接口不存在',
        });
      case HTTP_NOT_ALLOW:
      case HTTP_FORBIDDEN:
        throw new ApiError({
          errcode: error.response.code,
          message: '请求的接口被禁用',
        });
      case HTTP_METHOD_NOT_ALLOW:
        throw new ApiError({
          errcode: error.response.code,
          message: '请求方式不被允许',
        });
      case HTTP_REQUEST_TOO_LARGE:
        throw new ApiError({
          errcode: error.response.code,
          message: '请求内容过大，无法正确处理',
        });
      case HTTP_SERVER_ERROR:
        throw new ApiError({
          errcode: error.response.code,
          message: '服务端开小差啦',
        });
      default:
        throw new ApiError({
          errcode: error.response.code,
          message: '未知的错误状态码',
        });
    }
  }
  throw error;
});

export const ServerApi = clientBase(null, '');

export default clientBase;
