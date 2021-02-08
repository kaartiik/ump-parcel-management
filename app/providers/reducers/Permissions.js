import { actions } from '../actions/Permissions';

const initialState = {
  calendarId: -1,
  calendarPermission: false,
  notificationPermission: false,
};

export default function permissionsReducer(state = initialState, action = {}) {
  switch (action.type) {
    case actions.PUT.CALENDAR_ID:
      return {
        ...state,
        calendarId: action.payload,
      };

    case actions.PUT.CALENDAR_PERMISSION:
      return {
        ...state,
        calendarPermission: action.payload,
      };

    case actions.PUT.NOTIFICATIONS_PERMISSION:
      return {
        ...state,
        notificationPermission: action.payload,
      };

    default:
      return state;
  }
}
