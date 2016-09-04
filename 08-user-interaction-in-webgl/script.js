var gl;
var shaderProgram;
var vertices;
var vertexCount = 5000;
var mouseX = 0;
var mouseY = 0;


canvas.addEventListener('mousemove', function(event) {
  // Normalize mouse coordinates between -1 and 1
  mouseX = map(event.clientX, 0, canvas.width, -1, 1);
  mouseY = map(event.clientY, 0, canvas.width, 1, -1);
});

function map(value, minSrc, maxSrc, minDest, maxDest) {
  return (value - minSrc) / (maxSrc - minSrc) * (maxDest - minDest) + minDest;
}

function initGL() {
  var canvas = document.getElementById('canvas');
  gl = canvas.getContext('webgl');
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(1, 1, 1, 1);
}

//
// getShader
//
// Loads a shader program by scouring the current document,
// looking for a script with the specified ID.
//
function getShader(gl, id) {
  var shaderScript = document.getElementById(id);

  // Didn't find an element with the specified ID; abort.

  if (!shaderScript) {
    return null;
  }

  // Walk through the source element's children, building the
  // shader source string.

  var theSource = "";
  var currentChild = shaderScript.firstChild;

  while(currentChild) {
    if (currentChild.nodeType == 3) {
      theSource += currentChild.textContent;
    }

    currentChild = currentChild.nextSibling;
  }

  // Now figure out what type of shader script we have,
  // based on its MIME type.

  var shader;

  if (shaderScript.type == "x-shader/x-fragment") {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (shaderScript.type == "x-shader/x-vertex") {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
    return null;  // Unknown shader type
  }

  // Send the source to the shader object

  gl.shaderSource(shader, theSource);

  // Compile the shader program

  gl.compileShader(shader);

  // See if it compiled successfully

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
    return null;
  }

  return shader;
}

function createShaders() {
	var vertexShader = getShader(gl, 'shader-vs');
	var fragmentShader = getShader(gl, 'shader-fs');

  shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  gl.useProgram(shaderProgram);
}

function createVertices() {
  vertices = [];

  for (var i = 0; i < vertexCount; i++) {
    vertices.push(Math.random() * 2 - 1);
    vertices.push(Math.random() * 2 - 1);
  }

  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW); // Use DYNAMIC_DRAW FOR CONSTANTLY CHANGING ARRAYS

  var coords = gl.getAttribLocation(shaderProgram, 'coords');
  gl.vertexAttribPointer(coords, 2, gl.FLOAT, false, 0, 0);  // Change to only 2 values
  gl.enableVertexAttribArray(coords);
  //gl.bindBuffer(gl.ARRAY_BUFFER, null);

  var pointSize = gl.getAttribLocation(shaderProgram, 'pointSize');
  gl.vertexAttrib1f(pointSize, 10);

  var color = gl.getUniformLocation(shaderProgram, 'color');
  gl.uniform4f(color, 0, 1, 0, 1);
}

function draw() {
  for (var i = 0; i < vertexCount * 2; i += 2) {
    var dx = vertices[i] - mouseX;
    var dy = vertices[i+1] - mouseY;
    var dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 0.2) {
      // if the points are with a radius of the mouse, mouse them out
      vertices[i] = mouseX + dx / dist * 0.2; 
      vertices[i+1] = mouseY + dy / dist * 0.2; 
    } else {
      vertices[i] += Math.random() * 0.01 - 0.005;
      vertices[i+1] += Math.random() * 0.01 - 0.005;
    }
  }
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(vertices));
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.POINTS, 0, vertexCount);    // Fill in line loop

  requestAnimationFrame(draw);
}

initGL();
createShaders();
createVertices();
draw();
