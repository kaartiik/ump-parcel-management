export const actions = {
  GET: {
    BARBER_SHOP: 'GET_BARBER_SHOP',
    BARBER_BOOKINGS: 'GET_BARBER_BOOKINGS',
  },
  PUT: {
    BARBER_SHOP: 'PUT_BARBER_SHOP',
    BARBER_BOOKINGS: 'PUT_BARBER_BOOKINGS',
    LOADING_STATUS: 'PUT_LOADING_STATUS',
  },
  ADD: {
    BARBER_SHOP: 'ADD_BARBER_SHOP',
  },
  EDIT: {
    BARBER_SHOP: 'EDIT_BARBER_SHOP',
  },
  UPDATE_BOOKING_STATUS: 'UPDATE_BOOKING_STATUS',
};

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

export const getBarberShop = () => ({
  type: actions.GET.BARBER_SHOP,
});

export const putBarberShop = (shop) => ({
  type: actions.PUT.BARBER_SHOP,
  payload: shop,
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

export const putLoadingStatus = (isLoading) => ({
  type: actions.PUT.LOADING_STATUS,
  isLoading,
});
