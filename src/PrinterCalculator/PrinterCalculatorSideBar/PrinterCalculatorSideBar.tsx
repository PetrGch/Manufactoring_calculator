import React, {useEffect, useRef, useState} from "react";
import {Button} from "antd";
import {UploadOutlined} from "@ant-design/icons";

import "./PrinterCalculatorSideBar.less";
import PrintFirstStep from "./PrintFirstStep/PrintFirstStep";
import PrintSecondStep from "./PrintSecondStep/PrintSecondStep";

export enum PRINTER_CALCULATOR_STEP {
    FIRST_STEP = "FIRST_STEP",
}

interface PrinterCalculatorSideBarState {
    [PRINTER_CALCULATOR_STEP.FIRST_STEP]: boolean
}

interface PrinterCalculatorSideBarProps {
    loadSTLGeometry: (path: string) => void;
}

export default function PrinterCalculatorSideBar(props: PrinterCalculatorSideBarProps) {
    const { loadSTLGeometry } = props;
    const uploadInputRef = useRef<HTMLInputElement>(null);
    const [state, setState] = useState<PrinterCalculatorSideBarState>({
        [PRINTER_CALCULATOR_STEP.FIRST_STEP]: false,
    });

    const setStepStatus = (step: PRINTER_CALCULATOR_STEP, stepState: boolean) => {
        setState({
            ...state,
            [step]: stepState
        })
    }

    return (
        <div className="PrinterCalculatorSideBar">
            <div className="PrinterCalculatorSideBar__step">
                <PrintFirstStep
                    loadSTLGeometry={loadSTLGeometry}
                    setStepStatus={setStepStatus}
                />
            </div>

            <div className="PrinterCalculatorSideBar__step PrinterCalculatorSideBar__step_topPadding">
                <PrintSecondStep
                    setStepStatus={setStepStatus}
                />
            </div>
        </div>
    )
}