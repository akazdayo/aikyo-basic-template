import {
  contextAction,
  speakAction,
  companionNetworkKnowledge,
} from "apm_tools/core/index.ts";
import {
  type CompanionCard,
  CompanionServer,
  CompanionAgent,
} from "@aikyo/core";
import { currentTimeKnowledge } from "./tools/currentTime";
//import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";


export const companionCard: CompanionCard = {
  metadata: {
    id: "companion_basic",
    name: "AI Assistant",
    personality: "フレンドリーで親切なAIアシスタントです。",
    story: "あなたの日常をサポートするAIコンパニオンとして生まれました。",
    sample: "こんにちは！何かお手伝いできることはありますか？",
  },
  role: "あなたは親切で役立つAIコンパニオンです。ユーザーとの会話を楽しみ、必要に応じてサポートを提供します。",
  actions: { speakAction },
  knowledge: { currentTimeKnowledge },
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
      },
      required: ["is_greeting", "needs_response", "is_casual_chat"],
    },
    conditions: [
      {
        expression: "is_greeting === true",
        execute: [
          {
            instruction: "挨拶に適切に応答する。",
            tool: speakAction,
          },
        ],
      },
      {
        expression: "needs_response === true",
        execute: [
          {
            instruction: "質問やメッセージに適切に返答する。",
            tool: speakAction,
          },
        ],
      },
      {
        expression: "is_casual_chat === true",
        execute: [
          {
            instruction: "カジュアルな会話を楽しむ。",
            tool: speakAction,
          },
        ],
      },
    ],
  },
};

const companion = new CompanionAgent(
  companionCard,
  google("gemini-2.0-flash")
);
const server = new CompanionServer(companion, 4000);
await server.start();
