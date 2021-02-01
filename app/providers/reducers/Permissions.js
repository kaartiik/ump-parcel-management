import { actions } from '../actions/Permissions';

const initialState = {
  calendarId: -1,
  calendarPermission: false,
  remindersPermission: false,
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

    case actions.PUT.REMINDERS_PERMISSION:
      return {
        ...state,
        remindersPermission: action.payload,
      };

    default:
      return state;
  }
}
