import { View } from "@vkontakte/vkui";
import { PANEL_CREATEMERCHANT, PANEL_GAMES, PANEL_MYMERCHANT } from "../../lib/routes";
import { useLocation, useRouter } from "@happysanta/router";
import { GamesPanel } from "./Games.panel";
import { MyMerchantsPanel } from "./MyMerchants.panel";
import { CreateMerchantPanel } from "./CreateMerchant.panel";

export const GamesView = ({ id }) => {
  const router = useRouter();
  const location = useLocation();
  return (
    <View
      id={id}
      onSwipeBack={() => router.popPage()}
      history={location.hasOverlay() ? [] : location.getViewHistory(id)}
      activePanel={location.getViewActivePanel(id)}
    >
      <GamesPanel id={PANEL_GAMES} />
      <MyMerchantsPanel id={PANEL_MYMERCHANT} />
      <CreateMerchantPanel id={PANEL_CREATEMERCHANT} />
    </View>
  );
};
