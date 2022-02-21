import { useParams, useRouter } from "@happysanta/router";
import {
  Alert,
  Avatar,
  Button,
  FormItem,
  Input,
  SimpleCell,
} from "@vkontakte/vkui";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { POPOUT_SENDCOINS } from "../../lib/routes";
import { formatNumber, isNumeric, numberFormat } from "../../lib/scripts/util";
import { wsQuery } from "../../lib/scripts/ws";

export const SendCoinPopout = () => {
  const router = useRouter();
  const { data, params } = useParams();
  const [sum, setSum] = useState(
    params && params.sum ? String(Number(params.sum / 1000)) : ""
  );
  const [isError, setError] = useState(false);
  const [disableButton, setDisableButton] = useState(
    params && params.sum ? false : true
  );
  const dbData = useSelector((s) => s.user.db);
  const dispatch = useDispatch();
  const transferStatus = useSelector((s) => s.user.transferStatus);
  return (
    <Alert
      className={POPOUT_SENDCOINS}
      onClose={() => {
        dispatch({
          type: "setTransferStatus",
          payload: { status: true },
        });
        router.popPage();
      }}
    >
      <SimpleCell
        hasHover={false}
        hasActive={false}
        disabled
        before={<Avatar size={48} src={data ? data.photo_100 : null} />}
        description={
          params
            ? `Оплата${
                params.payload && params.id < 0
                  ? `, (код: ${params.payload})`
                  : ""
              }`
            : `${numberFormat(data.coins)} OC`
        }
      >
        {params && params.id < 0
          ? data.name
          : `${data.first_name} ${data.last_name}`}
      </SimpleCell>
      <div className="form">
        <FormItem
          top="Сумма перевода"
          bottom={
            transferStatus?.status == false
              ? transferStatus?.error_msg
              : isError
              ? "Невалидное значение"
              : null
          }
          status={isError || transferStatus?.status == false ? "error" : null}
        >
          <Input
            readOnly={params && params.isLock == 1 && params.sum ? true : false}
            disabled={params && params.isLock == 1 && params.sum ? true : false}
            value={isNumeric(sum) ? formatNumber(sum, 0) : sum}
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
                Number(v) === 0 ||
                Number(v) > Number(dbData?.coins / 1000)
              ) {
                setError(true);
                setDisableButton(true);
              } else {
                dispatch({
                  type: "setTransferStatus",
                  payload: { status: true },
                });
                setError(false);
                setDisableButton(false);
              }
              return setSum(v);
            }}
          />
        </FormItem>
        <FormItem>
          <Button
            size="m"
            mode="primary"
            stretched
            disabled={disableButton}
            onClick={() => {
              setDisableButton(true);
              const to_id = params ? params.id : data.id;
              let tempObj = {
                amount: sum * 1000,
                to_id: to_id,
              };
              if (params && params.payload) {
                tempObj.payload = Number(params.payload);
              }
              wsQuery("transfers:create", tempObj);
              setDisableButton(false);
            }}
          >
            Перевести
          </Button>
        </FormItem>
      </div>
    </Alert>
  );
};
