const init = {
  db: {},
  load: false,
  errorMessage: null,
  vkToken: null,
};

export const userReducer = (state = init, action) => {
  switch (action.type) {
    case "setDbData":
      return { ...state, db: action.payload };
    case "setLoad":
      return { ...state, load: action.payload };
    case "setErrorMessage":
      return { ...state, errorMessage: action.payload };
    case "setVkToken":
      return { ...state, vkToken: action.payload };
    default:
      return state;
  }
};
