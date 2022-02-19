import {
  Icon24DollarCircleOutline,
  Icon28MoneyRequestOutline,
  Icon28MoneySendOutline,
} from "@vkontakte/icons";
import { SimpleCell, Avatar } from "@vkontakte/vkui";
import { msToDate, numberFormat } from "../../lib/scripts/util";

export const OperationComponent = ({ dbData, usersData }) => {
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
            const haveData = typeof usersData[id] !== "undefined";
            const data = usersData[id];
            return (
              <SimpleCell
                key={i}
                onClick={() => {
                  window.open(
                    `https://vk.com/id${
                      v.from_id === dbData.id ? v.to_id : v.from_id
                    }`
                  );
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
                {haveData
                  ? `${data.first_name} ${data.last_name}`
                  : `@id${v.from_id === dbData.id ? v.to_id : v.from_id}`}
              </SimpleCell>
            );
          }
        })}
    </>
  );
};
