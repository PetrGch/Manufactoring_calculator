import React, {useEffect, useRef} from "react";
import * as THREE from "three";
import {BufferGeometry, OrthographicCamera, PerspectiveCamera, Scene, WebGLRenderer} from "three";
import CncCalculatorScene from "./CncCalculatorScene/CncCalculatorScene";
import {STLLoader} from "three/examples/jsm/loaders/STLLoader";

import "./CncCalculator.less";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {AnaglyphEffect} from "three/examples/jsm/effects/AnaglyphEffect";
import {MeshSurfaceSampler} from "three/examples/jsm/math/MeshSurfaceSampler";
import {GCodeLoader} from "three/examples/jsm/loaders/GCodeLoader";
import {TransformControls} from "three/examples/jsm/controls/TransformControls";

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

export default function CncCalculator() {
    const mountRef = useRef<HTMLDivElement>(null);
    let scene: Scene, renderer: WebGLRenderer, camera: PerspectiveCamera, camera2: OrthographicCamera, loader: STLLoader;

    useEffect(() => {
        if (mountRef && mountRef.current) {
            const offsetWidth = mountRef.current.clientWidth;
            const offsetHeight = mountRef.current.clientHeight;
            //
            // console.log(offsetWidth, offsetHeight);
            //
            // scene = new THREE.Scene();
            // camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
            // renderer = new THREE.WebGLRenderer();
            //
            // renderer.setSize( window.innerWidth, window.innerHeight );
            // mountRef.current.appendChild(renderer.domElement);
            //
            // // const geometry = new THREE.BoxGeometry(1, 1, 1);
            // // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
            // // const cube = new THREE.Mesh(geometry, material);
            // //
            // // scene.add(cube);
            // camera.position.z = 5;
            //
            // loader = new STLLoader();
            // // loader.load("./modules/GoPro_cover.stl", (geometry) => {
            // //     console.log("geometry", geometry)
            // //
            // //     const material = new THREE.MeshPhongMaterial( { color: 0xAAAAAA, specular: 0x111111, shininess: 200 } );
            // //     const mesh = new THREE.Mesh( geometry, material );
            // //
            // //     mesh.position.set( 0, - 0.37, - 0.6 );
            // //     mesh.rotation.set( - Math.PI / 2, 0, 0 );
            // //     mesh.scale.set( 1, 1, 1 );
            // //
            // //     mesh.castShadow = true;
            // //     mesh.receiveShadow = true;
            // //
            // //     scene.add( mesh );
            // // }, (data) => console.log("inProgress", data), (error) => console.log("error", error))
            //
            // loader.load(
            //     "./modules/GoPro_cover.stl",
            //     function(geometry) {
            //         console.log("geometry", geometry)
            //         const material = new THREE.MeshNormalMaterial()
            //         const mesh = new THREE.Mesh(geometry, material)
            //         scene.add(mesh)
            //     },
            //     function(progress) {
            //         console.log(progress)
            //     },
            //     function (error) {
            //         console.log(error)
            //     })
            //
            // const animate = function() {
            //     requestAnimationFrame(animate);
            //
            //     // cube.rotation.x += 0.01;
            //     // cube.rotation.y += 0.01;
            //
            //     renderer.render(scene, camera);
            // }
            //
            // animate();


            scene = new THREE.Scene();
            scene.background = new THREE.Color(0xcccccc)
            scene.rotateX(-(90 * Math.PI/180))
            // scene.position.x = -100;
            // camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000);
            // camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

            camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
            camera.position.x = 1;
            // camera.position.y = 30
            // camera.rotateX(1.5708)
            // camera.position.y = 30;

            const axesHelper = new THREE.AxesHelper( 100);
            scene.add( axesHelper );

            renderer = new THREE.WebGL1Renderer();

            renderer.setSize(offsetWidth, offsetHeight);
            mountRef.current.appendChild(renderer.domElement);

            window.addEventListener("resize", function() {
                const width = window.innerWidth;
                const height = window.innerHeight;

                renderer.setSize(offsetWidth, offsetHeight);

                camera.aspect = width / height;
                camera.updateProjectionMatrix();
                (window as any).controls.update();
            });
            // @ts-ignore
            window.controls = new OrbitControls(camera, renderer.domElement)

            // const trControls = new TransformControls(camera, renderer.domElement);
            // scene.add(trControls);

            // camera.position.z = 1;
            // camera.position.x = 10;
            // camera.position.y = 1;

            // const effect = new AnaglyphEffect(renderer);
            // effect.setSize(window.innerWidth, window.innerHeight);


            // const loader = new GCodeLoader();
            // loader.load( './modules/CCR10_GoPro_cover.gcode', function ( object ) {
            //
            //     object.position.set( 0,0, 0 );
            //     console.log(object)
            //     scene.add( object );
            //
            //     render();
            //
            // } );

            loader = new STLLoader();
            loader.load(
                "./modules/GoPro_cover.stl",
                function(geometry) {
                    // const material = new THREE.MeshNormalMaterial()
                    const box = new THREE.BoxBufferGeometry(100, 100, 100, 10, 10, 10);
                    const edges = new THREE.EdgesGeometry( box );
                    const line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0xffffff } ) );
                    scene.add( line );
                    const material = new THREE.LineBasicMaterial()
                    const meshBox = new THREE.Mesh(box, material)
                    const mesh = new THREE.Mesh(geometry, material)
                    const some = new MeshSurfaceSampler(mesh)
                    // scene.add(meshBox)
                    // trControls.attach(line)

                    const sphere = new THREE.SphereGeometry(100);
                    const object = new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xff0000} ) );
                    const boxHelper = new THREE.BoxHelper( object, 0xffff00 );
                    scene.add( boxHelper );

                    geometry.computeBoundingBox();
                    const bb = geometry.boundingBox;
                    if (bb) {
                        const width = bb.max.x - bb.min.x;
                        const height = bb.max.y - bb.min.y;
                        const depth = bb.max.z - bb.min.z;

                        console.log(width, height, depth)

                        // camera.position.x = width * 4;
                        camera.position.set( width * 4, 90, 0 );
                        (window as any).controls.update();
                    }
                    // mesh.scale.set(0.5, 0.5, 0.5);
                    // mesh.rotateZ(90)
                    // geometry.scale(0.5, 0.5, 0.5)
                    // mesh.rotateX(-1.5708)
                    // mesh.rotateY(90)
                    // mesh.position.x = -80
                    mesh.name = "some";
                    scene.add(mesh)
                },
                function(progress) {
                    console.log(progress)
                },
                function (error) {
                    console.log(error)
                })

            const update = function() {
                // geometry.cube.rotation.x += 0.01;
                // geometry.cube.rotation.y += 0.005;
            }

            const render = function() {
                renderer.render(scene, camera);
                // effect.render(scene, camera);
            }

            const gameLoop = function() {
                requestAnimationFrame(gameLoop);

                update();
                render();
            }

            gameLoop();

        }
    }, [])

    return (
        <div className="CncCalculator">
            <CncCalculatorScene
                ref={mountRef}
            />

            <input type="file" onChange={(event) => {
                if (event && event.target && event.target.files) {
                    var path = (window.URL || window.webkitURL).createObjectURL(event.target.files[0]);
                    console.log(event, path)

                    loader.load(
                        path,
                        function(geometry) {
                            const previousObject = scene.getObjectByName("some");

                            if (previousObject) {
                                scene.remove(previousObject);
                            }
                            const material = new THREE.MeshNormalMaterial()
                            const mesh = new THREE.Mesh(geometry, material)
                            const box = new THREE.BoxHelper(mesh, 0xffff00)

                            geometry.computeBoundingBox();
                            const bb = geometry.boundingBox;
                            if (bb) {
                                const width = bb.max.x - bb.min.x;
                                const height = bb.max.y - bb.min.y;
                                const depth = bb.max.z - bb.min.z;

                                console.log(width, height, depth)

                                // camera.position.x = width * 2;
                                camera.position.set( width * 4, 90, 0 );
                                (window as any).controls.update();
                            }
                            // mesh.scale.set(0.5, 0.5, 0.5);
                            // mesh.rotateZ(90)
                            // geometry.scale(0.5, 0.5, 0.5)
                            // mesh.rotateX(-1.5708)
                            // mesh.rotateY(90)
                            // mesh.position.x = -80
                            mesh.name = "some";
                            scene.add(box)
                        },
                        function(progress) {
                            console.log(progress)
                        },
                        function (error) {
                            console.log(error)
                        })

                    // loader.load("./modules/GoPro_cover.stl", (geometry) => {
                    //     console.log("geometry", geometry)
                    //
                    //     const material = new THREE.MeshPhongMaterial( { color: 0xAAAAAA, specular: 0x111111, shininess: 200 } );
                    //     const mesh = new THREE.Mesh( geometry, material );
                    //
                    //     mesh.position.set( 0, - 0.37, - 0.6 );
                    //     mesh.rotation.set( - Math.PI / 2, 0, 0 );
                    //     mesh.scale.set( 0.5, 0.5, 0.5 );
                    //
                    //     mesh.castShadow = true;
                    //     mesh.receiveShadow = true;
                    //
                    //     scene.add( mesh );
                    // }, (data) => console.log("inProgress", data), (error) => console.log("error", error))
                }
            }}/>
        </div>
    );
}