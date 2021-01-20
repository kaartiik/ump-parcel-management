import { actions } from '../actions/Client';

const initialState = {
  barberShops: [],
  isLoading: false,
};

export default function clientReducer(state = initialState, action = {}) {
  switch (action.type) {
    case actions.PUT.BARBER_SHOPS:
      return {
        ...state,
        barberShops: action.payload,
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
