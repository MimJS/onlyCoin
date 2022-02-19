const init = {};

export const gameReducer = (state = init, action) => {
  switch (action.type) {
    case "setGameData":
      return action.payload;
    case "setRatingData":
      return { ...state, rating: action.payload };
    default:
      return state;
  }
};
