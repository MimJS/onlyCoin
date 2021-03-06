import { useRouter } from "@happysanta/router";
import { Icon24DollarCircleOutline } from "@vkontakte/icons";
import {
  Avatar,
  FixedLayout,
  Panel,
  PanelHeader,
  PanelHeaderBack,
  PanelHeaderContent,
  PullToRefresh,
  SimpleCell,
  Spinner,
  Link,
} from "@vkontakte/vkui";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  getGroupsVkData,
  getUsersVkData,
  numberFormat,
} from "../../lib/scripts/util";
import { wsQuery } from "../../lib/scripts/ws";

export const RatingPanel = ({ id }) => {
  const router = useRouter();
  const [activeInfo, setActiveInfo] = useState(0);
  const [isFetch, setFetch] = useState(false);
  const [tempUserData, setTempUserData] = useState({});
  const [tempMerchantData, setTempMerchantData] = useState({});
  const [isLoad, setLoad] = useState(true);
  const ratings = useSelector((s) => s.game.ratings);
  const dbData = useSelector((s) => s.user.db);
  const setInfo = (value) => {
    if (value != activeInfo) {
      if (value === 1 && Object.keys(tempMerchantData).length == 0) {
        setLoad(true);
      }
      if (value === 0 && Object.keys(tempUserData).length != 0) {
        setLoad(false);
      }
      return setActiveInfo(value);
    }
  };
  const freshFunc = () => {
    setFetch(true);
    wsQuery("game:update");
    setFetch(false);
  };
  useEffect(() => {
    const getData = async (topType, ratings) => {
      if (!ratings) {
        return;
      }
      if (topType === 0) {
        if (ratings.coins.items.length == 0) {
          return setLoad(false);
        }
        let ids = [];
        const rating = ratings.coins.items;
        for (let i = 0; i < rating.length; i++) {
          let data = rating[i];
          if (ids.indexOf(data.id) < 0) {
            ids.push(data.id);
          }
        }
        const res = await getUsersVkData(ids);

        setTempUserData(res);
        setLoad(false);
      }
      if (topType === 1) {
        if (ratings.merchants.items.length == 0) {
          return setLoad(false);
        }
        let ids = [];
        const rating = ratings.merchants.items;
        for (let i = 0; i < rating.length; i++) {
          let data = rating[i];
          if (ids.indexOf(Math.abs(data.id)) < 0) {
            ids.push(Math.abs(data.id));
          }
        }
        const res = await getGroupsVkData(ids);

        setTempMerchantData(res);
        setLoad(false);
      }
    };
    getData(activeInfo, ratings);
  }, [activeInfo, ratings]);

  useEffect(() => {
    const interval = setInterval(() => {
      wsQuery(`game:update`);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Panel id={id}>
      <PanelHeader
        left={<PanelHeaderBack onClick={() => router.popPage()} />}
        separator={false}
      >
        <PanelHeaderContent>??????????????</PanelHeaderContent>
      </PanelHeader>
      <div className="panel--in" style={{ paddingBottom: 0 }}>
        <div className="select">
          <span
            className={`block ${activeInfo === 0 ? "block--active" : ""}`}
            onClick={() => setInfo(0)}
          >
            ????????????
          </span>
          <span
            className={`block ${activeInfo === 1 ? "block--active" : ""}`}
            onClick={() => setInfo(1)}
          >
            ????????????????
          </span>
        </div>
      </div>
      {isLoad ? <Spinner size="small" style={{ marginTop: 30 }} /> : null}
      {!isLoad ? (
        <PullToRefresh isFetching={isFetch} onRefresh={() => freshFunc()}>
          <div
            className="panel--in"
            style={{ paddingTop: 0, marginBottom: 88 }}
          >
            {activeInfo === 0
              ? ratings?.coins?.items.map((v, i) => {
                  const haveData = typeof tempUserData[v.id] !== "undefined";
                  const data = tempUserData[v.id];
                  return (
                    <Link
                      hasActive={false}
                      hasHover={false}
                      href={`https://vk.com/id${v.id}`}
                      target="_blank"
                    >
                      <SimpleCell
                        key={i}
                        className={"ratingCell"}
                        hasHover={false}
                        hasActive={false}
                        before={
                          <div className="position">
                            <span className="pos">
                              <span>{i + 1}</span>
                            </span>
                            <Avatar
                              size={48}
                              src={haveData ? data.photo_100 : null}
                            />
                          </div>
                        }
                        description={
                          <span className="sum">
                            {numberFormat(v.coins)} OC
                          </span>
                        }
                      >
                        {haveData
                          ? `${data.first_name} ${data.last_name}`
                          : `@id${v.id}`}
                      </SimpleCell>
                    </Link>
                  );
                })
              : null}
            {activeInfo === 1
              ? ratings?.merchants?.items.length > 0
                ? ratings?.merchants?.items.map((v, i) => {
                    const haveData =
                      typeof tempMerchantData[Math.abs(v.id)] !== "undefined";
                    const data = tempMerchantData[Math.abs(v.id)];
                    return (
                      <Link
                        hasActive={false}
                        hasHover={false}
                        href={`https://vk.com/public${Math.abs(v.id)}`}
                        target="_blank"
                      >
                        <SimpleCell
                          key={i}
                          className={"ratingCell"}
                          hasHover={false}
                          hasActive={false}
                          before={
                            <div className="position">
                              <span className="pos">
                                <span>{i + 1}</span>
                              </span>
                              <Avatar
                                size={48}
                                src={haveData ? data.photo_100 : null}
                              />
                            </div>
                          }
                          description={
                            <span className="sum">
                              {numberFormat(v.coins)} OC
                            </span>
                          }
                        >
                          {haveData
                            ? `${data.name}`
                            : `@public${Math.abs(v.id)}`}
                        </SimpleCell>
                      </Link>
                    );
                  })
                : null
              : null}
            {activeInfo === 1 && ratings?.merchants?.items.length == 0 ? (
              <span className="info">???????????? ??????</span>
            ) : null}
            {activeInfo === 0 && ratings?.coins?.items.length == 0 ? (
              <span className="info">???????????? ??????</span>
            ) : null}
          </div>
        </PullToRefresh>
      ) : null}
      {activeInfo === 0 && !isLoad ? (
        <FixedLayout vertical="bottom">
          <div className="panel--in">
            <SimpleCell
              key={0}
              className={"ratingCell"}
              style={{ marginTop: 0 }}
              hasHover={false}
              hasActive={false}
              disabled
              before={
                <div className="position">
                  <span className="pos">
                    <span>
                      {ratings?.coins?.my?.position > 50 ? "~" : null}{" "}
                      {ratings?.coins?.my?.position}
                    </span>
                  </span>
                  <Avatar size={48} src={dbData?.vk?.photo_100} />
                </div>
              }
              description={
                <span className="sum">
                  {numberFormat(ratings?.coins?.my?.coins)} OC
                </span>
              }
            >
              {dbData?.vk?.first_name} {dbData?.vk?.last_name}
            </SimpleCell>
          </div>
        </FixedLayout>
      ) : null}
    </Panel>
  );
};
