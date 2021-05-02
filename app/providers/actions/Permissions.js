export const actions = {
  GET_PERMISSIONS: 'GET_PERMISSIONS',
  PUT: {
    NOTIFICATIONS_PERMISSION: 'PUT_NOTIFICATIONS_PERMISSION',
  },
};

export const getPermissions = () => ({
  type: actions.GET_PERMISSIONS,
});

export const putNotificationPermission = (permission) => ({
  type: actions.PUT.NOTIFICATIONS_PERMISSION,
  payload: permission,
});
