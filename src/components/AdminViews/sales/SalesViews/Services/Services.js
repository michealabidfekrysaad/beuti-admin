/* eslint-disable react/prop-types */
import React, { createRef, useRef, useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { CallAPI } from 'utils/API/APIConfig';
import { SERVICES_CATEGORIES_SALES } from 'utils/API/EndPoints/ServicesEP';
import EmptyData from '../../EmptyData/EmptyData';
import ServicesHeaders from './ServicesHeaders';
import ServicesData from './ServicesData';

export default function Services({ setSalesData, salesData, isPOS }) {
  const { messages } = useIntl();
  const [serviceSearchFilter, setServicesSearchFilter] = useState('');
  const [tabs, setTabs] = useState(Array.from('Ref'.repeat(30)));
  const [value, setValue] = useState(0);
  const elementsRef = useRef(tabs.map(() => createRef()));
  const [listenScroll, setListenScroll] = useState(true);
  const [allServices, setAllServices] = useState([]);
  const [tempServiceForEmpData, setTempServiceForEmpData] = useState(false);

  const { isFetching: fetchServices } = CallAPI({
    name: ['getAllServicesWithCategories', serviceSearchFilter],
    url: SERVICES_CATEGORIES_SALES,
    refetchOnWindowFocus: false,
    baseURL: !isPOS
      ? `${process.env.REACT_APP_DOMAIN}1`
      : `${process.env.REACT_APP_POS_URL}/api/v1`,
    enabled: true,
    query: {
      search: serviceSearchFilter?.length ? serviceSearchFilter : null,
    },
    select: (data) => data.data.data.list,
    onSuccess: (res) => setAllServices(res),
  });

  const { refetch: callEmployees } = CallAPI({
    name: 'getEmpForServiceByOptionId',
    url: 'Service/GetServiceEmployees',
    baseURL: !isPOS
      ? `${process.env.REACT_APP_DOMAIN}1`
      : `${process.env.REACT_APP_POS_URL}/api/v1`,
    refetchOnWindowFocus: false,
    query: {
      serviceOptionId: tempServiceForEmpData?.serviceOptionId,
    },
    select: (data) => data?.data?.data,
    onSuccess: (res) => {
      if (res?.length && tempServiceForEmpData?.serviceOptionId) {
        setSalesData({
          ...salesData,
          itemsSelected: [
            ...salesData?.itemsSelected,
            {
              ...tempServiceForEmpData,
              employeeName: res[0]?.employeeName,
              employeeId: res[0]?.employeeId,
              employeesOnService: res,
              price: res[0]?.price,
            },
          ],
        });
        setTempServiceForEmpData(false);
      }
    },
  });

  useEffect(() => {
    if (tempServiceForEmpData?.serviceOptionId) {
      callEmployees();
    }
  }, [tempServiceForEmpData]);

  return (
    <>
      <ServicesHeaders
        setServicesSearchFilter={setServicesSearchFilter}
        serviceSearchFilter={serviceSearchFilter}
      />
      <ServicesData
        setListenScroll={setListenScroll}
        listenScroll={listenScroll}
        elementsRef={elementsRef}
        setValue={setValue}
        value={value}
        servicesTabs={allServices?.map((d) => d?.categoryName)}
        allServices={allServices}
        fetchServices={fetchServices}
        setSalesData={setSalesData}
        salesData={salesData}
        serviceSearchFilter={serviceSearchFilter}
        setTempServiceForEmpData={setTempServiceForEmpData}
      />
      {!allServices?.length && !serviceSearchFilter && !fetchServices && (
        <EmptyData
          image="/services-empty.svg"
          title={messages['sales.services.no.services.title']}
          subTitle={messages['sales.services.no.services.sub.title']}
        />
      )}
    </>
  );
}
