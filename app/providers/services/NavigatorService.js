import { NavigationActions } from 'react-navigation';
import { createRef } from 'react';

export const isMountedRef = createRef();
export const navRef = createRef();

const config = {};
export function setNavigator(nav) {
  if (nav) {
    config.navigator = nav;
  }
}
export function navigate(routeName, params) {
  if (navRef.current !== null && isMountedRef.current === true) {
    // if (config.navigator && routeName) {
    console.log(`navigate ${routeName}`);
    navRef.current.navigate(routeName, params);
    // const action = NavigationActions.navigate({ routeName, params });
    // config.navigator.dispatch(action);
  } else {
    console.log(`not yet mount ${routeName}`);
  }
}
export function goBack() {
  if (navRef.current && isMountedRef.current) {
    navRef.current.back();
  }
}

export function reset(routeName, routeParams) {
  if (navRef.current && isMountedRef.current) {
    navRef.current.reset({
      index: 0,
      routes: [{ name: routeName, params: routeParams }],
    });
  }
}
