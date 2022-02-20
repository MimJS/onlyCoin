const init = {
  games: {},
  myMerchant: {},
  errorCreateMerchant: {},
  merchantData: {},
  tokenData: {},
};

export const gameReducer = (state = init, action) => {
  switch (action.type) {
    case "setGameData":
      return { ...state, ...action.payload };
    case "setRatingData":
      return { ...state, rating: action.payload };
    case "setGamesData":
      return { ...state, games: action.payload };
    case "setMyMerchant":
      return { ...state, myMerchant: action.payload };
    case "setErrorCreateMerchant":
      return { ...state, errorCreateMerchant: action.payload };
    case "setMerchantData":
      return { ...state, merchantData: action.payload };
    case "setTokenData":
      return { ...state, tokenData: action.payload };
    default:
      return state;
  }
};
