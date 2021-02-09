import React, {useEffect, useRef} from "react";
import * as THREE from "three";
import {BufferGeometry, OrthographicCamera, PerspectiveCamera, Scene, WebGLRenderer} from "three";
import PrinterCalculatorScene from "./PrinterCalculatorScene/PrinterCalculatorScene";
import {STLLoader} from "three/examples/jsm/loaders/STLLoader";

import "./PrinterCalculator.less";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {AnaglyphEffect} from "three/examples/jsm/effects/AnaglyphEffect";
import {MeshSurfaceSampler} from "three/examples/jsm/math/MeshSurfaceSampler";
import {GCodeLoader} from "three/examples/jsm/loaders/GCodeLoader";
import {TransformControls} from "three/examples/jsm/controls/TransformControls";
import {Material} from "three/src/materials/Material";
import {LineSegments} from "three/src/objects/LineSegments";

function getVolume(geometry: any) {
    if (!geometry.isBufferGeometry) {
        console.log("'geometry' must be an indexed or non-indexed buffer geometry");
        return 0;
    }
    var isIndexed = geometry.index !== null;
    let position = geometry.attributes.position;
    let sum = 0;
    let p1 = new THREE.Vector3(),
        p2 = new THREE.Vector3(),
        p3 = new THREE.Vector3();
    if (!isIndexed) {
        let faces = position.count / 3;
        for (let i = 0; i < faces; i++) {
            p1.fromBufferAttribute(position, i * 3 + 0);
            p2.fromBufferAttribute(position, i * 3 + 1);
            p3.fromBufferAttribute(position, i * 3 + 2);
            sum += signedVolumeOfTriangle(p1, p2, p3);
        }
    }
    else {
        let index = geometry.index;
        let faces = index.count / 3;
        for (let i = 0; i < faces; i++){
            p1.fromBufferAttribute(position, index.array[i * 3 + 0]);
            p2.fromBufferAttribute(position, index.array[i * 3 + 1]);
            p3.fromBufferAttribute(position, index.array[i * 3 + 2]);
            sum += signedVolumeOfTriangle(p1, p2, p3);
        }
    }
    return sum;
}

function signedVolumeOfTriangle(p1: any, p2: any, p3: any) {
    return p1.dot(p2.cross(p3)) / 6.0;
}

const PRINTER_MASH_NAME = "printer_mesh";

export default function PrinterCalculator() {
    const mountRef = useRef<HTMLDivElement>(null);
    let scene: Scene,
        renderer: WebGLRenderer,
        camera: PerspectiveCamera,
        loader: STLLoader,
        mesh,
        boxHelper: LineSegments,
        material: Material,
        offsetWidth: number,
        offsetHeight: number;

    const resizeWindowListener = () => {
        renderer.setSize(offsetWidth, offsetHeight);

        camera.aspect = offsetWidth / offsetHeight;
        camera.updateProjectionMatrix();
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
        if (mountRef && mountRef.current) {
            const axesHelper = new THREE.AxesHelper( 100);
            material = new THREE.MeshNormalMaterial();
            offsetWidth = mountRef.current.clientWidth;
            offsetHeight = mountRef.current.clientHeight;

            scene = new THREE.Scene();
            scene.background = new THREE.Color(0xcccccc)
            scene.rotateX(-(90 * Math.PI/180))
            scene.add( axesHelper );

            camera = new THREE.PerspectiveCamera( 45, offsetWidth / offsetHeight, 0.1, 1000 );
            camera.position.set( 1, 90, 0 );

            renderer = new THREE.WebGL1Renderer();
            renderer.setSize(offsetWidth, offsetHeight);

            loader = new STLLoader();

            // @ts-ignore
            window.controls = new OrbitControls(camera, renderer.domElement)
            window.addEventListener("resize", resizeWindowListener);

            mountRef.current.appendChild(renderer.domElement);
            animationLoop();
        }
    }

    const loadSTLGeometry = (path: string) => {
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
                const bb = geometry.boundingBox;
                if (bb) {
                    const width = bb.max.x - bb.min.x;
                    const height = bb.max.y - bb.min.y;
                    const depth = bb.max.z - bb.min.z;

                    camera.position.set( width * 4, 90, 0 );
                }
                scene.add(mesh);
                scene.add(boxHelper);
            },
            function(progress) {
                console.info(progress)
            },
            function (error) {
                console.error(error)
            })
    }

    useEffect(() => {
        init();

        return () => {
            window.removeEventListener("resize", resizeWindowListener);
        }
    }, [])

    return (
        <div className="CncCalculator">
            <PrinterCalculatorScene
                ref={mountRef}
            />

            <input type="file" onChange={(event) => {
                if (event && event.target && event.target.files) {
                    const path: string = (window.URL || window.webkitURL).createObjectURL(event.target.files[0]);

                    loadSTLGeometry(path)
                }
            }}/>
        </div>
    );
}