import { ScreenSpinner, View } from "@vkontakte/vkui";
import { MainPanel } from "./Main.panel";
import { PANEL_MAIN, POPOUT_BUYCOINS } from "../../lib/routes";
import { useLocation, useRouter } from "@happysanta/router";
import { useSelector } from "react-redux";
import { useState } from "react";
import { BuyCoinsPopout } from "./BuyCoins.popout";

export const MainView = ({ id }) => {
  const router = useRouter();
  const location = useLocation();
  const isLoad = useSelector((s) => s.user.load);
  const popout = (() => {
    if (location.getPopupId() === POPOUT_BUYCOINS) {
      return <BuyCoinsPopout />;
    }
  })();
  return (
    <View
      id={id}
      onSwipeBack={() => router.popPage()}
      history={location.hasOverlay() ? [] : location.getViewHistory(id)}
      activePanel={location.getViewActivePanel(id)}
      popout={!isLoad ? <ScreenSpinner size="medium" /> : popout}
    >
      <MainPanel id={PANEL_MAIN} />
    </View>
  );
};
