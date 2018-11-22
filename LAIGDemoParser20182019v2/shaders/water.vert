#ifdef GL_ES
precision highp float;
#endif

attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

varying vec2 vTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

uniform sampler2D wavemap;
uniform float heightscale;
uniform float texscale;
uniform float offset;

void main()
{
    vTextureCoord = aTextureCoord;

    vec3 newPos = vec3(aVertexPosition.x, aVertexPosition.y + texture2D(wavemap, aTextureCoord * texscale + offset)[0] * heightscale, aVertexPosition.z);
    
    gl_Position = uPMatrix * uMVMatrix * vec4(newPos,1.0);
}