import { store } from "../redux";
import { PAGE_ERROR, PAGE_MAIN, router } from "../routes";

let ws = null;
let isConnected = false;

export const initWS = () => {
  const state = store.getState();
  console.log("init");
  if (ws && isConnected) {
    return;
  } else {
    ws = null;
  }
  const websocket = new WebSocket(
    state.config.ws_url + `?access_token=${state.config.access_token}`
  );
  ws = websocket;
  wsListener();
};

const wsListener = () => {
  ws.onopen = function open() {
    isConnected = true;
    store.dispatch({
      type: "setLoad",
      payload: true,
    });
  };

  ws.onclose = function close(e) {
    const innerIndex = router.history.getCurrentIndex();
    if (e.wasClean) {
      console.log(e.code, e.reason);
    } else {
      store.dispatch({
        type: "setErrorMessage",
        payload: "Разорвано соединение с сервером",
      });
      console.log(e);
    }
    store.dispatch({
      type: "setLoad",
      payload: false,
    });
    isConnected = false;
    ws = null;
    if (innerIndex > 0) {
      router.popPageToAndPush(-Number(innerIndex), PAGE_ERROR, {});
    } else {
      router.pushPage(PAGE_ERROR);
    }
  };

  ws.onerror = function error(e) {
    store.dispatch({
      type: "setErrorMessage",
      payload: "Ошибка подключения",
    });
    router.pushPage(PAGE_ERROR);
    console.log(e);
  };

  ws.onmessage = function message(msg) {
    msg = JSON.parse(msg.data);
    let args = msg[1];
    console.log(msg);
    const [type, action] = msg[0].split(":");
    console.log(type, action);
    switch (type) {
      case "players":
        switch (action) {
          case "init":
            store.dispatch({
              type: "setDbData",
              payload: args,
            });
            break;
          case "update":
            store.dispatch({
              type: "setDbData",
              payload: args,
            });
            break;
          default:
            return;
        }
        break;
      case "game":
        switch (action) {
          case "init":
            store.dispatch({
              type: "setGameData",
              payload: args,
            });
            break;
          case "update":
            store.dispatch({
              type: "setGameData",
              payload: args,
            });
            break;
          case "disconnect":
            store.dispatch({
              type: "setErrorMessage",
              payload: args.error_public,
            });
            break;
          default:
            return;
        }
        break;
      default:
        return;
    }
  };
};

export const wsQuery = (actionName = "", params = {}) => {
  if (ws) {
    ws.send(JSON.stringify([actionName, params]));
    return;
  } else {
    return;
  }
};

export const closeWs = () => {
  if (ws && isConnected) {
    ws.close(1000, "Work end");
    return;
  } else {
    return;
  }
};

export const getWs = () => {
  return {
    status: isConnected ? ws.readyState : 5,
    client: ws,
  };
};

window.test = () => {
  return router.history.getCurrentIndex();
};
