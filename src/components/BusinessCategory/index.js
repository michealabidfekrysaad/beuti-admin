import React, { useState, useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import useAPI, { get } from 'hooks/useAPI';
import { Routes } from 'constants/Routes';
import { Link } from 'react-router-dom';
import { BusinessCategoryList } from './BusinessCategoryList';

const BusinessCategory = () => {
  const { messages } = useIntl();
  const [direction, setDirection] = useState('asc');
  const [directionEN, setDirectionEN] = useState('asc-EN');
  const [changeCloumn, setChangeColumn] = useState('namEN');
  const [sortBy, setSortBy] = useState('nameEN');
  const [sortedDataList, setSortedDataList] = useState([]);

  const businessCategory = 'BusinessCategory/GetBussinessCategories';
  const { response: CategoriesRes, isLoading, setRecall: getCategories } = useAPI(
    get,
    businessCategory,
  );

  useEffect(() => {
    getCategories(true);
  }, []);

  useEffect(() => {
    if (CategoriesRes?.data?.list) {
      setSortedDataList(CategoriesRes.data.list);
    }
  }, [CategoriesRes]);

  useEffect(() => {
    if (CategoriesRes?.data?.list && changeCloumn === 'nameAR') {
      setSortedDataList(
        CategoriesRes?.data?.list.sort((a, b) => {
          const nameA =
            direction === 'asc' ? a[sortBy].toUpperCase() : b[sortBy].toUpperCase();
          const nameB =
            direction === 'asc' ? b[sortBy].toUpperCase() : a[sortBy].toUpperCase();
          if (nameA < nameB) return -1;
          if (nameA > nameB) return 1;
          return 0;
        }),
      );
    }
  }, [direction]);

  useEffect(() => {
    if (CategoriesRes?.data?.list && changeCloumn === 'nameEN') {
      setSortedDataList(
        CategoriesRes?.data?.list.sort((a, b) => {
          const nameA =
            directionEN === 'asc-EN' ? a[sortBy].toUpperCase() : b[sortBy].toUpperCase();
          const nameB =
            directionEN === 'asc-EN' ? b[sortBy].toUpperCase() : a[sortBy].toUpperCase();
          if (nameA < nameB) return -1;
          if (nameA > nameB) return 1;
          return 0;
        }),
      );
    }
  }, [directionEN]);

  return (
    <Card className="mb-5">
      <Card.Header>
        <div className="title">{messages['sidebar.sadmin.businessCategory']}</div>
        <Link to={Routes.businessCategoryAdd}>
          <Button>{messages['sadmin.business.addNewBusinessCategory']}</Button>
        </Link>
      </Card.Header>
      <Card.Body>
        <BusinessCategoryList
          allData={sortedDataList}
          isLoading={isLoading}
          setDirection={setDirection}
          direction={direction}
          setDirectionEN={setDirectionEN}
          directionEN={directionEN}
          setSortBy={setSortBy}
          setChangeColumn={setChangeColumn}
          getCategories={getCategories}
        />
      </Card.Body>
    </Card>
  );
};

export default BusinessCategory;
