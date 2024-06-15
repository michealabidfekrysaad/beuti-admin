/* eslint-disable dot-notation */
/* eslint-disable react-hooks/rules-of-hooks */

import React, { useContext } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { LocaleContext } from '../../providers/LanguageProvider';
import { UserContext } from '../../providers/UserProvider';

const axiosInstance = axios.create({
  baseURL: `${process.env.REACT_APP_DOMAIN}1`,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
});

const UpdateInstanceValues = (baseURL) => {
  const { locale: language } = useContext(LocaleContext);
  const { User } = useContext(UserContext);
  axiosInstance.defaults.headers.common['Accept-Language'] =
    language === 'ar' ? 'ar-SA' : 'en-US';
  if (User.access_token) {
    axiosInstance.defaults.headers.common[
      'Authorization'
    ] = `Bearer ${User.access_token}`;
  }
  if (baseURL) {
    axiosInstance.defaults.baseURL = baseURL;
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

export const CallAPICustom = ({
  name,
  method = 'get',
  body,
  query,
  url,
  headers,
  cacheTime,
  enabled = false,
  baseURL,
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
  refetchOnWindowFocus = false,
  retry = false,
  retryOnMount,
  retryDelay,
  select,
  staleTime,
  structuralSharing,
  suspense,
  useErrorBoundary,
}) => {
  UpdateInstanceValues(baseURL);
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
