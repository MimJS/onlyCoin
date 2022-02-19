import React, { useEffect } from "react";
import bridge from "@vkontakte/vk-bridge";
import { AdaptivityProvider, AppRoot, Root } from "@vkontakte/vkui";

import "@vkontakte/vkui/dist/vkui.css";
import "./lib/styles/index.scss";

import { useLocation, useRouter } from "@happysanta/router";
import { MainView } from "./views/main";
import { VIEW_ERROR, VIEW_GAMES, VIEW_MAIN, VIEW_RATING } from "./lib/routes";
import { ErrorView } from "./views/error";
import { getToken, getUserVKData } from "./lib/scripts/util";
import { RatingView } from "./views/rating";
import { GamesView } from "./views/games";

const App = () => {
  const location = useLocation();
  const router = useRouter();

  useEffect(() => {
    bridge.subscribe(({ detail: { type, data } }) => {
      if (type === "VKWebAppUpdateConfig") {
        const schemeAttribute = document.createAttribute("scheme");
        schemeAttribute.value = data.scheme ? data.scheme : "client_light";
        document.body.attributes.setNamedItem(schemeAttribute);
      }
    });
    async function fetchData() {
      const user = await getUserVKData();
      getToken(user.id);
    }
    fetchData();
  }, []);

  return (
    <AdaptivityProvider hasMouse={false}>
      <AppRoot>
        <Root activeView={location.getViewId()}>
          <MainView id={VIEW_MAIN} />
          <RatingView id={VIEW_RATING} />
          <GamesView id={VIEW_GAMES} />
          <ErrorView id={VIEW_ERROR} />
        </Root>
      </AppRoot>
    </AdaptivityProvider>
  );
};

export default App;
