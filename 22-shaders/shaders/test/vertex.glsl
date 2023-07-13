// uniform mat4 projectionMatrix;
// uniform mat4 viewMatrix;
// uniform mat4 modelMatrix;
uniform vec2 uFrequency;
uniform float uTime;

// attribute vec3 position;
// attribute vec2 uv;
attribute float aRandom;

varying float vRandom;
varying vec2 vUv;
varying float velevation;

void main(){
  vec4 modelPosition = modelMatrix * vec4(position,1.0);
  // modelPosition.z += aRandom * 0.1;
  // vRandom = aRandom;

  float elevation = sin(modelPosition.x * uFrequency.x - uTime) * .1;
  elevation += sin(modelPosition.y * uFrequency.y - uTime) * .1;
  modelPosition.z += elevation;

  modelPosition.z += sin(modelPosition.x * uFrequency.x - uTime) * .1;
  modelPosition.z += sin(modelPosition.y * uFrequency.y - uTime) * .1;


  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectionPosition = projectionMatrix * viewPosition;
  gl_Position = projectionPosition;
  vUv = uv;
  velevation =elevation;

  // gl_Position = projectionMatrix * modelMatrix * viewMatrix * vec4(position,1.0);
}

/**
  这段代码是一个基本的顶点着色器（Vertex Shader），它通过对顶点的处理来进行图形渲染。
  其中，projectionMatrix、viewMatrix 和 modelMatrix 是三个 uniform 变量，它们分别代表投影矩阵、视图矩阵和模型矩阵。这些矩阵是在渲染过程中用于转换和定位顶点的关键变换矩阵。
  attribute vec3 position 是顶点的 attribute 属性，它表示每个顶点的位置信息。通常，这个属性由顶点数据提供，并且在渲染过程中会传递给顶点着色器。
  在 main() 函数中，顶点着色器使用上述变量和属性，将顶点位置经过一系列的矩阵变换计算后，将结果赋值给 gl_Position，该变量定义了顶点的最终屏幕坐标。
  具体而言，这段代码通过将 position 向量转换为齐次坐标（homogeneous coordinates），并与模型矩阵、视图矩阵和投影矩阵相乘，最终得到在裁剪空间中的坐标位置。
  最后，gl_Position 变量会被传递给后续的渲染管线阶段进行处理和渲染。
  这段顶点着色器代码的作用是将顶点位置从模型空间（Model Space）变换到裁剪空间（Clip Space），以便进行透视投影和视口变换，最终在屏幕上呈现。它是渲染图形过程中非常重要的一部分。
  */