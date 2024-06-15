import React from 'react';
import { Row, Col, Dropdown, Button } from 'react-bootstrap';
import { Routes } from 'constants/Routes';
import { Rating } from '@material-ui/lab';
import { toast } from 'react-toastify';
import noBranchImg from 'images/noBranchImg.png';
import { CallAPI } from 'utils/API/APIConfig';
import { SP_GET_OWNER_BRANCHES } from 'utils/API/EndPoints/BranchManager';
import { useHistory } from 'react-router-dom';
import { useIntl } from 'react-intl';
import TableLoader from 'components/shared/TableLoader';

export default function BranchesAll() {
  const history = useHistory();
  const { messages } = useIntl();

  const { isLoading, data } = CallAPI({
    name: 'getbranchInfoAll',
    url: SP_GET_OWNER_BRANCHES,
    refetchOnWindowFocus: true,
    enabled: true,
    select: (res) => res?.data?.data,
    onError: (err) => toast.error(err?.response?.data?.error?.message),
  });

  return (
    <>
      <Row className="branch-header">
        <Col className="components">
          <div>
            <p className="title">{messages['branches.all']}</p>
            <p className="title-info">{messages['branches.all.info']}</p>
          </div>
          <div className="actionsDiv">
            <button
              type="button"
              className="btn btn-grey"
              onClick={() => {
                history.push(Routes.changeOwnerPhone);
              }}
            >
              {messages['branches.display.branches.change.owner']}
            </button>
            <button
              onClick={() => history.push(Routes.settingAllBrsanchesAdd)}
              type="button"
              className="btn btn-primary"
            >
              {messages['branches.add.new']}
            </button>
          </div>
        </Col>
      </Row>
      <Row className="branch-body">
        {!isLoading &&
          data?.list?.length > 0 &&
          data?.list?.map((branch) => (
            <Col lg={4} md={12} key={branch.branchId}>
              <div className="card branch-body__card">
                {branch?.bannerImage ? (
                  <img
                    className="branch-body__card--salonImg"
                    src={branch.bannerImage}
                    alt={branch.name}
                  />
                ) : (
                  <img
                    src={noBranchImg}
                    className="branch-body__card--salonImg"
                    alt={branch.name}
                  />
                )}

                <div className="card-body branch-body__card--bodyCard">
                  <div className="d-flex justify-content-between showActionsDiv">
                    <div className="d-flex">
                      <Rating
                        name="read-only"
                        className="branch-body__card--bodyCard__rating"
                        value={branch.rating}
                        precision={0.5}
                        readOnly
                      />
                      <span className="px-2">{branch.rating || 0}</span>
                    </div>
                    <Dropdown
                      id="dropdown-menu-align-end"
                      className="showMore"
                      drop="start"
                    >
                      <Dropdown.Toggle
                        className="showMore--btn"
                        id="dropdown-autoclose-true"
                      >
                        <i className="flaticon-more" />
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="showMore--dropdown">
                        <Dropdown.Item
                          as={Button}
                          eventKey="1"
                          onClick={() => {
                            history.push(Routes.changeManager);
                            localStorage.setItem(
                              'selectedBranches',
                              JSON.stringify([branch.branchId]),
                            );
                          }}
                        >
                          {messages['branches.add.branch.change.manager.title']}
                        </Dropdown.Item>
                        {/* <Dropdown.Item as={Button} eventKey="2">
                          {messages['branches.display.branches.delete.branch']}
                        </Dropdown.Item> */}
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                  <h5 className="branch-body__card--bodyCard__name">{branch.name}</h5>
                  <p className="branch-body__card--bodyCard__address">
                    {branch.address || messages['branches.display.branches.address']}
                  </p>
                  <h6 className="branch-body__card--bodyCard__name">
                    {messages['branches.branch.manager']}
                  </h6>
                  <div className="d-flex justify-content-between">
                    <p className="branch-body__card--bodyCard__address">
                      {branch.managerName}
                    </p>
                    <p className="branch-body__card--bodyCard__address">
                      {branch.mobileNumber}
                    </p>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        <Col className="d-flex justify-content-center">
          {(data?.list?.length === 0 || isLoading) && (
            <TableLoader colSpan="2" noData={!isLoading} />
          )}
        </Col>
      </Row>
    </>
  );
}
