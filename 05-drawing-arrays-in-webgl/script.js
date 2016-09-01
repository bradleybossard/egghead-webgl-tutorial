var gl;
var shaderProgram;
var vertices;

function initGL() {
  var canvas = document.getElementById('canvas');
  gl = canvas.getContext('webgl');
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(1, 1, 1, 1);
}

function createShaders() {
  var vs = '';
  vs += 'attribute vec4 coords;';
  vs += 'attribute float pointSize;';
  vs += 'void main(void) {';
  vs += '  gl_Position = coords;';
  vs += '  gl_PointSize = pointSize;';
  vs += '}';

  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vs);
  gl.compileShader(vertexShader);

  var fs = '';
  fs += 'precision mediump float;';
  fs += 'uniform vec4 color;';
  fs += 'void main(void) {';
  fs += '  gl_FragColor = color;';
  fs += '}';

  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fs);
  gl.compileShader(fragmentShader);

  shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  gl.useProgram(shaderProgram);
}

function createVertices() {
  vertices = [
    -0.9, -0.9, 0.0,
    0.9, -0.9, 0.0,
    //0.9, -0.9, 0.0,
    0.0, 0.9, 0.0,
    //0.0, 0.9, 0.0,
    //-0.9, -0.9, 0.0
  ];
  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  var coords = gl.getAttribLocation(shaderProgram, 'coords');
  gl.vertexAttribPointer(coords, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(coords);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  var pointSize = gl.getAttribLocation(shaderProgram, 'pointSize');
  gl.vertexAttrib1f(pointSize, 10);

  var color = gl.getUniformLocation(shaderProgram, 'color');
  gl.uniform4f(color, 0, 1, 0, 1);
}

function draw() {
  gl.clear(gl.COLOR_BUFFER_BIT);
  //gl.drawArrays(gl.POINTS, 0, 3);
  //gl.drawArrays(gl.LINES, 0, 6);  // Requires 6 points in array, 2 for each line segment, commented out above
  //gl.drawArrays(gl.LINE_STRIP, 0, 3); // Does not close loop
  //gl.drawArrays(gl.LINE_LOOP, 0, 3);  // Draws a line loop 
  gl.drawArrays(gl.TRIANGLES, 0, 3);    // Fill in line loop

  //gl.drawArrays(gl.LINE_STRIP, 0, 10); // Would connect all the points with 10 points in array
  
  //gl.drawArrays(gl.LINE_STRIP, 0, 3); // Given a 10 point array, draw first three
  //gl.drawArrays(gl.LINE_STRIP, 7, 10); // Given a 10 point array, draw last three
}

initGL();
createShaders();
createVertices();
draw();
