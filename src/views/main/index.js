import { ScreenSpinner, View } from "@vkontakte/vkui";
import { MainPanel } from "./Main.panel";
import { PANEL_MAIN } from "../../lib/routes";
import { useLocation, useRouter } from "@happysanta/router";
import { useSelector } from "react-redux";
import { useState } from "react";

export const MainView = ({ id }) => {
  const router = useRouter();
  const location = useLocation();
  const isLoad = useSelector((s) => s.user.load);
  const [popout, setPopout] = useState(null);
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
