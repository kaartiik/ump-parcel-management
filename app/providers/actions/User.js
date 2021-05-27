export const actions = {
  REGISTER_REQUEST: 'REGISTER_REQUEST',
  LOGIN: {
    REQUEST: 'LOGIN_REQUEST',
  },
  FORGOT_PASSWORD: 'FORGOT_PASSWORD',
  SYNC_USER: 'SYNC_USER',
  LOGOUT: {
    REQUEST: 'LOGOUT_REQUEST',
  },
  ADD: {
    SCANNED_DETAILS: 'ADD_SCANNED_DETAILS',
  },
  GET: {
    ALL_USERS: 'GET_ALL_USERS',
    MY_SCANS: 'GET_MY_SCANS',
    ALL_SCANS: 'GET_ALL_SCANS',
  },
  PUT: {
    USER_PROFILE: 'PUT_USER_PROFILE',
    ALL_USERS: 'PUT_ALL_USERS',
    ALL_SCANS: 'PUT_ALL_SCANS',
    LOADING_STATUS: 'PUT_LOADING_STATUS',
  },
  UPDATE: {
    USER_PROFILE: 'UPDATE_USER_PROFILE',
  },
};

export const getAllUsers = () => ({
  type: actions.GET.ALL_USERS,
});

export const putAllUsers = (users) => ({
  type: actions.PUT.ALL_USERS,
  payload: users,
});

export const getMyScans = () => ({
  type: actions.GET.MY_SCANS,
});

export const getAllScans = () => ({
  type: actions.GET.ALL_SCANS,
});

export const putAllScans = (scans) => ({
  type: actions.PUT.ALL_SCANS,
  payload: scans,
});

export const addScannedDetails = (
  username,
  usertype,
  idnumber,
  email,
  time,
  location,
  onSuccess
) => ({
  type: actions.ADD.SCANNED_DETAILS,
  payload: { username, usertype, idnumber, email, time, location, onSuccess },
});

export const updateUserProfile = (
  username,
  mobile,
  location,
  profilePicture,
  onSuccess
) => ({
  type: actions.UPDATE.USER_PROFILE,
  payload: { username, mobile, location, profilePicture, onSuccess },
});

export const syncUser = () => ({
  type: actions.SYNC_USER,
});

export const register = (usertype, username, idnumber, email, password) => ({
  type: actions.REGISTER_REQUEST,
  payload: { usertype, username, idnumber, email, password },
});

export const login = ({ email, password }) => ({
  type: actions.LOGIN.REQUEST,
  email,
  password,
});

export const logout = () => ({
  type: actions.LOGOUT.REQUEST,
});

export const forgotPassword = (email) => ({
  type: actions.FORGOT_PASSWORD,
  payload: email,
});

export const putUserProfile = (profile) => ({
  type: actions.PUT.USER_PROFILE,
  payload: profile,
});

export const putLoadingStatus = (isLoading) => ({
  type: actions.PUT.LOADING_STATUS,
  isLoading,
});
