import { Alert, Button, FormItem, Input, SimpleCell } from "@vkontakte/vkui";
import { useRouter } from "@happysanta/router";
import { Icon28MoneyRequestOutline } from "@vkontakte/icons";
import { POPOUT_SELLCOINS } from "../../lib/routes";
import { numberFormat, isNumeric, formatNumber } from "../../lib/scripts/util";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { wsQuery } from "../../lib/scripts/ws";

export const SellCoinsPopout = () => {
  const router = useRouter();
  const courseInfo = useSelector((s) => s.game?.information?.course);
  const dispatch = useDispatch();
  const dbData = useSelector((s) => s.user.db);
  const storeStatus = useSelector((s) => s.user.storeStatus);
  const [replenishAmount, setReplenishAmount] = useState("");
  const [isError, setError] = useState(false);
  const [disableButton, setDisableButton] = useState(true);
  return (
    <Alert
      onClose={() => {
        dispatch({
          type: "setStoreStatus",
          payload: { status: true },
        });
        router.popPage();
      }}
      className={POPOUT_SELLCOINS}
    >
      <SimpleCell
        disabled
        before={
          <div className="marketAvatar">
            <Icon28MoneyRequestOutline fill={"white"} />
          </div>
        }
        description={`1 OC = ${courseInfo.sell} VKC`}
      >
        Продажа OnlyCoin
      </SimpleCell>
      <div className="form">
        <FormItem top="Сумма в VKCoin">
          <Input
            readOnly
            value={numberFormat(
              Number(replenishAmount * courseInfo.sell * 1000),
              true
            )}
            disabled
          />
        </FormItem>
        <FormItem
          top="Сумма в OnlyCoin"
          bottom={
            storeStatus?.status == false
              ? storeStatus?.error_msg
              : isError
              ? "Невалидное значение"
              : null
          }
          status={isError || storeStatus?.status == false ? "error" : null}
        >
          <div className="inputs">
            <Input
              value={
                isNumeric(replenishAmount)
                  ? formatNumber(replenishAmount, 0)
                  : replenishAmount
              }
              placeholder={"0.001"}
              inputMode="numeric"
              onChange={(e) => {
                let v = "" + e.target.value;
                v = v.replace(/[^0123456789.]/g, "");
                if (v !== "" && !isNumeric(v)) {
                  return;
                }
                if (Number(v) > 100000000000) {
                  v = "100000000000";
                }
                if (Number(v) > Number(dbData?.coins / 1000)) {
                  v = String(Number(dbData?.coins / 1000));
                }
                if (v < 0) {
                  v = "";
                }
                if (v.indexOf(".") >= 0) {
                  const data = v.split(".");
                  if (data[1] && data[1].length > 3) {
                    if (Number(v) + 1 > 100000000000) {
                      v = "100000000000";
                    } else {
                      let newAfter = String(data[1]).substring(0, 3);
                      let newBefore = String(data[0].split(" ").join(""));
                      v = newBefore + "." + newAfter;
                    }
                  }
                }
                if (
                  v.length === 0 ||
                  Number(v * courseInfo.buy) < 0.001 ||
                  Number(v) === 0 ||
                  Number(v) > Number(dbData?.coins / 1000)
                ) {
                  setError(true);
                  setDisableButton(true);
                } else {
                  dispatch({
                    type: "setStoreStatus",
                    payload: { status: true },
                  });
                  setError(false);
                  setDisableButton(false);
                }
                return setReplenishAmount(v);
              }}
            />
          </div>
        </FormItem>
        <FormItem>
          <Button
            size="m"
            disabled={disableButton}
            onClick={() => {
              wsQuery("store:sell", { amount: replenishAmount * 1000 });
            }}
          >
            Продать
          </Button>
        </FormItem>
      </div>
    </Alert>
  );
};
