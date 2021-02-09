import React, {ForwardedRef, useEffect, useRef} from "react";
import * as THREE from "three";

import "./CncCalculatorScene.less";

const CncCalculatorScene = React.forwardRef((props, ref: ForwardedRef<HTMLDivElement>) => (
    <div
        className="CncCalculatorScene"
        ref={ref}
    />
));

export default CncCalculatorScene;