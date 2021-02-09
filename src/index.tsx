import * as React from "react";
// @ts-ignore:
import * as ReactDOM from "react-dom";
import {Provider} from "react-redux";

import store from "./rootStore";
// @ts-ignore
import App from "./App/App";

import "./index.less";

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById("root")
);
