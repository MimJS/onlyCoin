import {
  Button,
  FormItem,
  FormStatus,
  Input,
  Panel,
  PanelHeader,
  PanelHeaderBack,
  PanelHeaderContent,
} from "@vkontakte/vkui";
import { useRouter } from "@happysanta/router";
import { useSelector } from "react-redux";
import { useState } from "react";
import { wsQuery } from "../../lib/scripts/ws";

export const CreateMerchantPanel = ({ id }) => {
  const router = useRouter();
  const string = useSelector((s) => s.game.myMerchant.create_string);
  const [vkId, setVkId] = useState("");
  const createStatus = useSelector((s) => s.game.errorCreateMerchant);
  const [loadButton, setLoadButton] = useState(false);
  const createMerchant = () => {
    setLoadButton(true);
    let id = vkId;
    if (id.indexOf("vk.com/") >= 0) {
      id = id.split("vk.com/")[1];
    }
    if (id.indexOf("vk.me/") >= 0) {
      id = id.split("vk.me/")[1];
    }
    wsQuery("developers:create", { group_shortname: id });
    setTimeout(() => {
      setLoadButton(false);
    }, 500);
  };
  return (
    <Panel id={id}>
      <PanelHeader
        left={<PanelHeaderBack onClick={() => router.popPage()} />}
        separator={false}
      >
        <PanelHeaderContent>Создать мерчант</PanelHeaderContent>
      </PanelHeader>
      <div className="panel--in">
        <FormStatus header={"Что такое мерчант?"} className="aboutMerchant">
          Мерчанты используются для приема автоматизированных платежей и
          проведения выплат. В отличии от кошелька, мерчанты привязаны к группе
          и в форме платежа отображается не Ваше имя, а именно сообщество.
          <br />
          <br />
          Для подтверждения прав на подключаемое сообщество необходимо добавить
          в его описание строку:
          <div className="code">{string}</div>
          <br />
          После подключения строку можно убрать.
        </FormStatus>
        <FormItem top="Введите ссылку на группу" style={{ marginTop: 15 }}>
          <Input
            placeholder="vk.com/myGroup"
            value={vkId}
            onChange={(e) => {
              const value = String(e.currentTarget.value).replace(
                /[^A-Za-z0-9/._:]/g,
                ""
              );
              setVkId(value);
            }}
          />
        </FormItem>
        <FormItem>
          <Button
            size="l"
            mode="primary"
            stretched
            className="createMerchant"
            disabled={vkId.length == 0 || loadButton ? true : false}
            onClick={() => createMerchant()}
            loading={loadButton}
          >
            Создать мерчант
          </Button>
        </FormItem>
        {createStatus.status == false ? (
          <FormStatus mode="error">{createStatus.error_public}</FormStatus>
        ) : null}
      </div>
    </Panel>
  );
};
