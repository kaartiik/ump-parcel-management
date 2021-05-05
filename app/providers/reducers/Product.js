import { actions } from '../actions/Product';

const initialState = {
  allProductsOri: [],
  allProducts: [],
  myProducts: [],
  productName: '',
  productUid: '',
  category: '',
  sellType: '',
  description: '',
  price: '',
  meetUpLocation: '',
  owner_uuid: '',
  productImages: [],
  sellerInfo: null,
  currentProduct: null,
  isLoading: false,
};

export default function productReducer(state = initialState, action = {}) {
  switch (action.type) {
    case actions.PUT.ALL_PRODUCTS_ORI:
      return {
        ...state,
        allProductsOri: action.payload,
      };

    case actions.PUT.ALL_PRODUCTS:
      return {
        ...state,
        allProducts: action.payload,
      };

    case actions.PUT.MY_PRODUCTS:
      return {
        ...state,
        myProducts: action.payload,
      };

    case actions.PUT.CURRENT_PRODUCT:
      return {
        ...state,
        currentProduct: action.payload,
      };

    case actions.PUT.PRODUCT_USER_INFO:
      return {
        ...state,
        sellerInfo: action.payload,
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
