import { View } from "@vkontakte/vkui";
import { PANEL_TRANSFER, POPOUT_SENDCOINS } from "../../lib/routes";
import { useLocation, useRouter } from "@happysanta/router";
import { TransferPanel } from "./Transfer.panel";
import { SendCoinPopout } from "./SendCoins.popout";

export const TransferView = ({ id }) => {
  const router = useRouter();
  const location = useLocation();
  const popout = (() => {
    const activePopout = location.getPopupId();
    if (activePopout === POPOUT_SENDCOINS) {
      return <SendCoinPopout />;
    }
  })();
  return (
    <View
      id={id}
      onSwipeBack={() => router.popPage()}
      history={location.hasOverlay() ? [] : location.getViewHistory(id)}
      activePanel={location.getViewActivePanel(id)}
      popout={popout}
    >
      <TransferPanel id={PANEL_TRANSFER} />
    </View>
  );
};
