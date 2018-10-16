/**
 * MyTorus
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

class MyTorus extends CGFobject {

    constructor(scene, inner, outter, slices, loops) {
        super(scene);

        this.inner = inner;
        this.outter = outter;
        this.slices = slices;
        this.loops = loops;

        this.initBuffers();
    };

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        for (var j = 0; j <= this.loops; j++) {
            var ang1 = j * 2 * Math.PI / this.loops;

            for (var i = 0; i <= this.slices; i++) {
                var ang2 = i * 2 * Math.PI / this.slices;
                var aux2 = this.outter + (this.inner * Math.cos(ang1));

                this.vertices.push(Math.cos(ang2) * aux2, Math.sin(ang2) * aux2, this.inner * Math.sin(ang1));
                this.normals.push(Math.cos(ang2) * aux2, Math.sin(ang2) * aux2, this.inner * Math.sin(ang1));
                this.texCoords.push(1 - (j / this.loops), 1 - (i / this.slices));
            }
        }

        for (var j = 0; j < this.loops; j++) {
            for (var i = 0; i < this.slices; i++) {
                var aux = i + (j * (this.slices + 1));

                this.indices.push(aux, aux + this.slices + 2, aux + this.slices + 1);
                this.indices.push(aux, aux + 1, aux + this.slices + 2);
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    };
};