import { Alert } from "@vkontakte/vkui";
import { useRouter } from "@happysanta/router";
import { POPOUT_UPDATETOKEN } from "../../lib/routes";
import { wsQuery } from "../../lib/scripts/ws";
import { useSelector } from "react-redux";

export const UpdateTokenPopout = () => {
  const router = useRouter();
  const merchantData = useSelector((s) => s.game.merchantData);
  return (
    <Alert
      onClose={() => router.popPage()}
      className={POPOUT_UPDATETOKEN}
      header={"Сброс токена"}
      text={
        "Вы действительно заменить токен? По текущему токену больше нельзя будет получить доступ к мерчанту."
      }
      actionsLayout="horizontal"
      actions={[
        {
          title: "Cбросить",
          mode: 'destructive',
          autoclose: true,
          action: () => {
            wsQuery("developers:access_token", {
              merchant_id: -Number(merchantData.group_id),
            });
          },
        },
        {
          title: "Отменить",
          autoclose: true,
          mode: "cancel",
        },
      ]}
    ></Alert>
  );
};
