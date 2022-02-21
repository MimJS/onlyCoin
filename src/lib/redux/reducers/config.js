const init = {
  xhr_url: "https://coins.vkonlyplay.ru/capi.php",
  ws_url: "wss://coins.vkonlyplay.ru/websocket.php",
  access_token: null,
  app_id: 8083387,
};

export const configReducer = (state = init, action) => {
  switch (action.type) {
    case "setAccessToken":
      return { ...state, access_token: action.payload };
    default:
      return state;
  }
};
