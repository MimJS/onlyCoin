import {
  Panel,
  PanelHeader,
  SimpleCell,
  Avatar,
  PanelHeaderBack,
  PanelHeaderContent,
  PullToRefresh,
  Spinner,
  Link,
} from "@vkontakte/vkui";
import { useRouter } from "@happysanta/router";
import { useSelector } from "react-redux";
import {
  Icon20AddCircleFillBlue,
  Icon20QuestionCircleFillViolet,
} from "@vkontakte/icons";
import { useEffect, useState } from "react";
import { getGroupsVkData, numberFormat } from "../../lib/scripts/util";
import { wsQuery } from "../../lib/scripts/ws";
import { PAGE_CREATEMERCHANT, PAGE_SEEMERCHANT } from "../../lib/routes";

export const MyMerchantsPanel = ({ id }) => {
  const router = useRouter();
  const merchants = useSelector((s) => s.game.myMerchant);
  const [merchantsData, setMerchantsData] = useState({});
  const [load, setLoad] = useState(true);
  const [isFetch, setFetch] = useState(false);
  useEffect(() => {
    const getData = async (merchants) => {
      if (Object.keys(merchants).length == 0) {
        return;
      }
      if (merchants.count == 0) {
        return setLoad(false);
      }
      let ids = [];
      for (let i = 0; i < merchants.items.length; i++) {
        let data = merchants.items[i];
        if (ids.indexOf(Math.abs(data.id)) < 0) {
          ids.push(Math.abs(data.id));
        }
      }
      const res = await getGroupsVkData(ids);
      setMerchantsData(res);
      setLoad(false);
    };
    getData(merchants);
  }, [merchants]);
  const freshFunc = () => {
    setFetch(true);
    wsQuery("developers:get");
    setFetch(false);
  };
  const openMerhant = (id) => {
    wsQuery("developers:getById", { merchant_id: id });
    return router.pushPage(PAGE_SEEMERCHANT);
  };
  return (
    <Panel id={id}>
      <PanelHeader
        left={<PanelHeaderBack onClick={() => router.popPage()} />}
        separator={false}
      >
        <PanelHeaderContent>Мои мерчанты</PanelHeaderContent>
      </PanelHeader>
      <PullToRefresh isFetching={isFetch} onRefresh={() => freshFunc()}>
        <div className="panel--in">
          <div className="merchantList">
            {load ? (
              <Spinner
                size="small"
                style={{ marginTop: 30, marginBottom: 30 }}
              />
            ) : null}
            {!load && merchants.count > 0
              ? merchants.items.map((v, i) => {
                  const haveData =
                    typeof merchantsData[Math.abs(v.id)] !== "undefined";
                  const data = merchantsData[Math.abs(v.id)];
                  return (
                    <SimpleCell
                      key={i}
                      className="merchantCell"
                      before={
                        <Avatar
                          size={38}
                          src={haveData ? data.photo_100 : null}
                        />
                      }
                      onClick={() => openMerhant(v.id)}
                      description={`${numberFormat(v.coins)} OC`}
                      hasHover={false}
                      hasActive={false}
                    >
                      {haveData ? data.name : `@public${Math.abs(v.id)}`}
                    </SimpleCell>
                  );
                })
              : null}
            {!load && merchants.count == 0 ? (
              <span className="info">Мерчантов нет</span>
            ) : null}
          </div>

          <div className="toolList">
            <div
              className="toolBlock"
              onClick={() => {
                router.pushPage(PAGE_CREATEMERCHANT);
              }}
            >
              <Icon20AddCircleFillBlue width={24} height={24} />
              <span className="text">Создать мерчант</span>
            </div>
            <Link
              hasActive={false}
              hasHover={false}
              target="_blank"
              href="https://github.com/sanyok12345/vkonlycoin-api"
            >
              <div className="toolBlock">
                <Icon20QuestionCircleFillViolet width={24} height={24} />
                <span className="text">Документация</span>
              </div>
            </Link>
          </div>
        </div>
      </PullToRefresh>
    </Panel>
  );
};
