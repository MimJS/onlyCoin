const init = {
  games: {},
  myMerchant: {},
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
    default:
      return state;
  }
};
