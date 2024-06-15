/* eslint-disable consistent-return */
/* eslint-disable no-else-return */
/* eslint-disable indent */
/* eslint-disable no-nested-ternary */
import React from 'react';
import Rating from '@material-ui/lab/Rating';
import { List } from 'semantic-ui-react';
import { formatTime } from 'functions/timeFunctions';
import { statusNumbers, statusColorForWord } from './statusColor';

export function formatData(
  dataPiece,
  dataRow,
  lang,
  actions,
  messages,
  isBooking,
  isOffer,
) {
  const dateDisplayOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  if (dataRow.data === 'rate') {
    return (
      <>
        <Rating
          className="mt-1 ml-1 mr-1"
          name="read-only"
          value={dataPiece?.rate}
          readOnly
        />
      </>
    );
  }
  if (dataRow.data === 'id') {
    return <>{dataPiece[dataRow.data]}</>;
  }
  if (dataRow.data === 'purchaserName') {
    return <>{dataPiece[dataRow.data]}</>;
  }
  if (dataRow.data === 'purchaserMobile') {
    return <>{dataPiece[dataRow.data]}</>;
  }
  if (dataRow.data === 'fortID') {
    return dataPiece[dataRow.data] ? <>{dataPiece[dataRow.data]}</> : <> - </>;
  }
  if (dataRow.data === 'purchaseDate') {
    return (
      <>
        {formatDate(dataPiece[dataRow.data].split('T')[0], lang)}
        <br />
        {dataPiece[dataRow.data].split('T')[1].split('.')[0]}
      </>
    );
  }
  if (dataRow.data === 'amount') {
    return <>{dataPiece[dataRow.data]} SAR</>;
  }
  if (dataRow.data === 'paymentMethod') {
    return <>{dataPiece[dataRow.data].name}</>;
  }
  if (dataRow.data === 'merchantReference') {
    return dataPiece[dataRow.data] ? <>{dataPiece[dataRow.data]}</> : <> -</>;
  }
  if (dataRow.data === 'balanceBefore') {
    return <>{dataPiece[dataRow.data]}</>;
  }
  if (dataRow.data === 'balanceAfter') {
    return <>{dataPiece[dataRow.data]}</>;
  }

  if (dataRow.data === 'bookingStatus') {
    const color = statusColorForWord(statusNumbers(dataPiece.bookingStatus, lang));
    return <span style={{ color }}>{dataPiece.bookingStatus}</span>;
  }

  if (dataRow.data === 'bookingSourceApp') {
    const num = dataPiece.bookingSourceApp;
    if (num === 1) {
      return lang === 'ar' ? 'العميل' : 'Customer';
    } else if (num === 2) {
      return lang === 'ar' ? 'مقدم الخدمة' : 'Service Provider';
    } else if (num === 3) {
      return lang === 'ar' ? 'نقطة البيع' : 'POS';
    } else if (num === 4) {
      return lang === 'ar' ? 'الحجز أونلاين' : 'Booking Wizard';
    } else if (num === 5) {
      return lang === 'ar' ? 'لوحة التحكم' : 'Admin Panel';
    }
  }

  if (dataRow.data === 'percentage' && isOffer) {
    return <>{dataPiece[dataRow.data]}%</>;
  }

  if (dataRow.data === 'actions') {
    return actions.map((action) =>
      action.element(dataPiece.id, dataPiece || dataPiece.Id, dataPiece.IsEnable),
    );
  }

  if (dataRow.data === 'CustomerNumber' && !dataPiece.IsCustomer) {
    if (
      dataPiece.AnonymousUser &&
      dataPiece.AnonymousUser.Phone &&
      dataPiece.AnonymousUser.Phone.length > 9
    ) {
      return dataPiece.AnonymousUser.Phone;
    }
    return '-';
  }

  if (dataRow.data === 'serviceTimeSlot') {
    return (
      <>
        {formatTime(dataPiece[dataRow.data].from, lang)} {messages['common.to']}{' '}
        {formatTime(dataPiece[dataRow.data].to, lang)}
      </>
    );
  }

  if (dataRow.data === 'bookingTime' || dataRow.data.toLowerCase().includes('time')) {
    return formatTime(dataPiece[dataRow.data], lang);
  }

  if ((dataRow.data === 'durationFrom' || dataRow.data === 'durationTo') && isOffer) {
    return <>{formatDate(dataPiece[dataRow.data].split('T')[0], lang)}</>;
  }

  if (dataRow.data === 'is_queue' || dataRow.data === 'isQueue') {
    return (
      <>
        {dataPiece[dataRow.data]
          ? messages['serviceType.queue']
          : messages['serviceType.appointment']}
      </>
    );
  }

  if (dataRow.data.toLowerCase().includes('price')) {
    return <>{dataPiece[dataRow.data] + messages['common.currency']}</>;
  }

  if (dataRow.data === 'employeeOffDays') {
    if (dataPiece.employeeOffDays) {
      return (
        <List divided>
          {dataPiece.employeeOffDays.map((day) => (
            <List.Item>
              {messages['common.from']} {formatDate(day.startDate, lang)}{' '}
              {messages['common.atHour']} {formatTime(day.startTime, lang)} <br />
              {messages['common.to']} {formatDate(day.endDate, lang)}{' '}
              {messages['common.atHour']} {formatTime(day.endTime, lang)}
            </List.Item>
          ))}
        </List>
      );
    }
    return '-';
  }

  if (dataRow.data === 'registerationMethod') {
    return (
      <>
        <img
          width="30"
          height="30"
          src={`https://image.flaticon.com/icons/png/${
            dataPiece.registerationMethod === 'Apple'
              ? '512/731/731985.png'
              : dataPiece.registerationMethod === 'Google'
              ? '512/2991/2991147.png'
              : '512/561/561127.png'
          }`}
          alt="free icon"
        />
      </>
    );
  }

  if (dataRow.data.toLowerCase().includes('date')) {
    if (dataPiece[dataRow.data]) {
      return new Date(dataPiece[dataRow.data]).toLocaleDateString(
        lang === 'ar' ? 'ar-EG' : 'en-US',
        dateDisplayOptions,
      );
    }
    return '-';
  }
  return dataPiece[dataRow.data];
}

export function formatDate(date, lang) {
  const dateDisplayOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return new Date(date).toLocaleDateString(
    lang === 'ar' ? 'ar-EG' : 'en-US',
    dateDisplayOptions,
  );
}
