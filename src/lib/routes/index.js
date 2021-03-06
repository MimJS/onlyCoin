import { Page, Router } from "@happysanta/router";
import { store } from "../redux";
import { getToken, getUserVKData, isAuth } from "../scripts/util";
import { wsQuery } from "../scripts/ws";

export const PAGE_MAIN = "/";
export const PAGE_RATING = "/rating";
export const PAGE_TRANSFER = "/transfer";
export const PAGE_TRANSFERURL = "/send_(.*)";
export const PAGE_ERROR = "/error";
export const PAGE_GAMES = "/games";
export const PAGE_MYMERCHANT = "/mymerchant";
export const PAGE_CREATEMERCHANT = "/createmerchant";
export const PAGE_SEEMERCHANT = "/seemerchant";

export const VIEW_MAIN = "viewMain";
export const VIEW_RATING = "viewRating";
export const VIEW_TRANSFER = "viewTransfer";
export const VIEW_ERROR = "viewError";
export const VIEW_GAMES = "viewGames";

export const PANEL_MAIN = "panelMain";
export const PANEL_RATING = "panelRating";
export const PANEL_TRANSFER = "panelTransfer";
export const PANEL_ERROR = "panelError";
export const PANEL_GAMES = "panelGames";
export const PANEL_MYMERCHANT = "panelMyMerchant";
export const PANEL_CREATEMERCHANT = "panelCreateMerchant";
export const PANEL_SEEMERCHANT = "panelSeeMerchant";

export const POPOUT_BUYCOINS = "popout_buyCoins";
export const POPOUT_SELLCOINS = "popout_sellCoins";
export const POPOUT_STATUSCOINS = "popout_statusCoins";
export const POPOUT_UPDATETOKEN = "popout_updateToken";
export const POPOUT_DELETEMERCHANT = "popout_deleteMerchant";
export const POPOUT_RECEIVE = "popout_receive";
export const POPOUT_SENDCOINS = "popout_sendCoins";
export const POPOUT_SUCESSTRANSFER = "popout_successTransfer";

const routes = {
  [PAGE_MAIN]: new Page(PANEL_MAIN, VIEW_MAIN),
  [PAGE_RATING]: new Page(PANEL_RATING, VIEW_RATING),
  [PAGE_TRANSFER]: new Page(PANEL_TRANSFER, VIEW_TRANSFER),
  [PAGE_TRANSFERURL]: new Page(PANEL_MAIN, VIEW_MAIN),
  [PAGE_ERROR]: new Page(PANEL_ERROR, VIEW_ERROR),
  [PAGE_GAMES]: new Page(PANEL_GAMES, VIEW_GAMES),
  [PAGE_MYMERCHANT]: new Page(PANEL_MYMERCHANT, VIEW_GAMES),
  [PAGE_CREATEMERCHANT]: new Page(PANEL_CREATEMERCHANT, VIEW_GAMES),
  [PAGE_SEEMERCHANT]: new Page(PANEL_SEEMERCHANT, VIEW_GAMES),
};

export const router = new Router(routes);

export const go = (page) => {
  return router.pushPage(`/${page}`);
};

export const returnToMainScreen = () => {
  const innerIndex = router.history.getCurrentIndex();
  router.popPageTo(-Number(innerIndex + 1), {});
  return;
};

// routes manage

router.onLeavePage(PAGE_ERROR, async () => {
  const state = await store.getState();
  if (state.user.db.id) {
    getToken(state.user.db.id);
  } else {
    const vkData = await getUserVKData();
    getToken(vkData.id);
  }
  return;
});

router.onLeavePage(PAGE_TRANSFERURL, () => {
  return wsQuery("players:update");
});

router.onEnterPage(PAGE_RATING, async () => {
  const isLogin = await isAuth();
  if (!isLogin) {
    return returnToMainScreen();
  }
  return wsQuery("game:update");
});

router.onLeavePage(PAGE_RATING, () => {
  return wsQuery("players:update");
});

router.onLeavePage(PAGE_TRANSFER, () => {
  return wsQuery("players:update");
});

router.onLeavePage(PAGE_GAMES, () => {
  return wsQuery("players:update");
});

router.onEnterPage(PAGE_MYMERCHANT, async () => {
  const isLogin = await isAuth();
  if (!isLogin) {
    return returnToMainScreen();
  }
  store.dispatch({
    type: "setMerchantData",
    payload: {},
  });
  store.dispatch({
    type: "setTokenData",
    payload: {
      token: null,
      hide: true,
    },
  });
  return wsQuery("developers:get");
});

router.onEnterPage(PAGE_CREATEMERCHANT, async () => {
  const isLogin = await isAuth();
  if (!isLogin) {
    return returnToMainScreen();
  }
  return store.dispatch({
    type: "setErrorCreateMerchant",
    payload: {},
  });
});

router.onEnterPage(PAGE_ERROR, async () => {
  const state = await store.getState();
  if (!state.user.errorMessage) {
    return returnToMainScreen();
  }
  return;
});

router.onEnterPage(PAGE_GAMES, async () => {
  const isLogin = await isAuth();
  if (!isLogin) {
    return returnToMainScreen();
  }
  return;
});

router.onEnterPage(PAGE_TRANSFER, async () => {
  const isLogin = await isAuth();
  if (!isLogin) {
    return returnToMainScreen();
  }
  return;
});

router.onEnterPage(PAGE_SEEMERCHANT, async () => {
  const isLogin = await isAuth();
  if (!isLogin) {
    return returnToMainScreen();
  }
  return;
});
