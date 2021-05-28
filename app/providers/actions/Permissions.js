export const actions = {
  GET_PERMISSIONS: 'GET_PERMISSIONS',
  PUT: {
    NOTIFICATIONS_PERMISSION: 'PUT_NOTIFICATIONS_PERMISSION',
    LOCATION_PERMISSION: 'PUT_LOCATION_PERMISSION',
    CAMERA_PERMISSION: 'CAMERA_PERMISSION',
  },
};

export const getPermissions = () => ({
  type: actions.GET_PERMISSIONS,
});

export const putNotificationPermission = (permission) => ({
  type: actions.PUT.NOTIFICATIONS_PERMISSION,
  payload: permission,
});

export const putLocationPermission = (permission) => ({
  type: actions.PUT.LOCATION_PERMISSION,
  payload: permission,
});

export const putCameraPermission = (permission) => ({
  type: actions.PUT.CAMERA_PERMISSION,
  payload: permission,
});
