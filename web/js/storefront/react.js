import React from "react";
import ReactDOMServer from "react-dom/server";

global.ReactDOMServer = ReactDOMServer;
global.React = React;