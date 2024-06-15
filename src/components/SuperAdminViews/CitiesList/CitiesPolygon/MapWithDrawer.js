/* eslint-disable no-undef */

import React from 'react';
import { GoogleMap, Polygon, withGoogleMap, withScriptjs } from 'react-google-maps';
import DrawingManager from 'react-google-maps/lib/components/drawing/DrawingManager';

const MapWithDrawer = withScriptjs(
  withGoogleMap(
    ({ newPolygon, setNewPolygon, districtPolygons, cityPolygon, position }) => {
      /* -------------------------------------------------------------------------- */
      /*                     Set Global Options For All Polygons                    */
      /* -------------------------------------------------------------------------- */

      const PolygonOptionGlobal = (color, editable) => ({
        strokeColor: color,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: color,
        fillOpacity: 0.35,
        editable,
      });

      /* -------------------------------------------------------------------------- */
      /*         Set The Map With Drawer And Polygons That come From backend        */
      /* -------------------------------------------------------------------------- */
      return (
        <GoogleMap defaultZoom={6} center={position}>
          {districtPolygons &&
            districtPolygons?.map((data) => (
              <Polygon
                path={data}
                key={JSON.stringify(data)}
                options={PolygonOptionGlobal('#113460', false)}
              />
            ))}
          <Polygon
            path={cityPolygon}
            key={JSON.stringify(cityPolygon)}
            options={PolygonOptionGlobal('#7fc8a9', false)}
          />

          {!newPolygon && (
            <DrawingManager
              onPolygonComplete={(poly) => setNewPolygon(poly)}
              setMap={GoogleMap}
              defaultOptions={{
                polygonOptions: PolygonOptionGlobal('#e63e6d', true),
                drawingControl: !newPolygon,
                drawingControlOptions: {
                  position: google.maps.ControlPosition.TOP_CENTER,
                  drawingModes: [google.maps.drawing.OverlayType.POLYGON],
                },
                drawingMode: google.maps.drawing.OverlayType.POLYGON,
              }}
            />
          )}
        </GoogleMap>
      );
    },
  ),
);

export default MapWithDrawer;
