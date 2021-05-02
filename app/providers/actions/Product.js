export const actions = {
  GET: {
    ALL_PRODUCTS: 'GET_ALL_PRODUCTS',
    MY_PRODUCTS: 'GET_MY_PRODUCTS',
    PRODUCT_USER_INFO: 'GET_PRODUCT_USER_INFO',
  },
  PUT: {
    ALL_PRODUCTS: 'PUT_ALL_PRODUCTS',
    MY_PRODUCTS: 'PUT_MY_PRODUCTS',
    CURRENT_PRODUCT: 'PUT_CURRENT_PRODUCT',
    PRODUCT_USER_INFO: 'PUT,pRODUCT_USER_INFO',
    LOADING_STATUS: 'PUT_LOADING_STATUS',
  },
  ADD: {
    PRODUCT: 'ADD_PRODUCT',
    BARBER_SHOP: 'ADD_BARBER_SHOP',
  },
  UPDATE: {
    PRODUCT: 'UPDATE_PRODUCT',
  },
  EDIT: {
    BARBER_SHOP: 'EDIT_BARBER_SHOP',
  },
  UPDATE_BOOKING_STATUS: 'UPDATE_BOOKING_STATUS',
  DELETE: {
    PRODUCT: 'DELETE_PRODUCT',
    PER_IMAGE: 'DELETE_PER_IMAGE',
  },
  CANCEL: {
    BOOKING: 'CANCEL_BOOKING',
  },
};

export const deleteProduct = (productUid, onSuccess) => ({
  type: actions.DELETE.PRODUCT,
  payload: { productUid, onSuccess },
});

export const deletePerImage = (image, productUid) => ({
  type: actions.DELETE.PER_IMAGE,
  payload: { image, productUid },
});

export const getProductUserInfo = (product) => ({
  type: actions.GET.PRODUCT_USER_INFO,
  payload: product,
});

export const putProductUserInfo = (userinfo) => ({
  type: actions.PUT.PRODUCT_USER_INFO,
  payload: userinfo,
});

export const addProduct = (
  productName,
  category,
  description,
  price,
  sellType,
  productImages,
  meetUpLocation
) => ({
  type: actions.ADD.PRODUCT,
  payload: {
    productName,
    category,
    description,
    price,
    sellType,
    productImages,
    meetUpLocation,
  },
});

export const updateProduct = (
  productUid,
  productName,
  category,
  description,
  price,
  sellType,
  productImages,
  meetUpLocation,
  onSuccess
) => ({
  type: actions.UPDATE.PRODUCT,
  payload: {
    productUid,
    productName,
    category,
    description,
    price,
    sellType,
    productImages,
    meetUpLocation,
    onSuccess,
  },
});

export const putCurrentProduct = (product) => ({
  type: actions.PUT.CURRENT_PRODUCT,
  payload: product,
});

export const updateBookingStatus = (
  shopUid,
  clientUid,
  bookingUid,
  timestamp,
  status
) => ({
  type: actions.UPDATE_BOOKING_STATUS,
  payload: { shopUid, clientUid, bookingUid, timestamp, status },
});

export const getAllProducts = () => ({
  type: actions.GET.ALL_PRODUCTS,
});

export const getMyProducts = () => ({
  type: actions.GET.MY_PRODUCTS,
});

export const putAllProducts = (products) => ({
  type: actions.PUT.ALL_PRODUCTS,
  payload: products,
});

export const putMyProducts = (products) => ({
  type: actions.PUT.MY_PRODUCTS,
  payload: products,
});

export const addBarberShop = (
  shopName,
  shopAddress,
  shopContact,
  services,
  shopOpenTime,
  shopCloseTime,
  onSuccess
) => ({
  type: actions.ADD.BARBER_SHOP,
  payload: {
    shopName,
    shopAddress,
    shopContact,
    services,
    shopOpenTime,
    shopCloseTime,
    onSuccess,
  },
});

export const editBarberShop = (
  shopUid,
  shopName,
  shopAddress,
  shopContact,
  services,
  shopOpenTime,
  shopCloseTime,
  onSuccess
) => ({
  type: actions.EDIT.BARBER_SHOP,
  payload: {
    shopUid,
    shopName,
    shopAddress,
    shopContact,
    services,
    shopOpenTime,
    shopCloseTime,
    onSuccess,
  },
});

export const getBarberBookings = () => ({
  type: actions.GET.BARBER_BOOKINGS,
});

export const putBarberBookings = (bookings) => ({
  type: actions.PUT.BARBER_BOOKINGS,
  payload: bookings,
});

export const cancelBooking = (bookingUid, clientUid, shopUid) => ({
  type: actions.CANCEL.BOOKING,
  payload: { bookingUid, clientUid, shopUid },
});

export const putLoadingStatus = (isLoading) => ({
  type: actions.PUT.LOADING_STATUS,
  isLoading,
});
