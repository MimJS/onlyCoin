import {
  Icon28GiftOutline,
  Icon28MoneyRequestOutline,
  Icon28MoneySendOutline,
} from "@vkontakte/icons";
import { SimpleCell, Avatar } from "@vkontakte/vkui";
import { msToDate, numberFormat } from "../../lib/scripts/util";

export const OperationComponent = ({ dbData, usersData, groupsData }) => {
  return (
    <>
      {dbData.transactions.length == 0 ? (
        <span className="info center">Тут будут показаны ваши операции</span>
      ) : null}
      {dbData.transactions.length > 0 &&
        dbData.transactions.map((v, i) => {
          if (v.type) {
            if (v.type === "sell") {
              return (
                <SimpleCell
                  key={i}
                  className="paymentBlock"
                  before={
                    <div className="marketAvatar">
                      <Icon28MoneySendOutline fill={"white"} />
                    </div>
                  }
                  hasHover={false}
                  hasActive={false}
                  disabled
                  description={
                    <span className="sum minus">
                      - {numberFormat(v.amount)} OC
                    </span>
                  }
                  after={
                    <span className="date">{msToDate(v.create_date)}</span>
                  }
                >
                  Продажа OnlyCoin
                </SimpleCell>
              );
            }
            if (v.type === "ads") {
              return (
                <SimpleCell
                  key={i}
                  className="paymentBlock"
                  before={
                    <div className="marketAvatar">
                      <Icon28GiftOutline fill={"white"} />
                    </div>
                  }
                  hasHover={false}
                  hasActive={false}
                  disabled
                  description={
                    <span className="sum plus">
                      + {numberFormat(v.amount)} OC
                    </span>
                  }
                  after={
                    <span className="date">{msToDate(v.create_date)}</span>
                  }
                >
                  Бонус за рекламу
                </SimpleCell>
              );
            }
            if (v.type === "buy") {
              return (
                <SimpleCell
                  key={i}
                  className="paymentBlock"
                  before={
                    <div className="marketAvatar">
                      <Icon28MoneyRequestOutline fill={"white"} />
                    </div>
                  }
                  hasHover={false}
                  hasActive={false}
                  disabled
                  description={
                    <span className="sum plus">
                      + {numberFormat(v.amount)} OC
                    </span>
                  }
                  after={
                    <span className="date">{msToDate(v.create_date)}</span>
                  }
                >
                  Покупка OnlyCoin
                </SimpleCell>
              );
            }
          }
          if (!v.type) {
            const id = v.from_id === dbData.id ? v.to_id : v.from_id;
            let data, haveData;
            if (id > 0) {
              haveData = typeof usersData[id] !== "undefined";
              data = usersData[id];
            } else {
              haveData = typeof groupsData[Math.abs(id)] !== "undefined";
              data = groupsData[Math.abs(id)];
            }
            return (
              <SimpleCell
                key={i}
                onClick={() => {
                  if (id < 0) {
                    window.open(`https://vk.com/public${id}`);
                  } else {
                    window.open(`https://vk.com/id${id}`);
                  }
                }}
                className="paymentBlock"
                before={
                  <Avatar size={48} src={haveData ? data.photo_100 : null} />
                }
                hasHover={false}
                hasActive={false}
                description={
                  <span
                    className={`sum ${
                      v.from_id === dbData.id ? "minus" : "plus"
                    }`}
                  >
                    {v.from_id === dbData.id ? "-" : "+"}{" "}
                    {numberFormat(v.amount)} OC
                  </span>
                }
                after={<span className="date">{msToDate(v.create_date)}</span>}
              >
                {id > 0 && (
                  <>
                    {haveData
                      ? `${data.first_name} ${data.last_name}`
                      : `@id${id}`}
                  </>
                )}
                {id < 0 && (
                  <>{haveData ? data.name : `@public${Math.abs(id)}`}</>
                )}
              </SimpleCell>
            );
          }
        })}
    </>
  );
};
