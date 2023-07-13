// precision mediump float;
varying float vRandom;
uniform vec3 uColor;
uniform sampler2D uTexture;
varying vec2 vUv;
varying float velevation;


void main() {
  vec4 textureColor = texture2D(uTexture,vUv);
  textureColor.rbg *= velevation * 2.0 + 0.5;
  gl_FragColor = textureColor;
}

/**
  这段代码是一个简单的片段着色器（Fragment Shader），它决定了渲染到屏幕上的像素的颜色。
  precision mediump float; 是精度修饰符，表示使用中等精度的浮点数进行计算。它是可选的，因为中等精度浮点数是片段着色器的默认精度。
  在 main() 函数中，片段着色器将颜色值赋给内置变量 gl_FragColor，它是片段着色器用于设置输出颜色的特殊变量。
  在这个例子中，gl_FragColor 被设置为 (1.0, 0.0, 0.0, 1.0)，表示红色不透明（RGBA 格式）。这意味着每个渲染到屏幕上的像素将显示为纯红色。
  片段着色器是在渲染管线的片段处理阶段执行的，它决定了最终显示在屏幕上的每个像素的颜色。

  请注意，这段代码只会渲染纯红色。如果你希望渲染其他颜色或根据不同情况进行更复杂的颜色计算，请修改 gl_FragColor 的赋值语句。
*/