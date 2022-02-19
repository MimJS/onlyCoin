import { View } from "@vkontakte/vkui";
import { PANEL_ERROR } from "../../lib/routes";
import { useLocation, useRouter } from "@happysanta/router";
import { ErrorPanel } from "./Error.panel";

export const ErrorView = ({ id }) => {
  const router = useRouter();
  const location = useLocation();
  return (
    <View
      id={id}
      onSwipeBack={() => router.popPage()}
      history={location.hasOverlay() ? [] : location.getViewHistory(id)}
      activePanel={location.getViewActivePanel(id)}
    >
      <ErrorPanel id={PANEL_ERROR} />
    </View>
  );
};
