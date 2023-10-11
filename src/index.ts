import { format } from 'date-fns';
import {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";

function getTime (date: Date)  {
    return format(date, "pp")
}

function responseLogger(response: AxiosResponse) {
  const {
    config: { url, method, params },
    statusText,
    status,
    data,
    headers,
  } = response;
  const date = getTime(new Date());

  const log = `${date}[Response] => ${method} / ${url} (${status} ${statusText}):\n[Params]: ${params}\n[Headers]: ${headers}\n[Data]: ${JSON.stringify(
    data
  )}`;

  return console.log(log);
}

function requestLogger(request: AxiosRequestConfig) {
  const { url, params, method, data, headers } = request;
  const date = getTime(new Date());

  const log = `${date}[Request] => ${method} / ${url}:\n[Params]: ${params}\n[Headers]: ${headers}\n[Data]: ${JSON.stringify(
    data
  )}`;

  return console.log(log);
}

function errorLoggerWithoutPromise(error: AxiosError) {
  const date = getTime(new Date());

  if (!error.config) {
    return error;
  }

  const {
    config: { method, params, url },
    response,
  } = error;

  let status, statusText, data, headers;
  if (response) {
    status = response.status;
    statusText = response.statusText;
    data = response.data;
    headers = response.headers;
  }

  const log = `${date}[Error] => ${method} / ${url} (${status} ${statusText}):\n[Params]: ${params}\n[Headers]: ${headers}\n[Data]: ${JSON.stringify(
    data
  )}`;

  return console.log(log);
}

function errorLogger(error: AxiosError) {
  return Promise.reject<AxiosError>(errorLoggerWithoutPromise(error));
}

function AxiosLogger(axios: AxiosInstance) {
  axios.interceptors.request.use(
    (request) => {
      requestLogger(request);
      return request;
    },
    (error) => {
      errorLogger(error);
      return error;
    }
  );
  axios.interceptors.response.use(
    (response) => {
      responseLogger(response);
      return response;
    },
    (error) => {
      errorLogger(error);
      return error;
    }
  );
}

export { AxiosLogger };