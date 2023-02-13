import Realm from "realm";
import { OrderSchema } from "../database/Schemas/OrderSchema";

export const getRealm = async () =>
  await Realm.open({
    path: "decode-app",
    schema: [OrderSchema],
  });
