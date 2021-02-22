import React, {useEffect, useRef} from "react";
import * as THREE from "three";
import { UploadOutlined } from '@ant-design/icons';
import {BufferGeometry, Mesh, PerspectiveCamera, Scene, WebGLRenderer} from "three";
import PrinterCalculatorScene from "./PrinterCalculatorScene/PrinterCalculatorScene";
import {STLLoader} from "three/examples/jsm/loaders/STLLoader";

import "./PrinterCalculator.less";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {Material} from "three/src/materials/Material";
import {LineSegments} from "three/src/objects/LineSegments";
import {
    PRINTER_AXES_HELPER_POSITION_X,
    PRINTER_AXES_HELPER_POSITION_Y,
    PRINTER_AXES_HELPER_POSITION_Z,
    PRINTER_AXES_HELPER_SIZE, PRINTER_CAMERA_FAR, PRINTER_CAMERA_FOV, PRINTER_CAMERA_NEAR,
    PRINTER_CAMERA_POSITION_X,
    PRINTER_CAMERA_POSITION_Y,
    PRINTER_CAMERA_POSITION_Z,
    PRINTER_GRID_COLOR_1,
    PRINTER_GRID_COLOR_2,
    PRINTER_GRID_DIMENSION,
    PRINTER_GRID_DIVISION,
    PRINTER_GRID_ROTATE_X,
    PRINTER_SCENE_BACKGROUND,
    PRINTER_SCENE_ROTATE_X
} from "./PrinterCalculatorConstant";
import {Button, Upload} from "antd";
import PrinterCalculatorSideBar from "./PrinterCalculatorSideBar/PrinterCalculatorSideBar";

const PRINTER_MASH_NAME = "printer_mesh";

export default function PrinterCalculator() {
    const sceneRef = useRef<HTMLDivElement>(null);
    const uploadInputRef = useRef<HTMLInputElement>(null);
    let scene: Scene,
        renderer: WebGLRenderer,
        camera: PerspectiveCamera,
        loader: STLLoader,
        mesh: Mesh,
        boxHelper: LineSegments,
        material: Material,
        offsetWidth: number,
        offsetHeight: number;

    const resizeWindowListener = () => {
        if (sceneRef && sceneRef.current) {
            offsetWidth = sceneRef.current.clientWidth;
            offsetHeight = sceneRef.current.clientHeight;
            renderer.setSize(offsetWidth, offsetHeight);

            camera.aspect = offsetWidth / offsetHeight;
            console.log()
            camera.updateProjectionMatrix();
        }
    }

    const update = function() {
        (window as any).controls.update();
    }

    const render = function() {
        renderer.render(scene, camera);
    }

    const animationLoop = function() {
        requestAnimationFrame(animationLoop);

        update();
        render();
    }

    const init = () => {
        if (sceneRef && sceneRef.current) {
            const axesHelper = new THREE.AxesHelper(PRINTER_AXES_HELPER_SIZE);
            material = new THREE.MeshNormalMaterial();
            offsetWidth = sceneRef.current.clientWidth;
            offsetHeight = sceneRef.current.clientHeight;

            scene = new THREE.Scene();
            scene.background = new THREE.Color(PRINTER_SCENE_BACKGROUND)
            scene.rotateX(PRINTER_SCENE_ROTATE_X)
            axesHelper.position.x = PRINTER_AXES_HELPER_POSITION_X;
            axesHelper.position.y = PRINTER_AXES_HELPER_POSITION_Y;
            axesHelper.position.z = PRINTER_AXES_HELPER_POSITION_Z;
            scene.add(axesHelper);

            const gridHelper = new THREE.GridHelper(
                PRINTER_GRID_DIMENSION,
                PRINTER_GRID_DIVISION,
                PRINTER_GRID_COLOR_1,
                PRINTER_GRID_COLOR_2);
            gridHelper.rotateX(PRINTER_GRID_ROTATE_X)
            scene.add(gridHelper);

            camera = new THREE.PerspectiveCamera(
                PRINTER_CAMERA_FOV,
                offsetWidth / offsetHeight,
                PRINTER_CAMERA_NEAR,
                PRINTER_CAMERA_FAR);
            camera.position.set(PRINTER_CAMERA_POSITION_X, PRINTER_CAMERA_POSITION_Y, PRINTER_CAMERA_POSITION_Z);

            renderer = new THREE.WebGL1Renderer();
            renderer.setSize(offsetWidth, offsetHeight);

            loader = new STLLoader();

            // @ts-ignore
            window.controls = new OrbitControls(camera, renderer.domElement)
            window.addEventListener("resize", resizeWindowListener);

            sceneRef.current.appendChild(renderer.domElement);
            animationLoop();
        }
    }

    const loadSTLGeometry = (path: string, loaded?: (geometry: BufferGeometry) => void, error?: (err: ErrorEvent) => void) => {
        if (!path) throw Error("Uploaded file path is incorrect");

        const previousObject = scene.getObjectByName(PRINTER_MASH_NAME);

        if (previousObject) {
            scene.remove(previousObject);
            scene.remove(boxHelper);
        }

        loader.load(
            path,
            (geometry) => {
                mesh = new THREE.Mesh(geometry, material);
                boxHelper = new THREE.BoxHelper(mesh);
                mesh.name = PRINTER_MASH_NAME;

                geometry.computeBoundingBox();
                const boundingBox = geometry.boundingBox;
                if (boundingBox) {
                    const width = boundingBox.max.x - boundingBox.min.x;
                    const height = boundingBox.max.y - boundingBox.min.y;

                    camera.position.set( width * 5, height * 3, 0 );
                }
                scene.add(mesh);
                scene.add(boxHelper);

                if (typeof loaded === "function") {
                    loaded(geometry);
                }
            },
            function(progress) {
                console.info(progress)
            },
            function (err) {
                console.error(err)

                if (typeof error === "function") {
                    error(err);
                }
            })
    }

    useEffect(() => {
        init();

        return () => {
            window.removeEventListener("resize", resizeWindowListener);
        }
    }, [])

    return (
        <div className="PrinterCalculator">
            <div className="PrinterCalculator__scene">
                <PrinterCalculatorScene
                    ref={sceneRef}
                />
            </div>

            <div className="PrinterCalculator__sideBar">
                <PrinterCalculatorSideBar
                    loadSTLGeometry={loadSTLGeometry}
                />
            </div>
        </div>
    );
}