import { Page, Router } from "@happysanta/router";
import { store } from "../redux";
import { getToken, getUserVKData } from "../scripts/util";
import { wsQuery } from "../scripts/ws";

export const PAGE_MAIN = "/";
export const PAGE_RATING = "/rating";
export const PAGE_TRANSFER = "/transfer";
export const PAGE_ERROR = "/error";

export const VIEW_MAIN = "viewMain";
export const VIEW_RATING = "viewRating";
export const VIEW_TRANSFER = "viewTransfer";
export const VIEW_ERROR = "viewError";

export const PANEL_MAIN = "panelMain";
export const PANEL_RATING = "panelRating";
export const PANEL_TRANSFER = "panelTransfer";
export const PANEL_ERROR = "panelError";

export const POPOUT_BUYCOINS = "popout_buyCoins";

const routes = {
  [PAGE_MAIN]: new Page(PANEL_MAIN, VIEW_MAIN),
  [PAGE_RATING]: new Page(PANEL_RATING, VIEW_RATING),
  [PAGE_TRANSFER]: new Page(PANEL_TRANSFER, VIEW_TRANSFER),
  [PAGE_ERROR]: new Page(PANEL_ERROR, VIEW_ERROR),
};

export const router = new Router(routes);

export const go = (page) => {
  return router.pushPage(`/${page}`);
};

// routes manage

router.onLeavePage(PAGE_ERROR, async () => {
  const state = store.getState();
  if (state.user.db.id) {
    getToken(state.user.db.id);
  } else {
    const vkData = await getUserVKData();
    getToken(vkData.id);
  }
});

router.onLeavePage(PAGE_RATING, () => {
  return wsQuery("players:update");
});
