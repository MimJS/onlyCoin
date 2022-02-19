import { Panel, PanelHeader, Placeholder, Button } from "@vkontakte/vkui";
import { Icon56ErrorOutline } from "@vkontakte/icons";
import { useRouter } from "@happysanta/router";
import { useSelector } from "react-redux";

export const ErrorPanel = ({ id }) => {
  const router = useRouter();
  const errorMessage = useSelector((s) => s.user.errorMessage);
  return (
    <Panel id={id}>
      <PanelHeader separator={false}></PanelHeader>
      <Placeholder
        icon={<Icon56ErrorOutline fill={"#dd4a68"} />}
        header={"Ошибка"}
        action={
          <Button size="m" mode="primary" onClick={() => router.popPage()}>
            Переподключиться
          </Button>
        }
        stretched
      >
        {errorMessage}
      </Placeholder>
    </Panel>
  );
};
