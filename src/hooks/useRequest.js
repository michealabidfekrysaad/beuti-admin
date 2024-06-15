import React from 'react';
import { LocaleContext } from 'providers/LanguageProvider';
import { BookingContext } from 'providers/BookingProvider';
import { DOMAIN } from 'constants/Routes';

export const get = 'GET';
export const post = 'POST';
export const put = 'PUT';
export const deleting = 'DELETE';

/**
 * @name getToken
 * @returns {Promise} Response with Token
 * @export
 */
export async function getToken() {
  const authPath = 'Auth/getAccessToken';
  const token = await fetch(`${DOMAIN}${authPath}`, { method: get });
  const json = await token.json();
  return json;
}

/**
 *
 * @name useRequest
 * @type custom hook
 * @param {string} method
 * @param {string} url
 * @param {object} payload
 * @returns {object} {response , isLoading, error, setRecall}
 */
const useRequest = (method, url, payload) => {
  /**
   * @typedef {JSON} response — API response
   */
  /**
   * @typedef {Function} setResponse — sets response onload
   */
  /**
   * @type {[response, setResponse]} response
   */
  const [response, setResponse] = React.useState(null);
  /**
   * @typedef {Error} error — Response Error if found
   */
  /**
   * @typedef {Function} setError — sets response error on catch.
   */
  /**
   * @type {[setError, setError]} response error.
   */
  const [error, setError] = React.useState(null);
  /**
   * @typedef {Boolean} isLoading — Request pending state.
   */
  /**
   * @typedef {Function} setIsLoading — Sets loading state between sending request and getting results.
   */
  /**
   * @type {[isLoading, setIsLoading]} Loading state
   */
  const [isLoading, setIsLoading] = React.useState(false);
  /**
   * @typedef {String} recall — Recall const that is observed by the useEffect function to recall API.
   */
  /**
   * @typedef {Function} setRecall — Sets recall when needed.
   * @exports
   */
  /**
   * @type {[recall, setRecall]} response errpr
   */
  const [recall, setRecall] = React.useState(null);

  const { locale } = React.useContext(LocaleContext);
  const { booking } = React.useContext(BookingContext);
  const AcceptLanguage = locale === 'ar' ? 'ar-SA' : 'en-US';

  React.useEffect(() => {
    if (recall) {
      setRecall(null);
      fetchData();
    }
  }, [recall]);

  /**
   * @function fetchData
   * @async
   * @description makes XMLHttpRequest API request depending on method and url from useRequest custom hook.
   */
  async function fetchData(branchesChangesHint) {
    setIsLoading(true);
    try {
      const xhr = new XMLHttpRequest();
      if (branchesChangesHint && method === 'GET') {
        xhr.open(method, `${DOMAIN}${url}`);
      } else if (!branchesChangesHint) {
        xhr.open(method, `${DOMAIN}${url}`);
      }
      xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
      xhr.setRequestHeader('Accept-Language', AcceptLanguage);
      if (booking.token) {
        xhr.setRequestHeader('Authorization', `Bearer ${booking.token}`);
      }
      xhr.onload = () => {
        const res = JSON.parse(xhr.responseText);
        setResponse(res);
        setIsLoading(false);
        if (xhr.status === 400) {
          setIsLoading(false);
        }
      };
      xhr.send(JSON.stringify(payload));
    } catch (err) {
      setError(err);
      setIsLoading(false);
    }
  }

  return { response, error, isLoading, setRecall };
};

export default useRequest;
