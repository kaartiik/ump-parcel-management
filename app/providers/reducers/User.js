import { actions } from '../actions/User';

const initialState = {
  name: '',
  email: '',
  mobile: '',
  uuid: '',
  role: '',
  isAdmin: false,
  token: '',
  isLoading: false,
};

export default function userReducer(state = initialState, action = {}) {
  switch (action.type) {
    case actions.PUT.USER_PROFILE: {
      const { uuid, name, email, mobile, role, token } = action.payload;
      console.log(uuid, name, email, mobile, role, token);
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

    case actions.PUT.LOADING_STATUS:
      return {
        ...state,
        isLoading: action.isLoading,
      };

    default:
      return state;
  }
}
