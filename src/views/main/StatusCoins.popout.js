import { Alert, Button, Placeholder } from "@vkontakte/vkui";
import { useRouter } from "@happysanta/router";
import { POPOUT_STATUSCOINS } from "../../lib/routes";
import { useSelector } from "react-redux";
import { Icon56CheckCircleOutline, Icon56ErrorOutline } from "@vkontakte/icons";

export const StatusCoinsPopout = () => {
  const router = useRouter();
  return (
    <Alert onClose={() => router.popPage()} className={POPOUT_STATUSCOINS}>
      <Placeholder
        icon={<Icon56CheckCircleOutline fill="#01c37d" />}
        action={
          <div className="buttons">
            <Button
              mode="primary"
              size="m"
              onClick={() => {
                router.popPage();
              }}
            >
              Закрыть
            </Button>
          </div>
        }
      >
        Вы успешно продали OnlyCoin
      </Placeholder>
    </Alert>
  );
};
