import { devPost } from "../db/devPost";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const reqData = {
    name: body.name,
    data: body.data,
  };

  const res = await devPost(reqData);

  return "OK";
});
