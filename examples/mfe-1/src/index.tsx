// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';

// ReactDOM.hydrateRoot(document, <App />);

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

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
