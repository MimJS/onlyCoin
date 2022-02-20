import { View } from "@vkontakte/vkui";
import {
  PANEL_CREATEMERCHANT,
  PANEL_GAMES,
  PANEL_MYMERCHANT,
  PANEL_SEEMERCHANT,
  POPOUT_DELETEMERCHANT,
  POPOUT_UPDATETOKEN,
} from "../../lib/routes";
import { useLocation, useRouter } from "@happysanta/router";
import { GamesPanel } from "./Games.panel";
import { MyMerchantsPanel } from "./MyMerchants.panel";
import { CreateMerchantPanel } from "./CreateMerchant.panel";
import { SeeMerchantPanel } from "./SeeMerchant.panel";
import { UpdateTokenPopout } from "./UpadateToken.popout";
import { DeleteMerchantPopout } from "./DeleteMerchant.popout";

export const GamesView = ({ id }) => {
  const router = useRouter();
  const location = useLocation();
  const popout = (() => {
    const activePopout = location.getPopupId();
    if (activePopout === POPOUT_UPDATETOKEN) {
      return <UpdateTokenPopout />;
    }
    if(activePopout === POPOUT_DELETEMERCHANT) {
      return <DeleteMerchantPopout />
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
      <GamesPanel id={PANEL_GAMES} />
      <MyMerchantsPanel id={PANEL_MYMERCHANT} />
      <CreateMerchantPanel id={PANEL_CREATEMERCHANT} />
      <SeeMerchantPanel id={PANEL_SEEMERCHANT} />
    </View>
  );
};
