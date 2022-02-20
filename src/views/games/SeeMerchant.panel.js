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
import { useEffect, useState } from "react";
import { getGroupsVkData, numberFormat } from "../../lib/scripts/util";
import { Icon24UnblockOutline } from "@vkontakte/icons";
import { POPOUT_UPDATETOKEN, POPOUT_DELETEMERCHANT } from "../../lib/routes";

export const SeeMerchantPanel = ({ id }) => {
  const router = useRouter();
  const merchantData = useSelector((s) => s.game.merchantData);
  const [tempData, setTempData] = useState({});
  const tokenData = useSelector((s) => s.game.tokenData);
  const [load, setLoad] = useState(true);
  useEffect(() => {
    const getData = async (merchantData) => {
      if (
        Object.keys(merchantData).length == 0 ||
        Object.keys(tempData).length != 0
      ) {
        setLoad(true);
      }
      if (Object.keys(merchantData).length == 0) {
        return;
      }
      const res = await getGroupsVkData([merchantData.group_id]);
      setTempData(res[merchantData.group_id]);
      setLoad(false);
    };
    getData(merchantData);
  }, [merchantData]);
  const updateToken = () => {
    router.pushPopup(POPOUT_UPDATETOKEN);
  };
  const deleteMerchant = () => {
      router.pushPopup(POPOUT_DELETEMERCHANT)
  }
  return (
    <Panel id={id}>
      <PanelHeader
        left={<PanelHeaderBack onClick={() => router.popPage()} />}
        separator={false}
      >
        <PanelHeaderContent>
          {load ? "Загрузка..." : null}
          {!load && Object.keys(tempData).length > 0 ? tempData.name : null}
        </PanelHeaderContent>
      </PanelHeader>
      {!load ? (
        <div className="panel--in">
          <FormStatus header={"Баланс"}>
            {numberFormat(merchantData.coins)} OC
          </FormStatus>
          <FormStatus header={"ID мерчанта"}>
            <span className="merchantId">{merchantData.public_id}</span>
          </FormStatus>
          <FormStatus header={"Токен мерчанта"}>
            {tokenData.hide ? (
              <>
                Токен скрыт. Вы можете сбросить текущий токен и получить новый.
                <br />
                <Button
                  className="createToken"
                  size="s"
                  mode="primary"
                  onClick={() => updateToken()}
                >
                  Обновить токен
                </Button>
              </>
            ) : (
              <>
                <div className="token">{tokenData.token}</div>
                Сохраните сейчас данный токен, т.к. больше его нельзя будет
                никак узнать
              </>
            )}
          </FormStatus>
          <Button
            size="l"
            mode="destructive"
            className="deleteMerchant"
            before={<Icon24UnblockOutline />}
            stretched
            onClick={() => deleteMerchant()}
          >
            Удалить мерчант
          </Button>
        </div>
      ) : null}
    </Panel>
  );
};
