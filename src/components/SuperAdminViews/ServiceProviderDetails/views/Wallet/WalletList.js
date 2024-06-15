import React from 'react';
import { Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import PaginationWithSemantic from 'components/shared/PaginationWithSemantic';
import { useIntl } from 'react-intl';
import moment from 'moment';

const WalletBlanceList = ({ historylist, pageNumber, setPageNumber, totalCount }) => {
  moment.locale('en');
  const { messages } = useIntl();
  const tableHeaders = [
    { id: 2, name: messages['sAdmin.spDetails.wallet.table.transactiontype'] },
    { id: 5, name: messages['sAdmin.spDetails.wallet.table.transactiondetails'] },
    { id: 3, name: messages['sAdmin.spDetails.wallet.table.date'] },
    { id: 1, name: messages['sAdmin.spDetails.wallet.table.amount'] },
    { id: 4, name: messages['sAdmin.spDetails.wallet.table.source'] },
  ];

  return (
    <>
      <Table definition celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell />
            {tableHeaders.map((header) => (
              <Table.HeaderCell key={header.id}>{header.name}</Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {historylist.length > 0 ? (
            historylist.map((trans) => (
              <Table.Row
                positive={trans.walletAmountSign === 1}
                negative={trans.walletAmountSign === 2}
                key={trans.id}
              >
                <Table.Cell>
                  {trans.walletAmountSign === 1
                    ? messages['sAdmin.spDetails.wallet.table.positive']
                    : messages['sAdmin.spDetails.wallet.table.negtive']}
                </Table.Cell>
                <Table.Cell>{trans.operationType.name}</Table.Cell>
                <Table.Cell>{trans.operationDetails}</Table.Cell>
                <Table.Cell>{moment(trans.operationDate).format('lll')}</Table.Cell>
                <Table.Cell textAlign="center">
                  {trans.walletAmountSign === 1 ? trans.amount : `-${trans.amount}`}
                </Table.Cell>
                <Table.Cell className="word-break">{trans.operationSource}</Table.Cell>
              </Table.Row>
            ))
          ) : (
            <Table.Row>
              <Table.Cell />
              <Table.Cell textAlign="center" colSpan="5">
                {messages['common.noData']}
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
        {historylist && historylist.length > 0 && Math.ceil(totalCount / 10) > 1 && (
          <Table.Footer fullWidth>
            <Table.Row>
              <Table.HeaderCell colSpan="6">
                <PaginationWithSemantic
                  pageNumber={pageNumber}
                  setPageNumber={setPageNumber}
                  totalCount={totalCount}
                />
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        )}
      </Table>
    </>
  );
};

WalletBlanceList.propTypes = {
  historylist: PropTypes.array,
  pageNumber: PropTypes.number,
  totalCount: PropTypes.number,
  setPageNumber: PropTypes.func,
};
export default WalletBlanceList;
