export const actions = {
  REGISTER_REQUEST: 'REGISTER_REQUEST',
  LOGIN: {
    REQUEST: 'LOGIN_REQUEST',
  },
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
  PUT: {
    TOKEN: 'PUT_TOKEN',
    USER_PROFILE: 'PUT_USER_PROFILE',
    USER_CHATS: 'PUT_USER_CHATS',
    CHATS: 'PUT_CHATS',
    LOADING_STATUS: 'PUT_LOADING_STATUS',
  },
  UPDATE: {
    USER_PROFILE: 'UPDATE_USER_PROFILE',
  },
};

export const getChatUserDetails = (userUuid) => ({
  type: actions.GET.CHAT_USER_DETAILS,
  payload: userUuid,
});

export const sendMessage = (receiverUuid, receiverToken, message) => ({
  type: actions.SEND_MESSAGE,
  payload: { receiverUuid, receiverToken, message },
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
