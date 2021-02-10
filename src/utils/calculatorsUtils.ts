import * as THREE from "three";
import {Vector3} from "three";

function signedVolumeOfTriangle(p1: Vector3, p2: Vector3, p3: Vector3) {
    return p1.dot(p2.cross(p3)) / 6.0;
}

export function getVolume(geometry: any) {
    if (!geometry.isBufferGeometry) {
        console.error("'geometry' must be an indexed or non-indexed buffer geometry");

        return 0;
    }

    const isIndexed = geometry.index !== null;
    const position = geometry.attributes.position;
    let sum = 0;
    let p1 = new THREE.Vector3(),
        p2 = new THREE.Vector3(),
        p3 = new THREE.Vector3();

    if (!isIndexed) {
        let faces = position.count / 3;
        for (let i = 0; i < faces; i++) {
            p1.fromBufferAttribute(position, i * 3);
            p2.fromBufferAttribute(position, i * 3 + 1);
            p3.fromBufferAttribute(position, i * 3 + 2);
            sum += signedVolumeOfTriangle(p1, p2, p3);
        }
    } else {
        let index = geometry.index;
        let faces = index.count / 3;
        for (let i = 0; i < faces; i++){
            p1.fromBufferAttribute(position, index.array[i * 3]);
            p2.fromBufferAttribute(position, index.array[i * 3 + 1]);
            p3.fromBufferAttribute(position, index.array[i * 3 + 2]);
            sum += signedVolumeOfTriangle(p1, p2, p3);
        }
    }

    return sum;
}