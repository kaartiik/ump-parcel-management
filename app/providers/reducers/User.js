import { actions } from '../actions/User';

const initialState = {
  name: '',
  email: '',
  mobile: '',
  uuid: '',
  role: '',
  isAdmin: false,
  token: '',
  userChats: [],
  allChats: null,
  isLoading: false,
};

export default function userReducer(state = initialState, action = {}) {
  switch (action.type) {
    case actions.PUT.USER_PROFILE: {
      const { uuid, name, email, mobile, role, token } = action.payload;
      return {
        ...state,
        uuid,
        name,
        email,
        mobile,
        role,
        isAdmin: role === 'barber' ? true : false,
        token,
      };
    }

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
