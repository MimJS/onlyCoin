import {
  Avatar,
  Button,
  Panel,
  PanelHeader,
  PanelHeaderContent,
  PullToRefresh,
  SimpleCell,
} from "@vkontakte/vkui";
import { Icon24DollarCircleOutline } from "@vkontakte/icons";
import { useSelector } from "react-redux";
import { getUsersVkData, msToDate, numberFormat } from "../../lib/scripts/util";
import {
  Icon28FavoriteOutline,
  Icon28MoneyRequestOutline,
  Icon28MoneySendOutline,
  Icon28GameOutline,
} from "@vkontakte/icons";
import { useEffect, useState } from "react";
import { wsQuery } from "../../lib/scripts/ws";
import { go } from "../../lib/routes";
import { OperationComponent } from "./Operation.component";

export const MainPanel = ({ id }) => {
  const dbData = useSelector((s) => s.user.db);
  const isLoad = useSelector((s) => s.user.load);
  const [activeInfo, setActiveInfo] = useState(0);
  const [isFetch, setFetch] = useState(false);
  const [usersData, setUsersData] = useState({});
  const menu = [
    {
      icon: <Icon28FavoriteOutline width={32} height={32} fill="white" />,
      name: "Топ",
      action: () => {
        wsQuery("game:update");
        go("rating");
        return;
      },
    },
    {
      icon: <Icon28MoneySendOutline width={32} height={32} fill="white" />,
      name: "Перевод",
      action: () => {
        return;
      },
    },
    {
      icon: <Icon28MoneyRequestOutline width={32} height={32} fill="white" />,
      name: "Получить",
      action: () => {
        return;
      },
    },
    {
      icon: <Icon28GameOutline width={32} height={32} fill="white" />,
      name: "Игры",
      action: () => {
        return;
      },
    },
  ];

  useEffect(() => {
    const sortUserOperation = async (transactions) => {
      if (!dbData.transactions) {
        return;
      }
      console.log(transactions.length);
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
      console.log(res);
      setUsersData(res);
    };
    sortUserOperation(dbData.transactions);
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
              <span className="balance">{numberFormat(dbData?.coins)}</span>
              <Icon24DollarCircleOutline
                width={35}
                height={35}
                fill={"white"}
              />
              <div className="balanceButtons">
                <Button size="m" stretched mode="secondary">
                  Купить
                </Button>
                <Button size="m" stretched mode="secondary">
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
                    <span>OnlyCoin - тут мини инфа</span>
                  </>
                ) : null}
                {activeInfo === 1 ? (
                  <OperationComponent dbData={dbData} usersData={usersData} />
                ) : null}
              </div>
            </div>
          </div>
        </PullToRefresh>
      ) : null}
    </Panel>
  );
};
