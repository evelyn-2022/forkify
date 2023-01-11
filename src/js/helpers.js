import axios from 'axios';
import { TIMEOUT_SEC } from './config';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, data = undefined, method = undefined) {
  try {
    const resp = !data
      ? await Promise.race([axios.get(url), timeout(TIMEOUT_SEC)])
      : method === 'post'
      ? await Promise.race([axios.post(url, data), timeout(TIMEOUT_SEC)])
      : await Promise.race([axios.delete(url), timeout(TIMEOUT_SEC)]);

    if (resp.request.status > 300) throw new Error(resp.request.statusText);

    return resp;
  } catch (err) {
    throw err;
  }
};
