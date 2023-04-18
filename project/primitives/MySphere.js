import { CGFobject } from "../../lib/CGF.js";
/**
 * MySphere
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MySphere extends CGFobject {
  constructor(scene, slices, stacks, inverted, radius) {
    super(scene);
    this.latitude = stacks * 2;
    this.longitude = slices;
    this.inverted = inverted;
    this.radius = radius;
    if (radius == undefined) {
      this.radius = 5;
    }
    this.initBuffers();
  }

  initBuffers() {
    this.vertices = [];
    this.normals = [];
    this.texCoords = [];
    this.indices = [];
    
    const latDelta = Math.PI / this.latitude;
    const lonDelta = (2 * Math.PI) / this.longitude;
    let latAngle = 0;
    let lonAngle = 0;

    for (let i = 0; i < this.latitude; i++) {
        const latCos = Math.cos(latAngle + i * latDelta);
        const latSin = Math.sin(latAngle + i * latDelta);
        
        for (let j = 0; j <= this.longitude; j++) {
            const lonCos = Math.cos(lonAngle + j * lonDelta);
            const lonSin = Math.sin(lonAngle + j * lonDelta);

            const x = lonSin * latSin;
            const y = latCos;
            const z = lonCos * latSin ;

            this.vertices.push(x * this.radius, y * this.radius, z * this.radius);

            if (this.inverted) {
                this.normals.push(-x, -y, -z);
            } else {
                this.normals.push(x, y, z);
            }
            
            if (i != this.latitude - 1) {
                const current = i * (this.longitude + 1) + j;
                const next = (i * (this.longitude + 1) + (j + 1) % (this.longitude + 1));
                const currentForward = (i + 1) * (this.longitude + 1) + j;
                const nextForward = ((i + 1) * (this.longitude + 1) + (j + 1) % (this.longitude + 1));
                
                if (this.inverted) {
                    this.indices.push(next, currentForward, current);
                    this.indices.push(nextForward, currentForward, next);
                } else {
                    this.indices.push(current, currentForward, next);
                    this.indices.push(next, currentForward, nextForward);
                }       
            }

            this.texCoords.push(j/this.longitude, i/(this.latitude - 1));
        }
    }

    this.primitiveType = this.scene.gl.TRIANGLES;

    this.initGLBuffers();
  }
}