import React from 'react';
import { Image, Dimensions } from 'react-native';

import LogoImage from '../../assets/Logo.png';

const { width, height } = Dimensions.get('window');

const Logo = () => (
  <Image source={LogoImage} resizeMode="contain" style={{ width, height }} />
);

export default Logo;
