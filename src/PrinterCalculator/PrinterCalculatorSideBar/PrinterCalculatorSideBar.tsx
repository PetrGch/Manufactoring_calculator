import React, {useEffect, useRef, useState} from "react";
import {Button} from "antd";
import {UploadOutlined} from "@ant-design/icons";

import "./PrinterCalculatorSideBar.less";
import PrintFirstStep from "./PrintFirstStep/PrintFirstStep";
import PrintSecondStep from "./PrintSecondStep/PrintSecondStep";
import {BufferGeometry} from "three";
import {getModelArea} from "../../utils/calculatorsUtils";

export enum PRINTER_CALCULATOR_STEP {
    FIRST_STEP = "FIRST_STEP",
}

interface PrinterCalculatorSideBarStepState {
    [PRINTER_CALCULATOR_STEP.FIRST_STEP]: boolean
}

interface PrinterCalculatorSideBarParameterState {
    width: number,
    height: number,
    depth: number,
    area: number,
}

interface PrinterCalculatorSideBarProps {
    loadSTLGeometry: (path: string, loaded?: (geometry: BufferGeometry) => void, error?: (err: ErrorEvent) => void) => void;
}

export default function PrinterCalculatorSideBar(props: PrinterCalculatorSideBarProps) {
    const { loadSTLGeometry } = props;
    const [stepState, setStepState] = useState<PrinterCalculatorSideBarStepState>({
        [PRINTER_CALCULATOR_STEP.FIRST_STEP]: false,
    });
    const [parameterState, setParameterState] = useState<PrinterCalculatorSideBarParameterState>({
        width: 0,
        height: 0,
        depth: 0,
        area: 0,
    });

    const setStepStatus = (step: PRINTER_CALCULATOR_STEP, state: boolean) => {
        setStepState({
            ...stepState,
            [step]: state
        })
    }

    const onModelLoaded = (path: string) => {
        loadSTLGeometry(path, (geometry) => {
            geometry.computeBoundingBox();
            const boundingBox = geometry.boundingBox;

            setStepState({
                ...stepState,
                [PRINTER_CALCULATOR_STEP.FIRST_STEP]: true,
            })

            if (boundingBox) {
                const width = boundingBox.max.x - boundingBox.min.x;
                const height = boundingBox.max.z - boundingBox.min.z;
                const depth = boundingBox.max.y - boundingBox.min.y;

                setParameterState({
                    width,
                    height,
                    depth,
                    area: getModelArea(geometry),
                })
            }
        });
    }

    return (
        <div className="PrinterCalculatorSideBar">
            <div className="PrinterCalculatorSideBar__step">
                <PrintFirstStep
                    loadSTLGeometry={onModelLoaded}
                    setStepStatus={setStepStatus}
                />
            </div>

            <div className={`PrinterCalculatorSideBar__step PrinterCalculatorSideBar__step_topPadding PrinterCalculatorSideBar__step_valid-${stepState[PRINTER_CALCULATOR_STEP.FIRST_STEP]}`}>
                <PrintSecondStep
                    setStepStatus={setStepStatus}
                    parameters={parameterState}
                />
            </div>
        </div>
    )
}