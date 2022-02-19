import { View } from "@vkontakte/vkui";
import { PANEL_RATING } from "../../lib/routes";
import { useLocation, useRouter } from "@happysanta/router";
import { RatingPanel } from "./Rating.panel";

export const RatingView = ({ id }) => {
  const router = useRouter();
  const location = useLocation();
  return (
    <View
      id={id}
      onSwipeBack={() => router.popPage()}
      history={location.hasOverlay() ? [] : location.getViewHistory(id)}
      activePanel={location.getViewActivePanel(id)}
    >
      <RatingPanel id={PANEL_RATING} />
    </View>
  );
};
