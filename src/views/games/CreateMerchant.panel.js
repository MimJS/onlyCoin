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

export const CreateMerchantPanel = ({ id }) => {
  const router = useRouter();
  const string = useSelector((s) => s.game.myMerchant.create_string);
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
        <FormItem top="Введите ссылку на группу" style={{ marginTop:15 }}>
          <Input placeholder="vk.com/myGroup" />
        </FormItem>
        <FormItem>
          <Button size="l" mode="primary" stretched className="createMerchant">
            Создать мерчант
          </Button>
        </FormItem>
      </div>
    </Panel>
  );
};
