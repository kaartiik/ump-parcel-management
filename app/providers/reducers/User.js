import { actions } from '../actions/User';

const initialState = {
  avatar: null,
  name: null,
  email: null,
  phone: null,
  units: null,
  uuid: null,
  roles: null,
  unitsArr: [],
  isAdmin: null,
  isAuthorized: null,
  firstTimeLogin: null,
  token: null,
  isSuccess: false,
  isLoading: false,
  user: null,
};

export default function userReducer(state = initialState, action = {}) {
  switch (action.type) {
    case actions.SYNC_PROFILE:
      return {
        ...state,
        list: action.profile,
      };

    case actions.PUT.USER:
      return {
        ...state,
        user: action.user,
      };

    case actions.PUT.USER_NAME:
      return {
        ...state,
        name: action.payload,
      };

    case actions.PUT.USER_PHONE:
      return {
        ...state,
        phone: action.payload,
      };

    case actions.PUT.USER_PROFILE: {
      const {
        uuid,
        avatar,
        name,
        email,
        phone,
        units,
        unitsArr,
        roles,
        isAdmin,
        isAuthorized,
      } = action.profile;
      return {
        ...state,
        avatar,
        name,
        email,
        phone,
        units,
        unitsArr,
        uuid,
        roles,
        isAdmin,
        isAuthorized,
      };
    }

    case actions.PUT.LOADING_STATUS:
      return {
        ...state,
        isLoading: action.isLoading,
      };

    default:
      return state;
  }
}
