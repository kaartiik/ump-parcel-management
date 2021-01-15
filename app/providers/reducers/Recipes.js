import { actions } from '../actions/Recipes';

const initialState = {
  postFeed: [],
  isLoading: false,
};

export default function recipeReducer(state = initialState, action = {}) {
  switch (action.type) {
    case actions.PUT.RECIPES:
      return {
        ...state,
        postFeed: action.payload,
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
