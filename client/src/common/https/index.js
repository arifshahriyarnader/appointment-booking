import axios from "axios";
import { appConfig } from "../config";

export const http = axios.create({
  baseURL: appConfig.BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
