import { combineReducers } from "redux";
import { configReducer } from "./config";
import { gameReducer } from "./game";
import { userReducer } from "./user";

export const rootReducer = combineReducers({
  user: userReducer,
  config: configReducer,
  game: gameReducer,
});
