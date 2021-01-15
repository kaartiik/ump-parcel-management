import React from 'react';
// import PropTypes from 'prop-types';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});

const Loading = () => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color="black" />
  </View>
);

// Loading.defaultProps = {
//   size: 'small',
//   style: null,
//   hasMargin: true,
// };

// Loading.propTypes = {
//   size: PropTypes.string,
//   style: PropTypes.object,
//   hasMargin: PropTypes.bool,
// };

export default Loading;
