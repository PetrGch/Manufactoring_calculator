import React, {ForwardedRef} from "react";

import "./PrinterCalculatorScene.less";

const PrinterCalculatorScene = React.forwardRef((props, ref: ForwardedRef<HTMLDivElement>) => (
    <div
        className="PrinterCalculatorScene"
        ref={ref}
    />
));

export default PrinterCalculatorScene;