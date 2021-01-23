import { actions } from '../actions/Barber';

const initialState = {
  barberBookings: [],
  barberShop: null,
  isLoading: false,
};

export default function barberReducer(state = initialState, action = {}) {
  switch (action.type) {
    case actions.PUT.BARBER_SHOP:
      return {
        ...state,
        barberShop: action.payload,
      };

    case actions.PUT.BARBER_BOOKINGS:
      return {
        ...state,
        barberBookings: action.payload,
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
