/* eslint-disable  */

import React from 'react';
import { Image } from 'react-bootstrap';
import { toAbsoluteUrl } from '../../functions/toAbsoluteUrl';

export default function HorizontalStepper({ steps, percantage }) {
  return (
    <section className="horizntalstepper">
      {steps.map((step, index) => (
        <div className="horizntalstepper-step">
          <div className={`horizntalstepper-title ${step.status}`}>{step.name}</div>
          <div className="horizntalstepper-body">
            <div className={`horizntalstepper-body__bullet ${step.status}`}>
              {step.status === 'active' && <Image src={toAbsoluteUrl('/Dot.png')} />}
              {step.status === 'success' && <Image src={toAbsoluteUrl('/right.png')} />}
            </div>
          </div>
        </div>
      ))}
      <div className="horizntalstepper-line__empty"></div>
      <div className="horizntalstepper-line__full" style={{ width: percantage }}></div>
    </section>
  );
}
