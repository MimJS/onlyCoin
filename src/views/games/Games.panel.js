import {
  Panel,
  PanelHeader,
  Button,
  SimpleCell,
  Avatar,
  PanelHeaderBack,
  PanelHeaderContent,
  Spinner,
  PullToRefresh,
  Link,
} from "@vkontakte/vkui";
import { useRouter } from "@happysanta/router";
import { useSelector } from "react-redux";
import { Icon24ServicesOutline } from "@vkontakte/icons";
import { PAGE_MYMERCHANT } from "../../lib/routes";
import { useEffect, useState } from "react";
import { getGroupsVkData } from "../../lib/scripts/util";
import { wsQuery } from "../../lib/scripts/ws";

export const GamesPanel = ({ id }) => {
  const router = useRouter();
  const games = useSelector((s) => s.game.games);
  const [gamesData, setGamesData] = useState({});
  const [load, setLoad] = useState(true);
  const [isFetch, setFetch] = useState(false);
  useEffect(() => {
    const getData = async (games) => {
      if (Object.keys(games).length == 0) {
        return;
      }
      if (games.count == 0) {
        return setLoad(false);
      }
      let ids = [];
      for (let i = 0; i < games.items.length; i++) {
        let data = games.items[i];
        if (ids.indexOf(Math.abs(data.id)) < 0) {
          ids.push(Math.abs(data.id));
        }
      }
      const res = await getGroupsVkData(ids);
      setGamesData(res);
      setLoad(false);
    };
    getData(games);
  }, [games]);
  const freshFunc = () => {
    setFetch(true);
    wsQuery("game:catalog");
    setFetch(false);
  };
  return (
    <Panel id={id}>
      <PanelHeader
        left={<PanelHeaderBack onClick={() => router.popPage()} />}
        separator={false}
      >
        <PanelHeaderContent>Игры</PanelHeaderContent>
      </PanelHeader>
      <PullToRefresh isFetching={isFetch} onRefresh={() => freshFunc()}>
        <div className="panel--in">
          <div className="gamesList">
            {load ? (
              <Spinner
                size="small"
                style={{ marginTop: 30, marginBottom: 30 }}
              />
            ) : null}
            {!load && games?.count > 0
              ? games?.items.map((v, i) => {
                  const haveData =
                    typeof gamesData[Math.abs(v.id)] !== "undefined";
                  const data = gamesData[Math.abs(v.id)];
                  return (
                    <SimpleCell
                      key={i}
                      className="gameCell"
                      before={
                        <Avatar
                          size={48}
                          src={haveData ? data.photo_100 : null}
                        />
                      }
                      description={v.description}
                      hasHover={false}
                      hasActive={false}
                      disabled
                      after={
                        <Link
                          hasHover={false}
                          hasActive={false}
                          target="_blank"
                          href={v.open_link}
                        >
                          <Button size="s" mode="primary">
                            Играть
                          </Button>
                        </Link>
                      }
                    >
                      {haveData ? data.name : `@public${Math.abs(v.id)}`}
                    </SimpleCell>
                  );
                })
              : null}
            {!load && games.count == 0 ? (
              <span className="info">Игр пока нету</span>
            ) : null}
          </div>
          <div className="toolList">
            <Button
              size="m"
              mode="primary"
              before={<Icon24ServicesOutline />}
              onClick={() => router.pushPage(PAGE_MYMERCHANT)}
            >
              Для разработчиков
            </Button>
          </div>
        </div>
      </PullToRefresh>
    </Panel>
  );
};
