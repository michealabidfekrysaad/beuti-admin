/**
 * Asynchronously loads the component for Home
 */

import React from 'react';
import loadable from 'utils/loadable';
import { LoadingProfile } from 'components/shared/Shimmer';

export default loadable(() => import('./index'), {
  fallback: <LoadingProfile type="profile" fluid />,
});
