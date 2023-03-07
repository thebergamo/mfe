import ReactDOM from "react-dom/client";
import { Mfe, MfeContext } from "./Mfe";
import App from "./App";

declare global {
  interface Window {
    MfeContext: MfeContext;
  }
}

ReactDOM.hydrateRoot(
  document,
  <Mfe context={window.MfeContext}>
    <App />
  </Mfe>
);
console.log("hydrated");
