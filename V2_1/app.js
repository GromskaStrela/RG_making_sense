//import { shaders } from './shaders.js';
import { mat4 } from './lib/gl-matrix-module.js';

//SHADERS => direktno v kodi ker je js faking retardiran
const vertex = `#version 300 es
precision mediump float;

in vec3 aPosition;
in vec4 aColor;
out vec4 vColor;

uniform mat4 mWorld;
uniform mat4 mView;
uniform mat4 mProj;


void main() {
    vColor = aColor;
    gl_Position = mProj * mView * mWorld * vec4(aPosition, 1.0);
}
`;
//SRANJE TAM ZGORAJ IN TAM SPODAJ MORA IMET UJEMAJOCA SE IMENA
//SHADERJI*
const fragment = `#version 300 es
precision mediump float;

in vec4 vColor;
out vec4 oColor;

void main() {
    oColor = vColor;
}
`;


//const program = init();

//export class Application {
let init = function(){
    console.log("This is working")

    let canvas = document.getElementById("igralnaPovrsina");
    let gl = canvas.getContext("webgl2")

    if(!gl){
        console.log("WebGL2 not supported")
        alert("Tvoj brovzer je za en drek");
    }

    /*canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, window.innerWidth, window.innerHeight);*/

    gl.clearColor(0, 0, 0, 1);        //RGBA[255,255,255,1]
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);        //pobrise barve in globine

    //SHADERS
    //CREATING
    let vertexShader = gl.createShader(gl.VERTEX_SHADER);
    let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertex);
    gl.shaderSource(fragmentShader, fragment);

    gl.compileShader(vertexShader);
    if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)){
        console.log("ERR[compiling vertex shader]: ", gl.getShaderInfoLog(vertexShader));
        return;
    }
    gl.compileShader(fragmentShader);
    if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)){
        console.log("ERR[compiling fragment shader]: ", gl.getShaderInfoLog(fragmentShader));
        return;
    }

    let program = gl.createProgram();       //celotni cevovod
    gl.attachShader(program, vertexShader);     //sam od sebe ve, ker je keri
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
        console.log("ERR[linking program]: ", gl.getProgramInfoLog(program));
        return;
    }

    /*naslednji korak ponavadi samo v testiranju
    */
    gl.validateProgram(program); 
    if(!gl.getProgramParameter(program, gl.VALIDATE_STATUS)){
        console.log("ERR[validating program]: ", gl.getProgramInfoLog(program));
        return;
    }


    //BUFFERS
    let trikotnik = [       //X, Y, Z, R, G, B, A
        0.0, 0.5, 0.0,              1.0, 0.0, 0.0, 1.0, 
        -0.5, -0.5, 0.0,            0.0, 1.0, 0.0, 1.0,
        0.5, -0.5, 0.0,             0.0, 0.0, 1.0, 1.0
    ];
    
    let trikotnikBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, trikotnikBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(trikotnik), gl.STATIC_DRAW);

    let positionAttribLocation = gl.getAttribLocation(program, "aPosition");
                            //pozicija v pomnilniku, st. elementov, tip elementov, normalizacija?, velikost, 
    gl.vertexAttribPointer(
        positionAttribLocation, 
        3, 
        gl.FLOAT, 
        gl.FALSE, 
        7 * Float32Array.BYTES_PER_ELEMENT, 
        0
    );
    gl.enableVertexAttribArray(positionAttribLocation);

    let colorAttribLocation = gl.getAttribLocation(program, "aColor");
    gl.enableVertexAttribArray(colorAttribLocation);
    gl.vertexAttribPointer(
        colorAttribLocation, 
        4, 
        gl.FLOAT, 
        gl.FALSE, 
        7 * Float32Array.BYTES_PER_ELEMENT, 
        3 * Float32Array.BYTES_PER_ELEMENT
    );


    //WebGL rabi vedit ker program uporabla
    gl.useProgram(program);

    //UNIFORMS
    let matWorldUniformLocation = gl.getUniformLocation(program, "mWorld");
    let matViewUniformLocation = gl.getUniformLocation(program, "mView");
    let matProjUniformLocation = gl.getUniformLocation(program, "mProj");

    let worldMatrix = new Float32Array(16);
    let viewMatrix = new Float32Array(16);
    let projMatrix = new Float32Array(16);
    mat4.identity(worldMatrix);
    mat4.lookAt(viewMatrix, [0, 0, -5], [0, 0, 0], [0, 1, 0]);
    mat4.perspective(projMatrix, (Math.PI * 45) / 180, canvas.clientWidth / canvas.clientHeight, 0.1, 1000.0);

    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
    gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
    gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);


    //MAIN LOOP
    let ang = 0;
    let idMatrix = new Float32Array(16);
    mat4.identity(idMatrix);
    let loop = function(){
        ang = performance.now() / 1000 / 6 * 2 * Math.PI;
        mat4.rotate(worldMatrix, idMatrix, ang, [1, 1, 1]);
        gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

        gl.clearColor(0, 0, 0, 1);        //RGBA[255,255,255,1]
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);        //pobrise barve in globine
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);

}
//}


window.addEventListener("load", init);
//JUNK
/*TKO JE DELU UN MODEL NA YT (Indigo Code) => dobesedno sam importam iz shader.js
let vertexShaderText = [
    "#version 300 es",
    "precision mediump float;",
    "",
    "in vec2 aPosition;",
    "",
    "void main() {",
        "gl_Position = vec4(aPosition, 0.0, 1.0);",
    "}"
].join("\n");

let fragmentShaderText=[
    "#version 300 es",
    "",
    "in vec4 vColor;",
    "",
    "void main() {",
        "gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);",
    "}"
].join("\n");
/** @type {WebGLRenderingContext} /*
//const gl = init();
*/