import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// Faithful port of the Stitch "Welcome (Calm 3D)" scene — a narrative of the
// three pillars: a gold wireframe Core (Level Up), a drifting Network of points
// (Link Up), and radiating Rays (Lift Up). Transparent canvas over navy.
export default function ImmersiveHero({ className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const container = ref.current
    if (!container) return

    const scene = new THREE.Scene()
    const w = container.clientWidth || window.innerWidth
    const h = container.clientHeight || window.innerHeight
    const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(w, h)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    const gold = new THREE.Color(0xb8960c)
    const lightGold = new THREE.Color(0xfdf3c8)

    const group = new THREE.Group()
    scene.add(group)

    // 1. Level Up — the Core
    const coreGeo = new THREE.IcosahedronGeometry(1, 1)
    const coreMat = new THREE.MeshPhongMaterial({ color: gold, wireframe: true, transparent: true, opacity: 0.85 })
    const core = new THREE.Mesh(coreGeo, coreMat)
    group.add(core)

    // 2. Link Up — the Network
    const points = []
    for (let i = 0; i < 40; i++) {
      points.push(new THREE.Vector3((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6))
    }
    const networkGeo = new THREE.BufferGeometry().setFromPoints(points)
    const networkMat = new THREE.PointsMaterial({ color: lightGold, size: 0.06 })
    const network = new THREE.Points(networkGeo, networkMat)
    group.add(network)

    // 3. Lift Up — the Rays
    const rayCount = 12
    const rays = new THREE.Group()
    const rayGeos = []
    for (let i = 0; i < rayCount; i++) {
      const rayGeo = new THREE.CylinderGeometry(0.01, 0.05, 8, 8)
      rayGeos.push(rayGeo)
      const rayMat = new THREE.MeshBasicMaterial({ color: lightGold, transparent: true, opacity: 0.2 })
      const ray = new THREE.Mesh(rayGeo, rayMat)
      ray.position.y = 4
      const pivot = new THREE.Group()
      pivot.rotation.z = (i / rayCount) * Math.PI * 2
      pivot.add(ray)
      rays.add(pivot)
    }
    group.add(rays)

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.5))
    const pointLight = new THREE.PointLight(gold, 2)
    pointLight.position.set(5, 5, 5)
    scene.add(pointLight)

    camera.position.z = 8

    let raf
    let time = 0
    const animate = () => {
      raf = requestAnimationFrame(animate)
      time += 0.004
      core.rotation.y += 0.005
      core.rotation.x += 0.002
      const s = 1 + Math.sin(time * 1.5) * 0.08
      core.scale.set(s, s, s)
      network.rotation.y -= 0.0008
      rays.rotation.z += 0.002
      rays.children.forEach((pivot, i) => {
        pivot.children[0].material.opacity = 0.1 + Math.sin(time * 1.2 + i) * 0.05
      })
      const cycle = (time * 0.1) % (Math.PI * 2)
      camera.position.z = 8 + Math.sin(cycle) * 1.5
      group.position.y = Math.sin(time * 0.4) * 0.3
      renderer.render(scene, camera)
    }
    animate()

    const onResize = () => {
      const nw = container.clientWidth || window.innerWidth
      const nh = container.clientHeight || window.innerHeight
      renderer.setSize(nw, nh)
      camera.aspect = nw / nh
      camera.updateProjectionMatrix()
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      coreGeo.dispose()
      coreMat.dispose()
      networkGeo.dispose()
      networkMat.dispose()
      rayGeos.forEach((g) => g.dispose())
      renderer.dispose()
      if (renderer.domElement.parentNode) container.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={ref} className={className} />
}
