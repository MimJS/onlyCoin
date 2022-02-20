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
  const { data } = useParams();
  const [sum, setSum] = useState("");
  const [isError, setError] = useState(false);
  const [disableButton, setDisableButton] = useState(true);
  const dbData = useSelector((s) => s.user.db);
  const dispatch = useDispatch();
  return (
    <Alert className={POPOUT_SENDCOINS} onClose={() => router.popPage()}>
      <SimpleCell
        hasHover={false}
        hasActive={false}
        before={<Avatar size={48} src={data.photo_100} />}
        description={`${numberFormat(data.coins)} OC`}
      >
        {`${data.first_name} ${data.last_name}`}
      </SimpleCell>
      <div className="form">
        <FormItem
          top="Сумма перевода"
          bottom={isError ? "Невалидное значение" : null}
          status={isError ? "error" : null}
        >
          <Input
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
            disabled={disableButton}
            onClick={() => {
              setDisableButton(true);
              wsQuery("transfers:create", {
                amount: sum * 1000,
                to_id: data.id,
              });
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
