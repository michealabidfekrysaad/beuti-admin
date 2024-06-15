import React from 'react';
import { LocaleContext } from 'providers/LanguageProvider';
import { UserContext } from 'providers/UserProvider';
import { BranchesContext } from 'providers/BranchesSelections';
import { ODOMAIN } from 'constants/Routes';
import { useLocation } from 'react-router-dom';
import { redirectUser } from 'functions/redirectUser';

export const get = 'GET';
export const post = 'POST';

/**
 *
 * @name useOdata
 * @type custom hook
 * @param {string} method
 * @param {string} url
 * @param {object} payload
 * @returns {object} {response , isLoading, error, setRecall}
 */
const useOdata = (method, url) => {
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

  const locationForRoute = useLocation();
  const { locale } = React.useContext(LocaleContext);
  const { setUser, User } = React.useContext(UserContext);
  const {
    setBranchesDDChanges,
    setBranches,
    branchesDDChanges,
    singleBranchesArr,
  } = React.useContext(BranchesContext);

  const AcceptLanguage = locale === 'ar' ? 'ar-SA' : 'en-US';

  React.useEffect(() => {
    if (recall) {
      setRecall(null);
      if (
        singleBranchesArr.indexOf(locationForRoute.pathname) === -1 ||
        (singleBranchesArr.indexOf(locationForRoute.pathname) !== -1 &&
          JSON.parse(localStorage.getItem('selectedBranches'))?.length === 1)
      ) {
        fetchData();
      }
      setTimeout(() => {
        setRecall(null);
      }, 100);
    }
  }, [recall]);

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
    setRecall(null);
    try {
      const xhr = new XMLHttpRequest();
      if (branchesChangesHint && method === 'GET') {
        xhr.open(method, `${ODOMAIN}${url}`);
      } else if (!branchesChangesHint) {
        xhr.open(method, `${ODOMAIN}${url}`);
      }
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.setRequestHeader(
        'Branch',
        JSON.parse(localStorage.getItem('selectedBranches')),
      );
      xhr.setRequestHeader('Accept-Language', AcceptLanguage);
      if (localStorage.getItem('selectedBranches'))
        JSON?.parse(localStorage.getItem('selectedBranches')).forEach((element) => {
          xhr.setRequestHeader('Branch', element);
        });
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
      xhr.send({});
      // xhr.send();
    } catch (err) {
      setError(err);
      setIsLoading(false);
    }
  }

  return { response, error, isLoading, setRecall };
};

export default useOdata;
