/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import ReportedReviewsListTable from 'components/SuperAdminViews/ReportedReviews/ReportedReviewsList';
import useOdata, { get } from 'hooks/useOdata';

export function ReportedReviewsList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [dataList, setDataList] = useState(null);
  const [totalPages, setTotalPages] = useState('');
  const reportedReviews = `SPReviewReportOData/?$skip=${(currentPage - 1) * 10}`;
  const { response: reportedReviewList, isLoading, setRecall: getReviews } = useOdata(
    get,
    reportedReviews,
  );
  const { response: count, setRecall: recallCount } = useOdata(
    get,
    'SPReviewReportOData/$count',
  );
  useEffect(() => {
    getReviews(true);
  }, [currentPage]);

  useEffect(() => {
    getReviews(true);
    recallCount(true);
  }, []);
  useEffect(() => {
    if (count?.data?.list) {
      // count of all data
      setTotalPages(count?.data?.list);
    }
  }, [count]);
  useEffect(() => {
    if (reportedReviewList?.data?.list) {
      setDataList(reportedReviewList?.data?.list);
    }
  }, [reportedReviewList]);

  return (
    <>
      <ReportedReviewsListTable
        allData={dataList}
        listLoading={isLoading}
        getReviews={getReviews}
        recallCount={recallCount}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />
    </>
  );
}
