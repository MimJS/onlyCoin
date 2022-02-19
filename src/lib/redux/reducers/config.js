const init = {
  xhr_url: "https://4324-83-243-91-59.ngrok.io/capi.php",
  ws_url: "wss://4324-83-243-91-59.ngrok.io/websocket.php",
  access_token: null,
  app_id: 8083387
};

export const configReducer = (state = init, action) => {
  switch (action.type) {
    case "setAccessToken":
      return { ...state, access_token: action.payload };
    default:
      return state;
  }
};
