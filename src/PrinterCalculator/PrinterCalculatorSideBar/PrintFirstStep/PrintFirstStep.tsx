import React, {useRef} from "react";
import {Button} from "antd";
import {UploadOutlined} from "@ant-design/icons";
import {PRINTER_CALCULATOR_STEP} from "../PrinterCalculatorSideBar";

import "./PrintFirstStep.less";

interface PrintFirstStepProps {
    setStepStatus: (step: PRINTER_CALCULATOR_STEP, stepState: boolean) => void;
    loadSTLGeometry: (path: string) => void;
}

export default function PrintFirstStep(props: PrintFirstStepProps) {
    const { loadSTLGeometry, setStepStatus } = props;
    const uploadInputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="PrintFirstStep">
            <h4 className="PrintFirstStep__title">Upload your 3D model and you can:</h4>

            <div className="PrintFirstStep__benefits">
                <div className="PrintFirstStep__benefitsItem">
                    <span>1</span>
                    <p>Find out the cost of production</p>
                </div>
                <div className="PrintFirstStep__benefitsItem">
                    <span>2</span>
                    <p>Compare the cost of different technologies and materials</p>
                </div>
                <div className="PrintFirstStep__benefitsItem">
                    <span>3</span>
                    <p>Place and pay for the order online</p>
                </div>
            </div>

            <Button
                className="PrintFirstStep__uploadButton"
                icon={<UploadOutlined />}
                onClick={() => {
                    if (uploadInputRef && uploadInputRef.current) {
                        uploadInputRef.current.click();
                    }
                }}
            >
                Upload file
            </Button>

            <div className="PrintFirstStep__acceptedFormat">
                <p>Accepted file formats: <strong>STL</strong></p>
            </div>

            <input
                ref={uploadInputRef}
                className="PrintFirstStep__uploadInput"
                accept=".stl"
                type="file"
                onChange={(event) => {
                    if (event && event.target && event.target.files) {
                        const path: string = (window.URL || window.webkitURL).createObjectURL(event.target.files[0]);

                        if (path) {
                            setStepStatus(PRINTER_CALCULATOR_STEP.FIRST_STEP, true);
                            loadSTLGeometry(path);
                        }
                    }
                }}
            />
        </div>
    );
}