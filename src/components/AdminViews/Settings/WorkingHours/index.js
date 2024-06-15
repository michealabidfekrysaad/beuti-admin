/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import UpdateWorkingHours from './UpdateWorkingHours';
import ViewWorkingHours from './ViewWorkingHours';
import WorkingHoursEdit from './WorkingHoursEdit';

function WorkingHours({ callApi }) {
  const { messages } = useIntl();
  const [view, setView] = useState('main');
  const [selectedDay, setSelectedDay] = useState('');

  const scope = 'admin.settings.workingTime';

  return (
    <>
      {/* <div className="alignBtn">
        {view === 'main' && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setView('add')}
          >
            {messages[`${scope}.viewEditTime`]}
          </button>
        )}
        {view === 'add' && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setView('main')}
          >
            {messages[`${scope}.viewEditTime`]}
          </button>
        )}
      </div> */}
      {view === 'add' && <WorkingHoursEdit callApi={callApi} setIsEdit={setView} />}
      {view === 'main' && (
        <ViewWorkingHours
          setSelectedDay={setSelectedDay}
          callApi={callApi}
          setView={setView}
        />
      )}
      {view === 'edit' && (
        <UpdateWorkingHours
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          setView={setView}
        />
      )}
    </>
  );
}

export default WorkingHours;
