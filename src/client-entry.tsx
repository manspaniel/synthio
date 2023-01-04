import React from "react";
import ReactDOM from "react-dom/client";
// @ts-ignore
import { Studio } from "./components/Studio";

export default function start() {
  ReactDOM.createRoot(document.getElementById("root")!).render(<Studio />);
}
