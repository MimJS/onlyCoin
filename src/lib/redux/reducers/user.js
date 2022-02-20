const init = {
  db: {},
  load: false,
  errorMessage: null,
  vkToken: null,
  storeStatus: {
    status: true,
  },
  transferStatus: {
    status: true,
  },
  friendsData: [],
  globalTransferData: [],
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
    case "setStoreStatus":
      return { ...state, storeStatus: action.payload };
    case "setFriendsData":
      return { ...state, friendsData: action.payload };
    case "setGlobalTransferData":
      return { ...state, globalTransferData: action.payload };
    case "setTransferStatus":
      return { ...state, transferStatus: action.payload };
    default:
      return state;
  }
};
