export const actions = {
  REGISTER_REQUEST: 'REGISTER_REQUEST',
  LOGIN: {
    REQUEST: 'LOGIN_REQUEST',
  },
  SYNC_USER: 'SYNC_USER',
  LOGOUT: {
    REQUEST: 'LOGOUT_REQUEST',
  },
  PUT: {
    TOKEN: 'PUT_TOKEN',
    USER_PROFILE: 'PUT_USER_PROFILE',
    LOADING_STATUS: 'PUT_LOADING_STATUS',
  },
  UPDATE: {
    USER_PROFILE: 'UPDATE_USER_PROFILE',
  },
};

export const syncUser = () => ({
  type: actions.SYNC_USER,
});

export const register = (role, name, mobile, email, password) => ({
  type: actions.REGISTER_REQUEST,
  payload: { role, name, mobile, email, password },
});

export const login = ({ email, password }) => ({
  type: actions.LOGIN.REQUEST,
  email,
  password,
});

export const logout = () => ({
  type: actions.LOGOUT.REQUEST,
});

export const putUserProfile = (profile) => ({
  type: actions.PUT.USER_PROFILE,
  payload: profile,
});

export const putLoadingStatus = (isLoading) => ({
  type: actions.PUT.LOADING_STATUS,
  isLoading,
});
