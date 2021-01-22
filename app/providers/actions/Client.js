export const actions = {
  GET: {
    BARBER_SHOPS: 'GET_BARBER_SHOPS',
  },
  PUT: {
    BARBER_SHOPS: 'PUT_BARBER_SHOPS',
    CHOSEN_SHOP: 'PUT_CHOSEN_SHOP',
    CHOSEN_DATE: 'PUT_CHOSEN_DATE',
    LOADING_STATUS: 'PUT_LOADING_STATUS',
  },
  CONFIRM_BOOKING: 'CONFIRM_BOOKING',
  UPLOAD: {
    RECIPES_IMAGES: 'UPLOAD_RECIPES_WITH_IMAGES',
    EDITED_RECIPES_IMAGES: 'UPLOAD_EDITED_RECIPES_WITH_IMAGES',
  },
  DELETE: {
    RECIPES: 'DELETE_RECIPES',
    SINGLE_RECIPES_IMAGE: 'SINGLE_RECIPES_IMAGE',
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
    service,
    timestamp,
    uuid,
    userName,
    userMobile,
    userEmail,
  },
});

export const uploadRecipeWithImages = (
  recipeType,
  title,
  ingredients,
  description,
  postImages
) => ({
  type: actions.UPLOAD.RECIPES_IMAGES,
  payload: { recipeType, title, description, ingredients, postImages },
});

export const uploadEditedRecipeWithImages = (
  title,
  description,
  postImages,
  ingredients,
  removedPostImgs,
  postId
) => ({
  type: actions.UPLOAD.EDITED_RECIPES_IMAGES,
  payload: {
    title,
    description,
    postImages,
    ingredients,
    removedPostImgs,
    postId,
  },
});

export const deleteRecipe = (uuid, postId, postImages) => ({
  type: actions.DELETE.RECIPES,
  payload: { uuid, postId, postImages },
});

export const deleteRecipeImage = (uuid, postId, imageKey, imageKeyWithExt) => ({
  type: actions.DELETE.SINGLE_RECIPES_IMAGE,
  payload: { uuid, postId, imageKey, imageKeyWithExt },
});

export const putLoadingStatus = (isLoading) => ({
  type: actions.PUT.LOADING_STATUS,
  isLoading,
});
