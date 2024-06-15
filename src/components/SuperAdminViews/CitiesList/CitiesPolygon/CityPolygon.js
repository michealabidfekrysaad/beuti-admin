/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import useAPI, { get, put } from 'hooks/useAPI';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { Routes } from 'constants/Routes';
import { CircularProgress } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { HandleSuccessAndErrorMsg } from '../../../../functions/HandleSuccessAndErrorMsg';
import MapWithDrawer from './MapWithDrawer';
import MapPolygonColors from './MapPolygonColors';
import { ConfirmationModal } from '../../../shared/ConfirmationModal';

const CityPolygon = () => {
  const { messages } = useIntl();
  const { cityId } = useParams();
  const [newPolygon, setNewPolygon] = useState('');
  const [districtPolygons, setDistrictPolygons] = useState('');
  const [cityPolygon, setCityPolygon] = useState('');
  const [polygonError, setPolygonError] = useState('');
  const [polygonDeleteSuccess, setPolygonDeleteSuccess] = useState('');
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  /* -------------------------------------------------------------------------- */
  /*                 Prepare The Api And Mainpulate The Response                */
  /* -------------------------------------------------------------------------- */
  const {
    response: getPolygonRes,
    isLoading: getPolygonLoading,
    setRecall: getPolygonRecall,
  } = useAPI(get, `City/GetCityboundaryById?cityId=${cityId}`);

  useEffect(() => {
    getPolygonRecall(true);
  }, []);

  useEffect(() => {
    if (getPolygonRes?.data) {
      setDistrictPolygons(
        getPolygonRes?.data?.districtPolygons.map((data) =>
          data.map((data2) => ({
            lat: +data2.lat,
            lng: +data2.lng,
          })),
        ),
      );
      setCityPolygon(
        getPolygonRes?.data?.cityPolygon.map((data) => ({
          lat: +data.lat,
          lng: +data.lng,
        })),
      );
    }
  }, [getPolygonRes]);

  /* -------------------------------------------------------------------------- */
  /*              Function To Get The Polygon Points From Reference             */
  /* -------------------------------------------------------------------------- */
  function getPolygonPoints(polygonReference) {
    if (polygonReference) {
      const polygonsPoint = polygonReference
        .getPath()
        .getArray()
        .map((path) => ({ lat: path.lat(), lng: path.lng() }));
      return [...polygonsPoint, { lat: polygonsPoint[0].lat, lng: polygonsPoint[0].lng }];
    }
    return [];
  }
  /* -------------------------------------------------------------------------- */
  /*                             Delete The Polyghon                            */
  /* -------------------------------------------------------------------------- */
  function DeletePolygon() {
    if (newPolygon) newPolygon.setMap(null);
    setNewPolygon('');
  }

  /* -------------------------------------------------------------------------- */
  /*                        Handle Validation And Submit                        */
  /* -------------------------------------------------------------------------- */
  const {
    response: updatePolygonRes,
    isLoading: updatePolygonLoading,
    setRecall: updatePolygonRecall,
  } = useAPI(put, `City/AddCityPolygon`, {
    cityId,
    coordinates: getPolygonPoints(newPolygon),
  });
  function handleSubmit() {
    if (getPolygonPoints(newPolygon).length < 4) {
      DeletePolygon();
      return HandleSuccessAndErrorMsg(
        setPolygonError,
        messages['beut.validation.polygon'],
      );
    }
    if (getPolygonPoints(newPolygon).length >= 4) {
      updatePolygonRecall(true);
    }
    return null;
  }
  useEffect(() => {
    if (updatePolygonRes?.success) {
      getPolygonRecall(true);
      DeletePolygon();
    }
  }, [updatePolygonRes]);
  /* -------------------------------------------------------------------------- */
  /*                             Delete Old Polygon                             */
  /* -------------------------------------------------------------------------- */
  const {
    response: deleteOldPolygonRes,
    isLoading: deleteOldPolygonLoading,
    setRecall: deleteOldPolygonRecall,
  } = useAPI(put, `City/DeleteBoundary?cityId=${cityId}`);
  function handleDeleteOldPolygon() {
    deleteOldPolygonRecall(true);
  }
  useEffect(() => {
    if (deleteOldPolygonRes?.data) {
      getPolygonRecall(true);

      return HandleSuccessAndErrorMsg(
        setPolygonDeleteSuccess,
        messages['common.deletedSuccess'],
      );
    }
    return null;
  }, [deleteOldPolygonRes]);
  return (
    <Card className="mb-2">
      <Card.Header>
        <div className="title"> {messages['beut.add.polygon']}</div>
        <Link to={Routes.cities}>
          <Button
            variant="outline-danger"
            className="px-4"
            disabled={getPolygonLoading || updatePolygonLoading}
          >
            {getPolygonLoading || updatePolygonLoading ? (
              <CircularProgress size={24} color="secondary" />
            ) : (
              messages['common.back']
            )}
          </Button>
        </Link>
      </Card.Header>
      <Card.Body>
        <Row className="justify-content-between align-items-center">
          <Col xs="auto">
            <Button
              className="px-4 mb-1"
              variant="danger"
              onClick={() => DeletePolygon()}
              disabled={getPolygonPoints(newPolygon).length === 0}
            >
              {messages['beut.delete.new.polygon']}
            </Button>
          </Col>
          <Col xs="auto">
            <Button
              className="btn-link"
              variant="link"
              onClick={() => setOpenDeleteModal(true)}
              disabled={!cityPolygon || cityPolygon.length === 0}
            >
              {messages['beut.polygon.delete.old']}
            </Button>
          </Col>
        </Row>
        <Row>
          <Col xs="12">
            {polygonDeleteSuccess && (
              <Alert className="my-3" severity="success">
                {polygonDeleteSuccess}
              </Alert>
            )}
          </Col>
        </Row>

        <MapWithDrawer
          districtPolygons={districtPolygons}
          setNewPolygon={setNewPolygon}
          cityPolygon={cityPolygon}
          newPolygon={newPolygon}
          containerElement={<div style={{ width: `100%`, height: '500px' }} />}
          mapElement={<div style={{ height: `100%` }} />}
          googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyC_5d_KRlQI-ImerPd1hZFrtQYKWL-yS10&libraries=geometry,drawing,places"
          loadingElement={<div style={{ height: `100%` }} />}
          position={{
            lat: 22.53265591475684,
            lng: 46.69235839843748,
          }}
        />
        {polygonError && (
          <Alert className="mt-3" severity="error">
            {polygonError}
          </Alert>
        )}
        <MapPolygonColors />
      </Card.Body>

      <Card.Footer>
        <Button
          onClick={() => handleSubmit()}
          className="w-100"
          disabled={getPolygonPoints(newPolygon).length === 0 || updatePolygonLoading}
        >
          {messages['common.save']}
        </Button>
      </Card.Footer>
      <ConfirmationModal
        setPayload={handleDeleteOldPolygon}
        Id={cityId}
        openModal={openDeleteModal}
        setOpenModal={setOpenDeleteModal}
        message="beuti.polygon.delete.message"
      />
    </Card>
  );
};

export default CityPolygon;
