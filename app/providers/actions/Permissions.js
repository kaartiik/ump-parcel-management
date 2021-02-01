export const actions = {
  GET_PERMISSIONS: 'GET_PERMISSIONS',
  PUT: {
    CALENDAR_ID: 'PUT_CALENDAR_ID',
    CALENDAR_PERMISSION: 'PUT_CALENDAR_PERMISSION',
    REMINDERS_PERMISSION: 'PUT_REMINDERS_PERMISSION',
  },
};

export const getPermissions = () => ({
  type: actions.GET_PERMISSIONS,
});

export const putCalendarId = (id) => ({
  type: actions.PUT.CALENDAR_ID,
  payload: id,
});

export const putCalendarPermission = (permission) => ({
  type: actions.PUT.CALENDAR_PERMISSION,
  payload: permission,
});

export const putRemindersPermission = (permission) => ({
  type: actions.PUT.REMINDERS_PERMISSION,
  payload: permission,
});
