/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import CategoriesListTable from 'components/SuperAdminViews/CategoriesList/CategoriesList';
import { sortDataList } from 'functions/sortingData';
import { toast } from 'react-toastify';
import { CATEGORY_MANAGE_SYSTEM } from 'utils/API/EndPoints/ServicesEP';
import { CallAPI } from 'utils/API/APIConfig';

export function CategoriesList() {
  const [dataCount, setDataCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(0);
  const [pagesMax, setPagesMax] = useState(10);
  const [chunks, setChunks] = useState([]);
  const [sortBy, setSortBy] = useState('nameAr');
  const [sortEnglishBy, setSorEnglishtBy] = useState('nameEn');
  const [direction, setDirection] = useState(null);
  const [directionEn, setDirectionEn] = useState(null);
  const [query, setQuery] = useState('');
  const [categroyList, setCategroyList] = useState([]);
  const [statusFilterationValue, setStatusFilterationValue] = useState(1);

  const { data: catRes, isLoading, refetch } = CallAPI({
    name: 'getSystemCategoryToManage',
    url: CATEGORY_MANAGE_SYSTEM,
    refetchOnWindowFocus: false,
    enabled: true,
    query: {
      search: query,
    },
    select: (res) => res?.data?.data?.list,
    onError: (err) => toast.error(err?.response?.data?.error?.message),
  });

  useEffect(() => {
    if (query) {
      refetch(true);
      setPageNumber(0);
    } else {
      refetch(true);
      setPageNumber(0);
    }
  }, [query]);
  const applyFilteration = (arrayList) => {
    if (+statusFilterationValue === 1) return arrayList;

    if (+statusFilterationValue === 2)
      return arrayList.filter((category) => category.isEnabled);

    if (+statusFilterationValue === 3)
      return arrayList.filter((category) => !category.isEnabled);
    return null;
  };
  useEffect(() => {
    if (catRes) {
      let sortedDataList = '';
      const dataList = applyFilteration(catRes);
      if (direction) {
        sortedDataList = sortDataList(dataList, sortBy, direction);
      } else if (directionEn) {
        sortedDataList = sortDataList(dataList, sortEnglishBy, directionEn);
      } else {
        sortedDataList = sortDataList(dataList, null, directionEn);
      }
      const createdChunks = [];
      for (let i = 0; i < sortedDataList.length; i += pagesMax) {
        if (sortedDataList.length > pagesMax) {
          const temparray = sortedDataList.slice(i, i + pagesMax);
          createdChunks.push(temparray);
          setPageNumber(0);
        } else {
          createdChunks.push(sortedDataList.slice(i, i + sortedDataList.length));
          setPageNumber(0);
        }
      }
      setChunks(createdChunks);
      setDataCount(Math.ceil(sortedDataList.length / pagesMax));
    }
  }, [catRes, pagesMax, sortBy, direction, directionEn, statusFilterationValue]);

  return (
    <>
      <CategoriesListTable
        allData={chunks[pageNumber]}
        listLoading={isLoading}
        getCategories={refetch}
        countDataResponse={dataCount}
        pageNumber={pageNumber}
        setPageNumber={setPageNumber}
        setPagesMax={setPagesMax}
        pagesMax={pagesMax}
        setDirection={setDirection}
        direction={direction}
        setSortBy={setSortBy}
        sortBy={sortBy}
        isLoading={isLoading}
        toast={toast}
        setQuery={setQuery}
        directionEn={directionEn}
        setDirectionEn={setDirectionEn}
        categroyList={categroyList}
        setCategroyList={setCategroyList}
        setStatusFilterationValue={setStatusFilterationValue}
        statusFilterationValue={statusFilterationValue}
      />
    </>
  );
}
