import { actions } from '../actions/User';

const initialState = {
  username: '',
  usertype: '',
  email: '',
  idnumber: '',
  uuid: '',
  users: [],
  scans: [],
  isLoading: false,
};

export default function userReducer(state = initialState, action = {}) {
  switch (action.type) {
    case actions.PUT.USER_PROFILE: {
      const { uuid, username, email, idnumber, usertype } = action.payload;
      return {
        ...state,
        uuid,
        username,
        email,
        idnumber,
        usertype,
      };
    }

    case actions.PUT.ALL_USERS:
      return {
        ...state,
        users: action.payload,
      };

    case actions.PUT.ALL_SCANS:
      return {
        ...state,
        scans: action.payload,
      };

    case actions.PUT.USERNAME:
      return {
        ...state,
        username: action.payload,
      };

    case actions.PUT.USER_MOBILE:
      return {
        ...state,
        mobile: action.payload,
      };

    case actions.PUT.USER_LOCATION:
      return {
        ...state,
        location: action.payload,
      };

    case actions.PUT.USER_CHATS:
      return {
        ...state,
        userChats: action.payload,
      };

    case actions.PUT.CHATS:
      return {
        ...state,
        allChats: action.payload,
      };

    case actions.PUT.LOADING_STATUS:
      return {
        ...state,
        isLoading: action.isLoading,
      };

    default:
      return state;
  }
}
