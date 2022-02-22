import {
  Alert,
  Button,
  FormItem,
  Input,
  SimpleCell,
  Link,
} from "@vkontakte/vkui";
import { useRouter } from "@happysanta/router";
import { Icon28MoneyRequestOutline } from "@vkontakte/icons";
import { POPOUT_BUYCOINS } from "../../lib/routes";
import { numberFormat, isNumeric, formatNumber } from "../../lib/scripts/util";
import { useSelector } from "react-redux";
import { useState } from "react";
import { isSafari, isIOS } from "react-device-detect";

export const BuyCoinsPopout = () => {
  const router = useRouter();
  const courseInfo = useSelector((s) => s.game?.information?.course);
  const [replenishAmount, setReplenishAmount] = useState("");
  const [isError, setError] = useState(false);
  const [disableButton, setDisableButton] = useState(true);
  return (
    <Alert onClose={() => router.popPage()} className={POPOUT_BUYCOINS}>
      <SimpleCell
        disabled
        before={
          <div className="marketAvatar">
            <Icon28MoneyRequestOutline fill={"white"} />
          </div>
        }
        description={`1 OC = ${courseInfo.buy} VKC`}
      >
        Покупка OnlyCoin
      </SimpleCell>
      <div className="form">
        <FormItem top="Сумма в OnlyCoin">
          <Input
            readOnly
            value={numberFormat(
              Number((replenishAmount / courseInfo.buy) * 1000),
              true
            )}
            disabled
          />
        </FormItem>
        <FormItem
          top="Сумма в VKCoin"
          bottom={isError ? "Невалидное значение" : null}
          status={isError ? "error" : null}
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
                  Number(v / courseInfo.buy) < 0.001 ||
                  Number(v) === 0
                ) {
                  setError(true);
                  setDisableButton(true);
                } else {
                  setError(false);
                  setDisableButton(false);
                }
                return setReplenishAmount(v);
              }}
            />
          </div>
        </FormItem>
        <FormItem>
          <Link
            href={
              !disableButton
                ? `https://${
                    isSafari || isIOS ? "m." : ""
                  }vk.com/coin#x650454742_${replenishAmount * 1000}_1`
                : null
            }
            target="_blank"
            hasHover={false}
            hasActive={false}
          >
            <Button
              size="m"
              disabled={disableButton}
              onClick={() => {
                router.popPage();
              }}
            >
              Пополнить
            </Button>
          </Link>
        </FormItem>
      </div>
    </Alert>
  );
};
