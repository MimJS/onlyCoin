import { Alert, Button, Placeholder } from "@vkontakte/vkui";
import { useParams, useRouter } from "@happysanta/router";
import { POPOUT_SUCESSTRANSFER } from "../../lib/routes";
import { useSelector } from "react-redux";
import { Icon56CheckCircleOutline, Icon56ErrorOutline } from "@vkontakte/icons";
import { useEffect, useState } from "react";
import {
  getGroupsVkData,
  getUsersVkData,
  numberFormat,
} from "../../lib/scripts/util";

export const SuccessTransferPopout = () => {
  const router = useRouter();
  const { data } = useParams();
  const [tempData, setTempData] = useState({});
  const dbData = useSelector((s) => s.user.db);
  useEffect(() => {
    const getData = async (data) => {
      let tempObj = {};
      if (data.from_id != dbData.id) {
        if (data.from_id < 0) {
          const res = await getGroupsVkData([Math.abs(data.from_id)]);
          if (Object.keys(res).length > 0) {
            tempObj = { ...data, ...res[Math.abs(data.from_id)] };
          }
        } else {
          const res = await getUsersVkData([Math.abs(data.from_id)]);
          if (Object.keys(res).length > 0) {
            tempObj = { ...data, ...res[Math.abs(data.from_id)] };
          }
        }
      } else {
        if (data.to_id < 0) {
          const res = await getGroupsVkData([Math.abs(data.to_id)]);
          if (Object.keys(res).length > 0) {
            tempObj = { ...data, ...res[Math.abs(data.to_id)] };
          }
        } else {
          const res = await getUsersVkData([Math.abs(data.to_id)]);
          if (Object.keys(res).length > 0) {
            tempObj = { ...data, ...res[Math.abs(data.to_id)] };
          }
        }
      }
      console.log(tempObj);
      setTempData(tempObj);
    };
    if (data) {
      getData(data);
    }
  }, [data]);
  return (
    <Alert onClose={() => router.popPage()} className={POPOUT_SUCESSTRANSFER}>
      <Placeholder
        icon={<Icon56CheckCircleOutline fill="#01c37d" />}
        header={"Перевод успешно совершен"}
        action={
          <div className="buttons">
            <Button
              mode="primary"
              size="m"
              stretched
              onClick={() => {
                router.popPage();
              }}
            >
              Закрыть
            </Button>
          </div>
        }
      >
        Перевод для{" "}
        {Object.keys(tempData).length > 0
          ? `${
              tempData.name
                ? tempData.name
                : tempData.first_name + " " + tempData.last_name
            }`
          : `${
              data.from_id != dbData.id
                ? data.from_id < 0
                  ? `@public${data.from_id}`
                  : `@id${data.from_id}`
                : data.to_id != dbData.id
                ? data.to_id < 0
                  ? `@public${data.to_id}`
                  : `@id${data.to_id}`
                : ""
            }`}{" "}
        на сумму{" "}
        {Object.keys(tempData).length > 0 ? numberFormat(tempData.amount) : ""}{" "}
        OC успешно совершен.
      </Placeholder>
    </Alert>
  );
};
