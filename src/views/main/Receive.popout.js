import { Alert, Button, Placeholder } from "@vkontakte/vkui";
import { useRouter } from "@happysanta/router";
import { POPOUT_RECEIVE } from "../../lib/routes";
import { useSelector } from "react-redux";
import { Icon28ShareExternalOutline } from "@vkontakte/icons";
import { QRCode } from "react-qr-svg";
import bridge from "@vkontakte/vk-bridge";

export const ReceivePopout = () => {
  const router = useRouter();
  const dbData = useSelector((s) => s.user.db);
  const appId = useSelector((s) => s.config.app_id);
  const share = () => {
    bridge.send("VKWebAppShare", {
      link: `https://vk.com/app${appId}#send_` + dbData.id,
    });
  };
  return (
    <Alert onClose={() => router.popPage()} className={POPOUT_RECEIVE}>
      <span className="title">
        Для принятия перевода покажите данный QR-код, либо поделитесь ссылкой
      </span>
      <QRCode
        level="L"
        style={{ width: 200, display: "block", margin: "0 auto" }}
        value={`https://vk.com/app${appId}#send_` + dbData.id}
        cellClassPrefix="cellClass"
      />
      <div className="buttonWrapper">
        <Button
          size="m"
          mode="primary"
          before={<Icon28ShareExternalOutline width={24} height={24} />}
          onClick={() => share()}
        >
          Поделиться ссылкой
        </Button>
      </div>
    </Alert>
  );
};
