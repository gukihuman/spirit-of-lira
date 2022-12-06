import { putData } from "../db/devSave";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const data = {
    dataName: body.dataName,
    data: body.data,
  };

  const x = await putData(data);

  return "OK";
});
