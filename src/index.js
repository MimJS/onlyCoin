import React from "react";
import ReactDOM from "react-dom";
import bridge from "@vkontakte/vk-bridge";
import App from "./App";
import { RouterContext } from "@happysanta/router";
import { router } from "./lib/routes";
import { Provider } from "react-redux";
import { store } from "./lib/redux";
import { ConfigProvider } from "@vkontakte/vkui";

// Init VK  Mini App
bridge.send("VKWebAppInit");

// Init router
router.start();

ReactDOM.render(
  <Provider store={store}>
    <RouterContext.Provider value={router}>
      <ConfigProvider platform="android">
        <App />
      </ConfigProvider>
    </RouterContext.Provider>
  </Provider>,
  document.getElementById("root")
);
