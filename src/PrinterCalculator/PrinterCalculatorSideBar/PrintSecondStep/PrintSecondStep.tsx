import React, {useRef} from "react";
import {Button, Input} from "antd";
import {UploadOutlined} from "@ant-design/icons";
import {PRINTER_CALCULATOR_STEP} from "../PrinterCalculatorSideBar";

import "./PrintSecondStep.less";

interface PrintSecondStepProps {
    setStepStatus: (step: PRINTER_CALCULATOR_STEP, stepState: boolean) => void;
    parameters: {
        width: number,
        height: number,
        depth: number,
        area: number,
    }
}

export default function PrintSecondStep(props: PrintSecondStepProps) {
    const { setStepStatus, parameters } = props;

    return (
        <div className="PrintSecondStep">
            <h4 className="PrintSecondStep__title">Model properties:</h4>

            <div className="PrintSecondStep__parameter PrintSecondStep__parameter_dimension">
                <Input
                    addonBefore="Width"
                    value={parameters.width}
                    placeholder="Model width"
                />

                <Input
                    addonBefore="Height"
                    value={parameters.height}
                    placeholder="Model height"
                />

                <Input
                    className={}
                    addonBefore="Depth"
                    value={parameters.depth}
                    placeholder="Model Depth"
                />
            </div>

            <div className="PrintSecondStep__parameter PrintSecondStep__parameter_area">
                <Input
                    addonBefore="Area"
                    value={parameters.area}
                    placeholder="Model Area"
                />
            </div>
        </div>
    );
}