import axios from "axios";
import { store } from "../redux";
import { router, PAGE_ERROR } from "../routes";
import { initWS, wsQuery } from "./ws";
import bridge from "@vkontakte/vk-bridge";

export const numberFormat = (num, around = false) => {
  if (around) {
    num = (num + "").replace(/[^0-9+\-Ee.]/g, "");
    let numFunc = String(Number(Number(num / 1000).toFixed(3)));
    return numFunc.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  } else {
    return Number(num / 1000)
      .toFixed(3)
      .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }
};

export const getToken = (id) => {
  const state = store.getState();
  axios
    .post(state.config.xhr_url, {
      action: "game:authorize",
      vk_query: window.location.search,
      vk_user_id: String(id),
    })
    .then(({ data }) => {
      if (data.status) {
        store.dispatch({
          type: "setAccessToken",
          payload: data.response.access_token,
        });
        initWS();
        return;
      } else {
        // error
        store.dispatch({
          type: "setErrorMessage",
          payload: "Невалидный токен",
        });
        return router.pushPage(PAGE_ERROR);
      }
    })
    .catch((e) => {
      store.dispatch({
        type: "setErrorMessage",
        payload: "Ошибка подключения к серверу",
      });
      return router.pushPage(PAGE_ERROR);
    });
};

export const getUserVKData = async () => {
  const data = await bridge.send("VKWebAppGetUserInfo");
  return data;
};

export const msToDate = (ms) => {
  const date = new Date(ms * 1000);
  let day = date.getDate();
  if (String(day).length == 1) {
    day = `0${day}`;
  }
  let month = date.getMonth() + 1;
  if (String(month).length == 1) {
    month = `0${month}`;
  }
  let year = String(date.getFullYear());
  let hour = date.getHours();
  if (String(hour).length == 1) {
    hour = `0${hour}`;
  }
  let min = date.getMinutes();
  if (String(min).length == 1) {
    min = `0${min}`;
  }
  return `${day}.${month}.${year} ${hour}:${min}`;
};

export const createVkToken = async () => {
  const state = await store.getState();
  const result = await bridge.send("VKWebAppGetAuthToken", {
    app_id: state.config.app_id,
    scope: "friends",
  });
  if (result.access_token) {
    store.dispatch({
      type: "setVkToken",
      payload: result.access_token,
    });
    return result.access_token;
  }
  return null;
};

export const getFriendsList = async () => {
  const state = await store.getState();
  let token = state.user.vkToken;
  let friendsData = {
    ids: [],
    data: {},
  };
  if (!state.user.vkToken) {
    token = await createVkToken();
  }
  if (!token) {
    return friendsData;
  }
  const result = await bridge.send("VKWebAppCallAPIMethod", {
    method: "friends.get",
    request_id: "onlyCoin_request_friends.get",
    params: {
      user_id: state.user.db.id,
      fields: "photo_100",
      count: 100,
      v: "5.131",
      access_token: token,
    },
  });
  if (result.response) {
    const friendsInfo = result.response.items;
    for (let i = 0; i < friendsInfo.length; i++) {
      let friendId = friendsInfo[i].id;
      friendsData.ids.push(friendId);
      friendsData.data[friendId] = friendsInfo[i];
    }
  }
  return friendsData;
};

export const getGroupsVkData = async (ids) => {
  const state = await store.getState();
  let groupsData = {};
  let token = state.user.vkToken;
  if (!state.user.vkToken) {
    token = await createVkToken();
  }
  if (!token) {
    return {};
  }
  const result = await bridge.send("VKWebAppCallAPIMethod", {
    method: "groups.getById",
    request_id: "onlyCoin_request_groups.get",
    params: {
      group_ids: ids.join(","),
      fields: "photo_100",
      v: "5.131",
      access_token: token,
    },
  });
  if (result.response) {
    const groupsInfo = result.response;
    for (let i = 0; i < ids.length; i++) {
      let groupId = ids[i];
      groupsData[groupId] = groupsInfo[i];
    }
    return groupsData;
  } else {
    return {};
  }
};

export const getUsersVkData = async (ids) => {
  const state = await store.getState();
  let usersData = {};
  let token = state.user.vkToken;
  if (!state.user.vkToken) {
    token = await createVkToken();
  }
  if (!token) {
    return {};
  }
  const result = await bridge.send("VKWebAppCallAPIMethod", {
    method: "users.get",
    request_id: "onlyCoin_request_users.get",
    params: {
      user_ids: ids.join(","),
      fields: "photo_100",
      v: "5.131",
      access_token: token,
    },
  });
  if (result.response) {
    const usersInfo = result.response;
    for (let i = 0; i < ids.length; i++) {
      let userId = ids[i];
      usersData[userId] = usersInfo[i];
    }
    return usersData;
  } else {
    return {};
  }
};

export const isNumeric = (n) => {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

export const formatNumber = (
  number,
  decimals = 0,
  dec_point = ".",
  separator = " "
) => {
  number = (number + "").replace(/[^0-9+\-Ee.]/g, "");
  let n = !isFinite(number) ? 0 : number,
    sep = typeof separator === "undefined" ? "," : separator,
    dec = typeof dec_point === "undefined" ? "." : dec_point,
    s = "";
  s = ("" + n).split(".");
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }

  return s.join(dec);
};

export const showAds = async () => {
  const res = await bridge
    .send("VKWebAppShowNativeAds", {
      ad_format: "reward",
      use_waterfall: true,
    })
    .then((data) => {
      if (data.result) {
        wsQuery("game:ads", { status: data.result });
        return true;
      } else {
        return false;
      }
    })
    .catch((error) => {
      return false;
    });
  return res;
};
