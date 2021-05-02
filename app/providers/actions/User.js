export const actions = {
  REGISTER_REQUEST: 'REGISTER_REQUEST',
  LOGIN: {
    REQUEST: 'LOGIN_REQUEST',
  },
  FORGOT_PASSWORD: 'FORGOT_PASSWORD',
  SYNC_USER: 'SYNC_USER',
  SYNC_CHATS: 'SYNC_CHATS',
  FORMAT_CHATS: 'FORMAT_CHATS',
  LOGOUT: {
    REQUEST: 'LOGOUT_REQUEST',
  },
  GET: {
    CHAT: 'GET_CHAT',
    CHAT_USER_DETAILS: 'GET_CHAT_USER_DETAILS',
  },
  SEND_MESSAGE: 'SEND_MESSAGE',
  SEND_PRODUCT: 'SEND_PRODUCT',
  PUT: {
    TOKEN: 'PUT_TOKEN',
    USER_PROFILE: 'PUT_USER_PROFILE',
    USERNAME: 'PUT_USERNAME',
    USER_PROFILE_PICTURE: 'PUT_USER_PROFILE_PICTURE',
    USER_MOBILE: 'PUT_USER_MOBILE',
    USER_LOCATION: 'PUT_USER_LOCATION',
    USER_CHATS: 'PUT_USER_CHATS',
    CHATS: 'PUT_CHATS',
    LOADING_STATUS: 'PUT_LOADING_STATUS',
  },
  UPDATE: {
    USER_PROFILE: 'UPDATE_USER_PROFILE',
  },
};

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

export const getChatUserDetails = (userUuid) => ({
  type: actions.GET.CHAT_USER_DETAILS,
  payload: userUuid,
});

export const sendMessage = (receiverUuid, receiverToken, message) => ({
  type: actions.SEND_MESSAGE,
  payload: { receiverUuid, receiverToken, message },
});

export const sendProduct = (receiverUuid, receiverToken, product) => ({
  type: actions.SEND_PRODUCT,
  payload: { receiverUuid, receiverToken, product },
});

export const formatUserChats = (chats) => ({
  type: actions.FORMAT_CHATS,
  payload: chats,
});

export const putUserChats = (chats) => ({
  type: actions.PUT.USER_CHATS,
  payload: chats,
});

export const getChat = (receiverUuid) => ({
  type: actions.GET.CHAT,
  payload: receiverUuid,
});

export const putChats = (chat) => ({
  type: actions.PUT.CHATS,
  payload: chat,
});

export const syncUser = () => ({
  type: actions.SYNC_USER,
});

export const syncChats = () => ({
  type: actions.SYNC_CHATS,
});

export const register = (
  location,
  username,
  mobile,
  email,
  password,
  userImage
) => ({
  type: actions.REGISTER_REQUEST,
  payload: { location, username, mobile, email, password, userImage },
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

export const putUserProfilePicture = (profilePicture) => ({
  type: actions.PUT.USER_PROFILE_PICTURE,
  payload: profilePicture,
});

export const putUserName = (name) => ({
  type: actions.PUT.USERNAME,
  payload: name,
});

export const putUserMobile = (mobile) => ({
  type: actions.PUT.USER_MOBILE,
  payload: mobile,
});

export const putUserLocation = (location) => ({
  type: actions.PUT.USER_LOCATION,
  payload: location,
});

export const putLoadingStatus = (isLoading) => ({
  type: actions.PUT.LOADING_STATUS,
  isLoading,
});
