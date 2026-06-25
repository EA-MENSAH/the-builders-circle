import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// A slowly rotating constellation of golden nodes connected by faint lines —
// the Circle as a living network of builders. Pure three.js, no extra deps.
export default function ConstellationHero({ className = '' }) {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const w = mount.clientWidth
    const h = mount.clientHeight

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 100)
    camera.position.z = 13

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(w, h)
    mount.appendChild(renderer.domElement)

    const gold = new THREE.Color('#CFA646')
    const lightGold = new THREE.Color('#E9D08A')

    // --- nodes distributed on a sphere (Fibonacci) ---
    const COUNT = 70
    const radius = 6.5
    const positions = []
    for (let i = 0; i < COUNT; i++) {
      const y = 1 - (i / (COUNT - 1)) * 2
      const r = Math.sqrt(1 - y * y)
      const phi = i * Math.PI * (3 - Math.sqrt(5))
      positions.push(
        new THREE.Vector3(Math.cos(phi) * r, y, Math.sin(phi) * r).multiplyScalar(radius)
      )
    }

    const group = new THREE.Group()
    scene.add(group)

    // points
    const ptsGeo = new THREE.BufferGeometry().setFromPoints(positions)
    const ptsMat = new THREE.PointsMaterial({
      color: lightGold,
      size: 0.14,
      transparent: true,
      opacity: 0.95,
      sizeAttenuation: true,
    })
    group.add(new THREE.Points(ptsGeo, ptsMat))

    // lines between near neighbours
    const linePts = []
    for (let i = 0; i < COUNT; i++) {
      for (let j = i + 1; j < COUNT; j++) {
        if (positions[i].distanceTo(positions[j]) < 3.4) {
          linePts.push(positions[i], positions[j])
        }
      }
    }
    const lineGeo = new THREE.BufferGeometry().setFromPoints(linePts)
    const lineMat = new THREE.LineBasicMaterial({
      color: gold,
      transparent: true,
      opacity: 0.18,
    })
    group.add(new THREE.LineSegments(lineGeo, lineMat))

    // a faint wire ring around the sphere
    const ringGeo = new THREE.TorusGeometry(radius + 0.6, 0.012, 8, 120)
    const ringMat = new THREE.MeshBasicMaterial({ color: gold, transparent: true, opacity: 0.25 })
    const ring = new THREE.Mesh(ringGeo, ringMat)
    ring.rotation.x = Math.PI / 2.2
    group.add(ring)

    // pointer parallax
    let targetX = 0
    let targetY = 0
    const onMove = (e) => {
      const x = (e.touches ? e.touches[0].clientX : e.clientX) / window.innerWidth - 0.5
      const y = (e.touches ? e.touches[0].clientY : e.clientY) / window.innerHeight - 0.5
      targetX = x * 0.6
      targetY = y * 0.4
    }
    window.addEventListener('pointermove', onMove)

    let raf
    let t = 0
    const animate = () => {
      t += 0.0025
      group.rotation.y += 0.0016
      group.rotation.x += (targetY - group.rotation.x * 0.5) * 0.02 - 0.0001
      group.rotation.z = Math.sin(t) * 0.04
      group.position.x += (targetX - group.position.x) * 0.04
      ring.rotation.z += 0.001
      renderer.render(scene, camera)
      raf = requestAnimationFrame(animate)
    }
    animate()

    const onResize = () => {
      const nw = mount.clientWidth
      const nh = mount.clientHeight
      camera.aspect = nw / nh
      camera.updateProjectionMatrix()
      renderer.setSize(nw, nh)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('resize', onResize)
      ptsGeo.dispose()
      lineGeo.dispose()
      ringGeo.dispose()
      ptsMat.dispose()
      lineMat.dispose()
      ringMat.dispose()
      renderer.dispose()
      if (renderer.domElement.parentNode) mount.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={mountRef} className={className} />
}
