import { createCompanionKnowledge } from "@aikyo/utils";
import z from "zod";


export const currentTimeKnowledge = createCompanionKnowledge({
  id: "current-time",
  description: "現在の時刻を取得します。",
  inputSchema: z.object({}),
  knowledge: async () => {
    const now = new Date();
    const data = {
      hours: now.getHours(),
      minutes: now.getMinutes(),
      seconds: now.getSeconds(),
    };
    return JSON.stringify(data, null, 2);
  },
});