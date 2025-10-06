// src/Api/chatbotAPI.js
import * as internalAPI from "./internal";
import * as authAPI from "./auth";
import * as datasetAPI from "./dataset";
import * as studentInputAPI from "./studentinput";

export const ChatbotAPI = {
  ...internalAPI,
  ...authAPI,
  ...datasetAPI,
  ...studentInputAPI,
};
