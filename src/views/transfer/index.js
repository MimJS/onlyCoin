import { View } from "@vkontakte/vkui";
import {
  PANEL_TRANSFER,
  POPOUT_SENDCOINS,
  POPOUT_SUCESSTRANSFER,
} from "../../lib/routes";
import { useLocation, useRouter } from "@happysanta/router";
import { TransferPanel } from "./Transfer.panel";
import { SendCoinPopout } from "./SendCoins.popout";
import { SuccessTransferPopout } from "./SuccessTransfer.popout";

export const TransferView = ({ id }) => {
  const router = useRouter();
  const location = useLocation();
  const popout = (() => {
    const activePopout = location.getPopupId();
    if (activePopout === POPOUT_SENDCOINS) {
      return <SendCoinPopout />;
    }
    if (activePopout === POPOUT_SUCESSTRANSFER) {
      return <SuccessTransferPopout />;
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
