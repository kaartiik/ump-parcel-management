import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Splash from '../../components/Splash';
import { syncUser } from '../../providers/actions/User';

const Authentication = ({ syncUser: syncUserCall }) => {
  useEffect(() => {
    syncUserCall();
  });

  return <Splash />;
};

Authentication.propTypes = {
  syncUser: PropTypes.func.isRequired,
};

export default connect(null, { syncUser })(Authentication);
