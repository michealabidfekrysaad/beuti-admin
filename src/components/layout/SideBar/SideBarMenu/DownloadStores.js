import React from 'react';
import { useIntl } from 'react-intl';

import DownloadStore from './DownloadStore';
import { toAbsoluteUrl } from '../../../../functions/toAbsoluteUrl';

const DownloadStores = () => {
  const { messages } = useIntl();
  return (
    <section className="downloadstores">
      {/* <header className="downloadstores-header">تطبيق مزود الخدمة</header> */}
      <main className="downloadstores-body">
        <DownloadStore
          name={messages['beuti.applestore']}
          image={toAbsoluteUrl('/apple.png')}
          linkDownload="https://apps.apple.com/sa/app/beuti-business-%D8%A8%D9%8A%D9%88%D8%AA%D9%8A-%D8%A3%D8%B9%D9%85%D8%A7%D9%84/id1472176952"
        />
        <DownloadStore
          name={messages['beuti.googlePlay']}
          image={toAbsoluteUrl('/googleplay.png')}
          linkDownload="https://play.google.com/store/apps/details?id=co.beuti.serviceprovider"
        />
      </main>
    </section>
  );
};

export default DownloadStores;
