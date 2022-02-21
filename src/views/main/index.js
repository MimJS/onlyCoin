import { ScreenSpinner, View } from "@vkontakte/vkui";
import { MainPanel } from "./Main.panel";
import {
  PANEL_MAIN,
  POPOUT_BUYCOINS,
  POPOUT_RECEIVE,
  POPOUT_SELLCOINS,
  POPOUT_STATUSCOINS,
} from "../../lib/routes";
import { useLocation, useRouter } from "@happysanta/router";
import { useSelector } from "react-redux";
import { BuyCoinsPopout } from "./BuyCoins.popout";
import { SellCoinsPopout } from "./SellCoins.popout";
import { StatusCoinsPopout } from "./StatusCoins.popout";
import { ReceivePopout } from "./Receive.popout";

export const MainView = ({ id }) => {
  const router = useRouter();
  const location = useLocation();
  const isLoad = useSelector((s) => s.user.load);
  const popout = (() => {
    const activePopout = location.getPopupId();
    if (activePopout === POPOUT_BUYCOINS) {
      return <BuyCoinsPopout />;
    }
    if (activePopout === POPOUT_SELLCOINS) {
      return <SellCoinsPopout />;
    }
    if (activePopout === POPOUT_STATUSCOINS) {
      return <StatusCoinsPopout />;
    }
    if (activePopout === POPOUT_RECEIVE) {
      return <ReceivePopout />;
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
