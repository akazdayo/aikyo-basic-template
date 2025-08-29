import {
  contextAction,
  companionNetworkKnowledge,
} from "apm_tools/core/index.ts";
import {
  type CompanionCard,
  CompanionServer,
  CompanionAgent,
} from "../../server";
import { currentTimeKnowledge } from "./tools/currentTime";
//import { anthropic } from "@ai-sdk/anthropic";
//import { google } from "@ai-sdk/google";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});


export const companionCard: CompanionCard = {
  metadata: {
    id: "companion_basic",
    name: "AI Assistant",
    url: "http://localhost:4000",
    personality: "フレンドリーで親切なAIアシスタントです。",
    story: "あなたの日常をサポートするAIコンパニオンとして生まれました。",
    sample: "こんにちは！何かお手伝いできることはありますか？",
  },
  role: "あなたは親切で役立つAIコンパニオンです。ユーザーとの会話を楽しみ、必要に応じてサポートを提供します。",
  actions: { contextAction },
  knowledge: { currentTimeKnowledge, companionNetworkKnowledge },
  events: {
    params: {
      title: "基本判断パラメータ",
      description: "各パラメータを適切に判断してください。",
      type: "object",
      properties: {
        is_greeting: {
          description: "挨拶や初回のコミュニケーションかどうか",
          type: "boolean",
        },
        needs_response: {
          description: "相手からの質問やメッセージに返答が必要かどうか",
          type: "boolean",
        },
        is_casual_chat: {
          description: "カジュアルな雑談かどうか",
          type: "boolean",
        },
        need_time_info: {
          description: "現在の日時情報が必要かどうか",
          type: "boolean",
        },
      },
      required: ["is_greeting", "needs_response", "is_casual_chat", "need_time_info"],
    },
    conditions: [
      {
        expression: "is_greeting === true",
        execute: [
          {
            instruction: "挨拶に適切に応答する。",
            tool: contextAction,
          },
        ],
      },
      {
        expression: "needs_response === true",
        execute: [
          {
            instruction: "質問やメッセージに適切に返答する。",
            tool: contextAction,
          },
        ],
      },
      {
        expression: "is_casual_chat === true",
        execute: [
          {
            instruction: "カジュアルな会話を楽しむ。",
            tool: contextAction,
          },
        ],
      },
    ],
  },
};

const companion = new CompanionAgent(
  companionCard,
  openrouter("google/gemini-2.0-flash-001")
);
const server = new CompanionServer(companion, 4000);
await server.start();