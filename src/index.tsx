import React from "react";
import ReactDOM from "react-dom";
import Chart from "./Chart";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
      "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  html,
  body,
  #root {
    height: 100%;
    width: 100%;
  }

`;

ReactDOM.render(
  <React.StrictMode>
    <>
      <GlobalStyle />
      <Chart />
    </>
  </React.StrictMode>,
  document.getElementById("root")
);
