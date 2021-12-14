//import { shaders } from './shaders.js';

//SHADERS => direktno v kodi ker je js faking retardiran
//precision mediump float;
const vertex = `#version 300 es
precision mediump float;

in vec2 aPosition;
in vec4 aColor;
out vec4 vColor;

void main() {
    vColor = aColor;
    gl_Position = vec4(aPosition, 0.0, 1.0);
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
init = function(){
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
    let trikotnik = [       //X, Y, R, G, B, A
        0.0, 0.5,               1.0, 0.0, 0, 1.0, 
        -0.5, -0.5,             0.0, 1.0, 0.0, 1.0,
        0.5, -0.5,              0.0, 0.0, 1.0, 1.0
    ];
    
    let trikotnikBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, trikotnikBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(trikotnik), gl.STATIC_DRAW);

    let positionAttribLocation = gl.getAttribLocation(program, "aPosition");
                            //pozicija v pomnilniku, st. elementov, tip elementov, normalizacija?, velikost, 
    gl.vertexAttribPointer(
        positionAttribLocation, 
        2, 
        gl.FLOAT, 
        gl.FALSE, 
        6 * Float32Array.BYTES_PER_ELEMENT, 
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
        6 * Float32Array.BYTES_PER_ELEMENT, 
        2 * Float32Array.BYTES_PER_ELEMENT
    );

    //MAIN LOOP
    gl.useProgram(program);
    
    gl.drawArrays(gl.TRIANGLES, 0, 3);

};
//}



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