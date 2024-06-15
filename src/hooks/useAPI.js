import React from 'react';
import { LocaleContext } from 'providers/LanguageProvider';
import { UserContext } from 'providers/UserProvider';
import { redirectUser } from 'functions/redirectUser';
import { BranchesContext } from 'providers/BranchesSelections';
import { DOMAIN } from 'constants/Routes';
import { useLocation } from 'react-router-dom';

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
 * @name useAPI
 * @type custom hook
 * @param {string} method
 * @param {string} url
 * @param {object} payload
 * @returns {object} {response , isLoading, error, setRecall}
 */
const useAPI = (method, url, payload, deps) => {
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
  const [prevDeps, setPrevDeps] = React.useState(null);
  const locationForRoute = useLocation();

  const { locale } = React.useContext(LocaleContext);
  const { setUser, User } = React.useContext(UserContext);
  const {
    setBranches,
    setBranchesDDChanges,
    branchesDDChanges,
    singleBranchesArr,
  } = React.useContext(BranchesContext);

  const AcceptLanguage = locale === 'ar' ? 'ar-SA' : 'en-US';

  React.useEffect(() => {
    if (recall || (deps && deps[0] && JSON.stringify(deps) !== prevDeps)) {
      setRecall(null);

      if (
        singleBranchesArr.indexOf(locationForRoute.pathname) === -1 ||
        (singleBranchesArr.indexOf(locationForRoute.pathname) !== -1 &&
          JSON.parse(localStorage.getItem('selectedBranches'))?.length === 1)
      ) {
        fetchData();
      }
      setPrevDeps(JSON.stringify(deps));
    }
  }, [recall, deps]);

  React.useEffect(() => {
    if (branchesDDChanges) {
      setBranchesDDChanges(false);
      if (singleBranchesArr.indexOf(locationForRoute.pathname) === -1) {
        fetchData('branchesChangesHint');
      }
      if (
        singleBranchesArr.indexOf(locationForRoute.pathname) !== -1 &&
        JSON.parse(localStorage.getItem('selectedBranches'))?.length === 1
      ) {
        fetchData('branchesChangesHint');
      }
    }
  }, [branchesDDChanges]);

  /**
   * @function fetchData
   * @async
   * @description makes XMLHttpRequest API request depending on method and url from useAPI custom hook.
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
      xhr.setRequestHeader(
        'Branch',
        JSON.parse(localStorage.getItem('selectedBranches')),
      );
      /* -------------------------------------------------------------------------- */
      /*      We Edit The Header Here because it case issue in add polygon API      */
      /* -------------------------------------------------------------------------- */
      if (url === 'City/AddCityPolygon') {
        xhr.setRequestHeader('Accept-Language', 'en-US');
      } else {
        xhr.setRequestHeader('Accept-Language', AcceptLanguage);
        if (localStorage.getItem('selectedBranches'))
          JSON.parse(localStorage.getItem('selectedBranches')).forEach((element) => {
            xhr.setRequestHeader('Branch', element);
          });
      }
      if (User.access_token) {
        xhr.setRequestHeader('Authorization', `Bearer ${User.access_token}`);
      }
      xhr.onload = () => {
        let res = null;
        try {
          res = JSON?.parse(xhr?.responseText);
        } catch (err) {
          setError(err);
        }
        setResponse(res);
        setIsLoading(false);
        const logout = () => {
          setUser({ access_token: null, userData: null });
          localStorage.clear();
          redirectUser(locationForRoute, '/login');
          setBranches([]);
        };
        if (+xhr?.status === 401 && User && User?.userData?.isSuperAdmin) {
          logout();
        }
        if (
          +xhr?.status === 401 &&
          User &&
          !User?.userData?.isSuperAdmin &&
          localStorage?.getItem('selectedBranches')
        ) {
          logout();
        }
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

export default useAPI;
