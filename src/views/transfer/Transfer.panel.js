import { useRouter } from "@happysanta/router";
import {
  FixedLayout,
  Panel,
  PanelHeader,
  PanelHeaderBack,
  PanelHeaderContent,
  Search,
  Spinner,
  SimpleCell,
  Avatar,
} from "@vkontakte/vkui";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getFriendsList,
  getUsersVkData,
  getUserVKData,
} from "../../lib/scripts/util";
import { wsQuery } from "../../lib/scripts/ws";
import { numberFormat } from "../../lib/scripts/util";
import { useDebounce } from "../../lib/scripts/debounce";
import { POPOUT_SENDCOINS } from "../../lib/routes";

export const TransferPanel = ({ id }) => {
  const router = useRouter();
  const [tempData, setTempData] = useState({
    ids: [],
    data: {},
  });
  const [searchValue, setSearchValue] = useState("");
  const searchValueDebounce = useDebounce(searchValue, 500);
  const [load, setLoad] = useState(true);
  const friendsData = useSelector((s) => s.user.friendsData);
  const globalTransferData = useSelector((s) => s.user.globalTransferData);
  const [searchData, setSearchData] = useState({
    ids: [],
    data: {},
    isFriend: true,
  });
  const dispatch = useDispatch();
  useEffect(() => {
    const getFriendsData = async () => {
      const res = await getFriendsList();
      setTempData(res);
      if (res.ids.length > 0) {
        wsQuery("transfers:friends", { friend_ids: res.ids });
      } else {
        setLoad(false);
      }
      console.log(res);
    };
    getFriendsData();
  }, []);
  useEffect(() => {
    const getSearchData = (searchValue) => {
      console.log("take");
      setSearchData({ ids: [], data: {}, isFriend: true });
      let value = String(searchValue).toLowerCase();
      if (value.indexOf("vk.com/") != -1) {
        value = value.split("vk.com/")[1];
        if (value.length == 0) {
          setSearchData({ ids: [], data: {}, isFriend: true });
        } else {
          wsQuery("transfers:friendsGetById", { friend_ids: value });
        }
      } else if (value.indexOf("@") != -1) {
        value = value.split("@")[1];
        if (value.length == 0) {
          setSearchData({ ids: [], data: {}, isFriend: true });
        } else {
          wsQuery("transfers:friendsGetById", { friend_ids: value });
        }
      } else {
        let obj = tempData.data;
        if (Object.keys(obj).length == 0) {
          console.log(`here`);
          setSearchData({ ids: [], data: {}, isFriend: true });
          return setLoad(false);
        }
        let filter = Object.entries(obj).filter((v) => {
          const name = (v[1].first_name + " " + v[1].last_name).toLowerCase();
          console.log(name);
          console.log(value);
          return name.startsWith(value);
        });
        if (filter.length == 0) {
          console.log(`here2`);
          console.log(filter);
          setSearchData({ ids: [], data: {}, isFriend: true });
          return setLoad(false);
        } else {
          let ids = [];
          let tempData = {};
          filter.forEach((v) => {
            if (ids.indexOf(Number(v[0])) == -1) {
              ids.push(Number(v[0]));
              tempData[Number(v[0])] = v[1];
            }
          });
          setSearchData({
            ids: ids,
            data: tempData,
            isFriend: true,
          });
        }
      }
    };
    if (searchValue.length > 0) {
      getSearchData(searchValue);
    }
    dispatch({
      type: "setGlobalDataTransfer",
      payload: [],
    });
  }, [searchValueDebounce]);
  useEffect(() => {
    const mixData = async (friendsData) => {
      if (friendsData.length == 0) {
        return;
      } else {
        console.log(friendsData);
        let tempObj = { ...tempData.data };
        for (let i = 0; i < friendsData.length; i++) {
          if (typeof tempObj[friendsData[i].id] != "undefined") {
            tempObj[friendsData[i].id].coins = friendsData[i].coins;
          }
        }
        console.log(tempObj);
        setTempData({ ...tempData, data: tempObj });
        setLoad(false);
      }
    };
    mixData(friendsData);
  }, [friendsData]);
  useEffect(() => {
    const mixGlobalData = async (globalTransferData) => {
      if (globalTransferData.length == 0) {
        setSearchData({
          ids: [],
          data: {},
          isFriend: true,
        });
        return;
      } else {
        console.log(globalTransferData);
        let tempObj = {};
        console.log(globalTransferData[0].id);
        tempObj = await getUsersVkData([globalTransferData[0].id]);
        tempObj[globalTransferData[0].id].coins = globalTransferData[0].coins;
        console.log(tempObj);
        let ids = [globalTransferData[0].id];
        setSearchData({
          ids: ids,
          data: tempObj,
          isFriend: false,
        });
      }
    };
    mixGlobalData(globalTransferData);
  }, [globalTransferData]);
  const openPopout = (type, id) => {
    if (type == "friends") {
      router.pushPopup(POPOUT_SENDCOINS, { data: tempData.data[id] });
    } else {
      router.pushPopup(POPOUT_SENDCOINS, { data: searchData.data[id] });
    }
  };
  return (
    <Panel id={id}>
      <PanelHeader
        separator={false}
        left={<PanelHeaderBack onClick={() => router.popPage()} />}
      >
        <PanelHeaderContent>Перевод</PanelHeaderContent>
      </PanelHeader>
      {!load ? (
        <>
          <FixedLayout vertical="top">
            <Search
              placeholder="Поиск"
              value={searchValue}
              onChange={(e) => {
                setSearchData({ ids: [], data: {}, isFriend: true });
                setSearchValue(e.currentTarget.value);
              }}
            />
          </FixedLayout>
          <div className="panel--in">
            {searchValue.length == 0 ? (
              tempData.ids.length > 0 ? (
                tempData.ids.map((v, i) => {
                  const haveData = typeof tempData.data[v] != "undefined";
                  const data = tempData.data[v];
                  return (
                    <SimpleCell
                      key={i}
                      className="transferCell"
                      hasHover={false}
                      hasActive={false}
                      onClick={() => openPopout("friends", v)}
                      before={
                        <Avatar
                          size={48}
                          src={haveData ? data.photo_100 : null}
                        />
                      }
                      description={
                        haveData && data.coins >= 0
                          ? `${numberFormat(data.coins)} OC`
                          : null
                      }
                    >
                      {haveData
                        ? `${data.first_name} ${data.last_name}`
                        : `@id${v}`}
                    </SimpleCell>
                  );
                })
              ) : (
                <span className="info">У вас нет друзей</span>
              )
            ) : null}
            {searchValue.length > 0
              ? searchData.ids.length > 0
                ? searchData.ids.map((v, i) => {
                    console.log(v);
                    const haveData = typeof searchData.data[v] != "undefined";
                    const data = searchData.data[v];
                    console.log(searchData);
                    return (
                      <SimpleCell
                        key={i}
                        onClick={() => openPopout("all", v)}
                        className="transferCell"
                        hasHover={false}
                        hasActive={false}
                        before={
                          <Avatar
                            size={48}
                            src={haveData ? data.photo_100 : null}
                          />
                        }
                        description={
                          haveData
                            ? searchData.isFriend
                              ? typeof tempData.data[v] != "undefined"
                                ? numberFormat(tempData.data[v].coins) + " OC"
                                : "..."
                              : searchData.isFriend == false
                              ? numberFormat(data.coins) + " OC"
                              : "..."
                            : "..."
                        }
                      >
                        {haveData
                          ? `${data.first_name} ${data.last_name}`
                          : `@id${v}`}
                      </SimpleCell>
                    );
                  })
                : null
              : null}
          </div>
        </>
      ) : null}
      {load ? <Spinner size="small" style={{ marginTop: 30 }} /> : null}
    </Panel>
  );
};
