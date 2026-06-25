import { useEffect, useRef } from 'react'

// Faithful port of the Stitch "Shader" — a navy→gold "lifting" flow with
// animated noise, pulse, and vignette. Raw WebGL (no three.js), so it stays
// tiny and loads with the main bundle.
const VERT = `
attribute vec2 a_position;
attribute vec2 a_texCoord;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_texCoord;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`

const FRAG = `
precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
varying vec2 v_texCoord;
void main() {
  vec2 uv = v_texCoord;
  float aspect = u_resolution.x / u_resolution.y;
  uv.x *= aspect;
  vec3 navy = vec3(0.102, 0.153, 0.267);
  vec3 gold = vec3(0.722, 0.588, 0.047);
  vec3 lightGold = vec3(0.992, 0.953, 0.784);
  float noise = sin(uv.x * 3.0 + u_time * 0.5) * cos(uv.y * 2.0 - u_time * 0.8);
  noise += sin(uv.y * 5.0 + u_time * 1.2) * 0.5;
  float gradient = smoothstep(0.0, 0.8, uv.y + noise * 0.1);
  vec3 color = mix(navy, gold, gradient * 0.4);
  color = mix(color, lightGold, pow(gradient, 3.0) * 0.6);
  float pulse = sin(u_time * 0.5) * 0.1 + 0.9;
  color *= pulse;
  float dist = distance(v_texCoord, vec2(0.5));
  color *= smoothstep(0.8, 0.2, dist);
  gl_FragColor = vec4(color, 1.0);
}`

function compile(gl, type, src) {
  const sh = gl.createShader(type)
  gl.shaderSource(sh, src)
  gl.compileShader(sh)
  return sh
}

export default function ShaderBackground({ className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const gl = canvas.getContext('webgl')
    if (!gl) return

    const prog = gl.createProgram()
    gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT))
    gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(prog)
    gl.useProgram(prog)

    // full-screen quad
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 0, 0, 1, -1, 1, 0, -1, 1, 0, 1, 1, 1, 1, 1]),
      gl.STATIC_DRAW
    )
    const aPos = gl.getAttribLocation(prog, 'a_position')
    const aTex = gl.getAttribLocation(prog, 'a_texCoord')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 16, 0)
    gl.enableVertexAttribArray(aTex)
    gl.vertexAttribPointer(aTex, 2, gl.FLOAT, false, 16, 8)

    const uTime = gl.getUniformLocation(prog, 'u_time')
    const uRes = gl.getUniformLocation(prog, 'u_resolution')

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = canvas.clientWidth * dpr
      const h = canvas.clientHeight * dpr
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
        gl.viewport(0, 0, w, h)
      }
    }

    let raf
    let t = 0
    const render = () => {
      raf = requestAnimationFrame(render)
      resize()
      t += 0.016
      gl.uniform1f(uTime, t)
      gl.uniform2f(uRes, canvas.width, canvas.height)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }
    render()

    return () => {
      cancelAnimationFrame(raf)
      gl.deleteProgram(prog)
      gl.deleteBuffer(buf)
    }
  }, [])

  return <canvas ref={ref} className={className} />
}
