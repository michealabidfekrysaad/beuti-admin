import React, { useMemo } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import './PolygonsColors.scss';
const MapPolygonColors = () => {
  const { messages } = useIntl();
  const typesOfPolygon = useMemo(
    () => [
      {
        name: 'beut.polygon.district',
        class: 'polygons-district polygons-item',
        key: 2,
      },
      {
        name: 'beut.polygon.city',
        class: 'polygons-city polygons-item',
        key: 1,
      },

      {
        name: 'beut.polygon.new',
        class: 'polygons-new polygons-item',
        key: 3,
      },
    ],
    [],
  );
  return (
    <Row className="justify-content-center align-items-center mx-0 polygons">
      {typesOfPolygon.map((polygon) => (
        <Col xs="auto" key={polygon.key} className={`text-center ${polygon.class}`}>
          {messages[polygon.name]}
        </Col>
      ))}
    </Row>
  );
};

export default MapPolygonColors;
