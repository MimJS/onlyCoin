import { store } from "../redux";
import {
  PAGE_ERROR,
  PAGE_MAIN,
  PAGE_TRANSFER,
  POPOUT_SENDCOINS,
  POPOUT_STATUSCOINS,
  POPOUT_SUCESSTRANSFER,
  router,
} from "../routes";

let ws = null;
let isConnected = false;

export const initWS = () => {
  const state = store.getState();

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
    } else {
      store.dispatch({
        type: "setErrorMessage",
        payload: "Разорвано соединение с сервером",
      });
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
  };

  ws.onmessage = function message(msg) {
    msg = JSON.parse(msg.data);
    let args = msg[1];

    const [type, action] = msg[0].split(":");

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
      case "store":
        switch (action) {
          case "success":
            router.replacePopup(POPOUT_STATUSCOINS);
            break;
          case "false":
            store.dispatch({
              type: "setStoreStatus",
              payload: {
                status: false,
                error_msg: args.error_public,
              },
            });
            break;
          default:
            return;
        }
        break;
      case "transfers":
        switch (action) {
          case "friends":
            store.dispatch({
              type: "setFriendsData",
              payload: args.items,
            });
            break;
          case "friendsGetById":
            store.dispatch({
              type: "setGlobalTransferData",
              payload: args.items,
            });
            break;
          case "prepare":
            const transferData = store.getState().user.transferUrlData;

            router.pushPage(PAGE_TRANSFER);
            router.pushPopup(POPOUT_SENDCOINS, transferData);
            break;
          case "success":
            router.replacePopup(POPOUT_SUCESSTRANSFER, {
              data: args.response[0],
            });
            break;
          case "false":
            store.dispatch({
              type: "setTransferStatus",
              payload: {
                status: false,
                error_msg: args.error_public,
              },
            });
            break;
          default:
            return;
        }
        break;
      case "developers":
        switch (action) {
          case "get":
            store.dispatch({
              type: "setMyMerchant",
              payload: args,
            });
            break;
          case "create":
            if (args.status == false) {
              store.dispatch({
                type: "setErrorCreateMerchant",
                payload: args,
              });
            } else {
              if (
                router.getCurrentLocation().route.pageId == "/createmerchant"
              ) {
                router.popPage();
              }
            }
            break;
          case "getById":
            store.dispatch({
              type: "setMerchantData",
              payload: args.response[0],
            });
            break;
          case "access_token":
            store.dispatch({
              type: "setTokenData",
              payload: {
                token: args.access_token,
                hide: false,
              },
            });
            break;
          case "delete":
            if (router.getCurrentLocation().route.pageId == "/seemerchant") {
              if (
                Object.keys(router.getCurrentLocation().route.params).length > 0
              ) {
                router.popPageTo(-2);
              } else {
                router.popPage();
              }
            }
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
          case "catalog":
            store.dispatch({
              type: "setGamesData",
              payload: args,
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
    isConnected: isConnected,
  };
};
