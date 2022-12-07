import { devGet } from "../db/devGet";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const reqData = {
    name: body.name,
  };

  let res = await devGet(reqData);

  if (!res) {
    res = "not found";
  }

  return res;
});
