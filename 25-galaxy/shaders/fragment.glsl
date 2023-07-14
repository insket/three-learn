varying vec3 uColor;


void main() {
    float strength = distance(gl_PointCoord ,vec2(.5));
    // strength = step(.5 ,strength);
    // strength = 1.0 - strength;
    strength *= 2.0;
    strength = 1.0 - strength;

    vec3 color = mix(vec3(0.0),uColor,strength);

    gl_FragColor = vec4(color,1.0);
}