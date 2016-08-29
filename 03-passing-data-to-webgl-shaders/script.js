var gl;
var shaderProgram;

function initGL() {
  var canvas = document.getElementById('canvas');
  gl = canvas.getContext('webgl');
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(1, 1, 1, 1);
}

function createShaders() {
  var vs = '';
  vs += 'attribute vec4 coords;';
  vs += 'void main(void) {';
  vs += '  gl_Position = coords;';
  vs += '  gl_PointSize = 10.0;';
  vs += '}';

  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vs);
  gl.compileShader(vertexShader);

  var fs = '';
  fs += 'void main(void) {';
  fs += '  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);';
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
  var coords = gl.getAttribLocation(shaderProgram, 'coords');
  gl.vertexAttrib3f(coords, -0.5, 0, 0);
}

function draw() {
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.POINTS, 0, 1);
}

initGL();
createShaders();
createVertices();
draw();
