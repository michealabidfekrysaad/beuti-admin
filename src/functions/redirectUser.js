import React from 'react';
import { Redirect } from 'react-router-dom';

export function redirectUser(location, redirect) {
  return (
    <Redirect
      to={{
        pathname: redirect,
        state: { from: location },
      }}
    />
  );
}
