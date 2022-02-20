import { Alert } from "@vkontakte/vkui";
import { useRouter } from "@happysanta/router";
import { POPOUT_DELETEMERCHANT } from "../../lib/routes";
import { wsQuery } from "../../lib/scripts/ws";
import { useSelector } from "react-redux";

export const DeleteMerchantPopout = () => {
  const router = useRouter();
  const merchantData = useSelector((s) => s.game.merchantData);
  return (
    <Alert
      onClose={() => router.popPage()}
      className={POPOUT_DELETEMERCHANT}
      header={"Удаление мерчанта"}
      text={
        "Вы действительно хотите удалить мерчант? Данное действие необратимо!"
      }
      actionsLayout="horizontal"
      actions={[
        {
          title: "Удалить",
          mode: "destructive",
          autoclose: true,
          action: () => {
            wsQuery("developers:delete", {
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
