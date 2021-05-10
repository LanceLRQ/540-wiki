import { parse } from 'query-string';
import { compile } from 'path-to-regexp';

export const  getQuery = (location) => {
  const { search } = location;
  return search[0] === '?' ? parse(search.substring(1, search.length)) : parse(search);
};

export const getQueryByKey = (location, key) => {
  const query = getQuery(location);
  return query ? query[key] : '';
};

export const getQueryFromUrlByKey = (url, key) => {
  const search = url.split('?');
  const query = search.length > 1 ? parse(search[1]) : parse(search[0]);
  return query ? query[key] : '';
};

export const openLink = (targetURL, newTab = true, download = '') => {
  let a = document.createElement('a');
  a.setAttribute('href', targetURL);
  download && a.setAttribute('download', download);
  if (newTab) {
    a.target = '_blank';
  }
  // a.click();   // firefox无法正确打开，下边是兼容代码
  const evt = document.createEvent('MouseEvents');
  evt.initEvent('click', true, true);
  a.dispatchEvent(evt);
  a = null; // free
};

export const formatQueryUrl = (url, query) => {
  if (query && Object.keys(query).length > 0) {
    return `${url}?${Object.keys(query)
      .map((key) => `${key}=${encodeURIComponent(query[key])}`)
      .join('&')}`;
  }
  return url;
};

export const buildPath = (route, newParams = {}, matchParams = {},  query = {}, hash = '') => {
  const toPath = compile(route);
  const fullParams = {
    ...matchParams,
    ...newParams,
  };
  return `${formatQueryUrl(toPath(fullParams), query)}${(hash) ? '#' : ''}${hash}`;
};

export const gotoPath = (props, url) => () => {
  const { history } = props;
  history.push(url);
};

export const getCurrentURL = (withQuery = true) => {
  const {
    href,
    protocol,
    hostname,
    port,
    search,
  } = window.location;
  let { origin } = window.location;
  if (!origin) {
    origin = `${protocol}//${hostname}${port ? `:${port}` : ''}`;
  }
  if (!withQuery) {
    return href.replace(origin, '').replace(search, '');
  }
  return href.replace(origin, '');
};

export const buildApiPath = (url, params = {}, appName = '') => {
  const { API_HOST = '' } = process.env;
  // 如果不设置baseURL，则自动mapping到默认的接口
  const baseURL = `${API_HOST}/${appName}`;
  const pattern = compile(url);
  return `${baseURL}${pattern(params)}`;
};

export const getHostName = () => {
  return window.location.hostname;
};

export const getOrigin = () => {
  const {
    protocol,
    hostname,
    port,
  } = window.location;
  let { origin } = window.location;
  if (!origin) {
    origin = `${protocol}//${hostname}${port ? `:${port}` : ''}`;
  }
  return origin;
};
