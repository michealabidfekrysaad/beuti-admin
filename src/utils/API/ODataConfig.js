/* eslint-disable dot-notation */
/* eslint-disable react-hooks/rules-of-hooks */

import { useContext, useEffect } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { BranchesContext } from 'providers/BranchesSelections';
import { useLocation } from 'react-router-dom';
import { redirectUser } from 'functions/redirectUser';
import { LocaleContext } from '../../providers/LanguageProvider';
import { UserContext } from '../../providers/UserProvider';

const axiosInstance = axios.create({
  baseURL: `${process.env.REACT_APP_ODOMAIN}`,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
});

const UpdateInstanceValues = () => {
  const { locale: language } = useContext(LocaleContext);
  const locationForRoute = useLocation();
  const { User, setUser } = useContext(UserContext);
  const { setBranches } = useContext(BranchesContext);
  useEffect(() => {
    const axiosRef = axiosInstance.interceptors.request.use((config) => config);
    return () => axiosInstance.interceptors.request.eject(axiosRef);
  }, []);
  useEffect(() => {
    const axiosRef = axiosInstance.interceptors.response.use(
      (res) => res,
      (err) => {
        if (+err?.response?.status === 401) {
          setUser({ access_token: null, userData: null });
          localStorage.clear();
          redirectUser(locationForRoute, '/login');
          setBranches([]);
        }
        return Promise.reject(err);
      },
    );
    return () => axiosInstance.interceptors.response.eject(axiosRef);
  }, []);
  axiosInstance.defaults.headers.common['Accept-Language'] =
    language === 'ar' ? 'ar-SA' : 'en-US';
  if (User.access_token) {
    axiosInstance.defaults.headers.common[
      'Authorization'
    ] = `Bearer ${User.access_token}`;
  }
};

/**
 * @name name @Required @description  Should be Unique For each Api Call
 */
/**
 * @name method  @description The method For Api Call Should be one of ('post' , 'get' , 'put','delete')
 */
/**
 * @name query  @description set Params for request
 */
/**
 * @name url @Required @description the Api EndPoint
 */
/**
 * @name baseurl  @description to override the baseurl
 */
/**
 * /**
 * @name odata  @description set baseurl to data
 */
/**
 * from @name cacheTime To @name useErrorBoundary   @check https://react-query.tanstack.com/reference/useQuery
 */

export const CallAPIOdata = ({
  name,
  method = 'get',
  body,
  query,
  url,
  headers,
  cacheTime,
  enabled = false,
  initialData,
  initialDataUpdatedAt,
  isDataEqual,
  keepPreviousData,
  meta,
  notifyOnChangeProps,
  notifyOnChangePropsExclusions,
  onError,
  onSettled,
  onSuccess,
  queryKeyHashFn,
  refetchInterval,
  refetchIntervalInBackground,
  refetchOnMount,
  refetchOnReconnect,
  refetchOnWindowFocus,
  retry = false,
  retryOnMount,
  retryDelay,
  select,
  staleTime,
  structuralSharing,
  suspense,
  useErrorBoundary,
}) => {
  UpdateInstanceValues();
  return useQuery(
    name,
    () =>
      axiosInstance({
        url,
        data: body,
        method,
        headers,
        params: query,
      }),
    {
      cacheTime,
      enabled,
      initialData,
      initialDataUpdatedAt,
      isDataEqual,
      keepPreviousData,
      meta,
      notifyOnChangeProps,
      notifyOnChangePropsExclusions,
      onError,
      onSettled,
      onSuccess,
      queryKeyHashFn,
      refetchInterval,
      refetchIntervalInBackground,
      refetchOnMount,
      refetchOnReconnect,
      refetchOnWindowFocus,
      retry,
      retryOnMount,
      retryDelay,
      select,
      staleTime,
      structuralSharing,
      suspense,
      useErrorBoundary,
    },
  );
};
