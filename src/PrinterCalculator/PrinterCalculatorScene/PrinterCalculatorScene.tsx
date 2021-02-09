import React, {ForwardedRef, useEffect, useRef} from "react";
import * as THREE from "three";

import "./PrinterCalculatorScene.less";

const PrinterCalculatorScene = React.forwardRef((props, ref: ForwardedRef<HTMLDivElement>) => (
    <div
        className="CncCalculatorScene"
        ref={ref}
    />
));

export default PrinterCalculatorScene;