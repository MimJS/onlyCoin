import {
  Avatar,
  Button,
  Panel,
  PanelHeader,
  PanelHeaderContent,
  PullToRefresh,
  Snackbar,
  Spinner,
} from "@vkontakte/vkui";
import { useSelector, useDispatch } from "react-redux";
import {
  getGroupsVkData,
  getUsersVkData,
  numberFormat,
  showAds,
} from "../../lib/scripts/util";
import {
  Icon28FavoriteOutline,
  Icon28MoneyRequestOutline,
  Icon28MoneySendOutline,
  Icon28GameOutline,
  Icon28GiftOutline,
  Icon24ErrorCircleOutline,
  Icon24GiftOutline,
} from "@vkontakte/icons";
import { useEffect, useState } from "react";
import { wsQuery } from "../../lib/scripts/ws";
import {
  go,
  PAGE_TRANSFER,
  POPOUT_BUYCOINS,
  POPOUT_SELLCOINS,
  PAGE_MAIN,
  POPOUT_RECEIVE,
} from "../../lib/routes";
import { OperationComponent } from "./Operation.component";
import { useParams, useRouter, useLocation } from "@happysanta/router";

export const MainPanel = ({ id, changePopout }) => {
  const dbData = useSelector((s) => s.user.db);
  const isLoad = useSelector((s) => s.user.load);
  const [activeInfo, setActiveInfo] = useState(0);
  const [isFetch, setFetch] = useState(false);
  const [usersData, setUsersData] = useState({});
  const [groupsData, setGroupsData] = useState({});
  const [snackBar, setSnackBar] = useState(null);
  const [hideAdsButton, setHideAdsButton] = useState(false);
  const router = useRouter();
  const params = useParams();
  const dispatch = useDispatch();
  const location = useLocation();
  const menu = [
    {
      icon: <Icon28FavoriteOutline width={32} height={32} fill="white" />,
      name: "Топ",
      action: () => {
        go("rating");
        return;
      },
    },
    {
      icon: <Icon28MoneySendOutline width={32} height={32} fill="white" />,
      name: "Перевод",
      action: () => {
        router.pushPage(PAGE_TRANSFER);
        return;
      },
    },
    {
      icon: <Icon28MoneyRequestOutline width={32} height={32} fill="white" />,
      name: "Получить",
      action: () => {
        router.pushPopup(POPOUT_RECEIVE);
        return;
      },
    },
    {
      icon: <Icon28GameOutline width={32} height={32} fill="white" />,
      name: "Игры",
      action: () => {
        wsQuery("game:catalog");
        go("games");
        return;
      },
    },
  ];
  const ads = async () => {
    if (hideAdsButton == true) {
      return;
    }
    setHideAdsButton(true);
    const res = await showAds();
    setHideAdsButton(false);
    if (res == false) {
      setSnackBar(
        <Snackbar
          onClose={() => setSnackBar(null)}
          before={<Icon24ErrorCircleOutline fill="#dd4a68" />}
        >
          Произошла ошибка при показе рекламы
        </Snackbar>
      );
    }
  };
  useEffect(() => {
    const sortUserOperation = async (transactions, myId) => {
      if (!transactions) {
        return;
      }
      transactions = transactions.filter((e) => {
        return e.to_id > 0 && e.from_id > 0;
      });
      if (transactions.length == 0) {
        return;
      }
      let ids = [];
      for (let i = 0; i < transactions.length; i++) {
        let data = transactions[i];
        if (!data.type) {
          if (data.from_id !== dbData.id) {
            if (ids.indexOf(data.from_id) < 0) {
              ids.push(data.from_id);
            }
          } else {
            if (ids.indexOf(data.to_id) < 0) {
              ids.push(data.to_id);
            }
          }
        }
      }
      const res = await getUsersVkData(ids);

      setUsersData(res);
    };
    const sortGroupsOperation = async (transactions, myId) => {
      if (!transactions) {
        return;
      }
      transactions = transactions.filter((e) => {
        return e.to_id < 0 || e.from_id < 0;
      });
      if (transactions.length == 0) {
        return;
      }
      let ids = [];
      for (let i = 0; i < transactions.length; i++) {
        let data = transactions[i];
        if (!data.type) {
          if (data.from_id !== dbData.id) {
            if (ids.indexOf(Math.abs(data.from_id)) < 0) {
              ids.push(Math.abs(data.from_id));
            }
          } else {
            if (ids.indexOf(Math.abs(data.to_id)) < 0) {
              ids.push(Math.abs(data.to_id));
            }
          }
        }
      }
      const res = await getGroupsVkData(ids);
      setGroupsData(res);
    };
    const checkTransferUrl = async () => {
      if (params[0]) {
        let [id, sum, payload, isLock] = params[0].split("_");

        id = Number(id);
        if (isNaN(id)) {
          return router.replacePage(PAGE_MAIN);
        }
        id = Math.floor(id);
        const res =
          id > 0
            ? await getUsersVkData([id])
            : await getGroupsVkData([Math.abs(id)]);

        let receiverData =
          Object.keys(res).length > 0 ? res[Math.abs(id)] : { id: id };
        let paramsData = {
          id: id,
          sum: sum && !isNaN(Number(sum)) ? Math.floor(sum) : null,
          payload: payload ? payload : null,
          isLock: isLock ? isLock : 0,
        };
        dispatch({
          type: "setTransferUrlData",
          payload: {
            name: "params",
            value: paramsData,
          },
        });
        dispatch({
          type: "setTransferUrlData",
          payload: {
            name: "data",
            value: receiverData,
          },
        });
        router.replacePage(PAGE_MAIN);
        wsQuery("transfers:prepare", { to_id: id });
      } else {
        router.replacePage(PAGE_MAIN);
      }
    };
    if (Object.keys(dbData).length > 0 && isLoad) {
      if (location.route.pageId.startsWith("/send_")) {
        checkTransferUrl();
      } else {
        sortGroupsOperation(dbData.transactions, dbData.id);
        sortUserOperation(dbData.transactions, dbData.id);
      }
    }
  }, [dbData]);

  const setInfo = (value) => {
    if (value != activeInfo) {
      return setActiveInfo(value);
    }
  };

  const freshFunc = () => {
    setFetch(true);
    wsQuery("players:update");
    setFetch(false);
  };

  return (
    <Panel id={id}>
      <PanelHeader separator={false}>
        <PanelHeaderContent
          status={
            isLoad
              ? dbData?.vk?.first_name + " " + dbData?.vk?.last_name
              : "Загрузка..."
          }
          before={
            <Avatar size={40} src={isLoad ? dbData?.vk?.photo_100 : null} />
          }
        >
          OnlyCoin
        </PanelHeaderContent>
      </PanelHeader>
      {isLoad ? (
        <PullToRefresh isFetching={isFetch} onRefresh={() => freshFunc()}>
          <div className="panel--in">
            <div className="balanceBlock">
              <span className="balance">{numberFormat(dbData?.coins)} OC</span>
              <div className="balanceButtons">
                <Button
                  size="m"
                  stretched
                  mode="secondary"
                  onClick={() => router.pushPopup(POPOUT_BUYCOINS)}
                >
                  Купить
                </Button>
                <Button
                  size="m"
                  stretched
                  mode="secondary"
                  onClick={() => router.pushPopup(POPOUT_SELLCOINS)}
                >
                  Продать
                </Button>
              </div>
            </div>
            <div className="menuButtons">
              {menu.map((v, i) => (
                <div className="menuButton" key={i} onClick={() => v.action()}>
                  <div className="menuIcon">{v.icon}</div>
                  <span className="menuName">{v.name}</span>
                </div>
              ))}
            </div>
            <div className="infoBlock">
              <div className="select">
                <span
                  className={`block ${activeInfo === 0 ? "block--active" : ""}`}
                  onClick={() => setInfo(0)}
                >
                  Информация
                </span>
                <span
                  className={`block ${activeInfo === 1 ? "block--active" : ""}`}
                  onClick={() => setInfo(1)}
                >
                  Операции
                </span>
              </div>
              <div className="infoBlock--in">
                {activeInfo === 0 ? (
                  <>
                    <span className="info">
                      OnlyCoin - развлекательная игровая валюта подкрепленная
                      фиксированным курсом за VkCoin.
                    </span>
                    <span className="info">
                      Валюту можно покупать, продавать за VkCoin, а так же
                      переводить другим игрокам или сообществам.
                    </span>
                  </>
                ) : null}
                {activeInfo === 1 ? (
                  <OperationComponent
                    dbData={dbData}
                    usersData={usersData}
                    groupsData={groupsData}
                  />
                ) : null}
              </div>
            </div>
          </div>
        </PullToRefresh>
      ) : null}
      {activeInfo === 0 && isLoad ? (
        <div className="giftAds" onClick={() => ads()}>
          {!hideAdsButton ? (
            <Icon28GiftOutline fill="white" width={32} height={32} />
          ) : (
            <Spinner size="regular" />
          )}
        </div>
      ) : null}
      {snackBar}
    </Panel>
  );
};
