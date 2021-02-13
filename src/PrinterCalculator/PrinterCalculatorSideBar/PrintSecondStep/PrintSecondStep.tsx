import React, {useRef} from "react";
import {Button} from "antd";
import {UploadOutlined} from "@ant-design/icons";
import {PRINTER_CALCULATOR_STEP} from "../PrinterCalculatorSideBar";

import "./PrintSecondStep.less";

interface PrintSecondStepProps {
    setStepStatus: (step: PRINTER_CALCULATOR_STEP, stepState: boolean) => void;
}

export default function PrintSecondStep(props: PrintSecondStepProps) {
    const { setStepStatus } = props;

    return (
        <div className="PrintSecondStep">
            <h4 className="PrintSecondStep__title">Model properties:</h4>
        </div>
    );
}