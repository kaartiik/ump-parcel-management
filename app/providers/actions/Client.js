export const actions = {
  GET: {
    BARBER_SHOPS: 'GET_BARBER_SHOPS',
    BOOKINGS: 'GET_BOOKINGS',
  },
  PUT: {
    BARBER_SHOPS: 'PUT_BARBER_SHOPS',
    CHOSEN_SHOP: 'PUT_CHOSEN_SHOP',
    CHOSEN_DATE: 'PUT_CHOSEN_DATE',
    BOOKINGS: 'PUT_BOOKINGS',
    LOADING_STATUS: 'PUT_LOADING_STATUS',
  },
  CONFIRM_BOOKING: 'CONFIRM_BOOKING',
  CANCEL: {
    BOOKING: 'CANCEL_BOOKING',
  },
};

export const getBarberShops = () => ({
  type: actions.GET.BARBER_SHOPS,
});

export const getRefreshedRecipes = () => ({
  type: actions.GET.REFRESHED_RECIPES,
});

export const putBarberShops = (shops) => ({
  type: actions.PUT.BARBER_SHOPS,
  payload: shops,
});

export const putChosenShop = (shop) => ({
  type: actions.PUT.CHOSEN_SHOP,
  payload: shop,
});

export const putChosenDate = (date) => ({
  type: actions.PUT.CHOSEN_DATE,
  payload: date,
});

export const confirmBooking = (
  shopUid,
  ownerUuid,
  service,
  timestamp,
  uuid,
  userName,
  userMobile,
  userEmail
) => ({
  type: actions.CONFIRM_BOOKING,
  payload: {
    shopUid,
    ownerUuid,
    service,
    timestamp,
    uuid,
    userName,
    userMobile,
    userEmail,
  },
});

export const getBookings = () => ({
  type: actions.GET.BOOKINGS,
});

export const putBookings = (bookings) => ({
  type: actions.PUT.BOOKINGS,
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
