import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { List, Table, Accordion, Icon } from 'semantic-ui-react';
import { formatDuration } from 'functions/timeFunctions';
import { useIntl } from 'react-intl';

export function ServicesCategoriesList({ generalCenterTypeList }) {
  const [accordionSelection, setAccordionSelection] = useState(
    generalCenterTypeList.length > 0 && generalCenterTypeList[0].id,
  );
  const { messages, locale } = useIntl();

  const handleAccordionSelection = (e, titleProps) => {
    const { index } = titleProps;
    const newIndex = accordionSelection === index ? -1 : index;
    setAccordionSelection(newIndex);
  };
  return (
    <List style={{ marginRight: '3em', marginLeft: '3em' }}>
      <Accordion>
        {generalCenterTypeList.map(({ id: gctId, name: gct, categoryServicesModel }) => (
          <React.Fragment key={gctId}>
            <Accordion.Title
              active={accordionSelection === gctId}
              index={gctId}
              as="h4"
              onClick={handleAccordionSelection}
            >
              <Icon name="dropdown" />
              {gct}
            </Accordion.Title>
            <Accordion.Content active={accordionSelection === gctId}>
              {categoryServicesModel.map(({ id: ctId, name: ct, serviceList }) => (
                <List.Item leu={ctId}>
                  <List.Content>
                    <List.List>
                      <Table textAlign="center" color="purple">
                        <Table.Header>
                          <Table.Row>
                            <Table.HeaderCell
                              textAlign="center"
                              style={{ color: 'purple' }}
                            >
                              {ct}
                            </Table.HeaderCell>
                            <Table.HeaderCell />
                            <Table.HeaderCell />
                            <Table.HeaderCell />
                            <Table.HeaderCell />
                          </Table.Row>
                        </Table.Header>
                        <Table.Header>
                          <Table.Row>
                            <Table.HeaderCell>
                              {messages['common.serviceName']}
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                              {messages['common.duration']}
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                              {messages['common.bookingNo']}
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                              {messages['common.closedBookingNo']}
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                              {messages['booking.details.price']}
                            </Table.HeaderCell>
                          </Table.Row>
                        </Table.Header>
                        <Table.Body>
                          {serviceList.map(
                            ({
                              id: serviceId,
                              name: serviceName,
                              bookingNo,
                              closedBookingNo,
                              duration,
                              offerViewObj,
                              price,
                            }) => (
                              <Table.Row key={serviceId}>
                                <Table.Cell>{serviceName}</Table.Cell>
                                <Table.Cell>
                                  {formatDuration(duration, locale, messages)}
                                </Table.Cell>
                                <Table.Cell>{bookingNo}</Table.Cell>
                                <Table.Cell>{closedBookingNo}</Table.Cell>
                                <Table.Cell>
                                  {offerViewObj.offerPercentage
                                    ? price - (price * offerViewObj.offerPercentage) / 100
                                    : price}
                                  {messages.currency}
                                </Table.Cell>
                              </Table.Row>
                            ),
                          )}
                        </Table.Body>
                      </Table>
                    </List.List>
                  </List.Content>
                </List.Item>
              ))}
            </Accordion.Content>
          </React.Fragment>
        ))}
      </Accordion>
    </List>
  );
}

ServicesCategoriesList.propTypes = {
  generalCenterTypeList: PropTypes.array,
};
