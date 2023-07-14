uniform float uSize;
uniform float uTime;

attribute float uScales;
varying vec3 uColor;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  float angle = atan(modelPosition.x, modelPosition.z);
  float distanceToCenter = length(modelPosition.xz);
  float angleOffset = (1.0 / distanceToCenter) * uTime * .2;
  angle += angleOffset;
  modelPosition.x = cos(angle) * distanceToCenter;
  modelPosition.z = sin(angle) * distanceToCenter;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  gl_Position = projectedPosition;

  gl_PointSize = uSize * uScales;
  gl_PointSize *= (1.0 / -viewPosition.z );

  uColor = color;
}