import { useEffect, useRef } from 'preact/hooks';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { SimplexNoise } from 'three/examples/jsm/math/SimplexNoise';
import { gsap } from 'gsap';

export default function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000510);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(4, 1.5, 6);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.3;
    controls.enableRotate = false;
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.target.set(0, 0, 0);
    controls.update();

    const rgbeLoader = new RGBELoader();
    rgbeLoader.load(
      'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_country_hall_1k.hdr',
      (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.environment = texture;
        scene.background = new THREE.Color(0x020210);
        scene.backgroundBlurriness = 0.5;
      },
      undefined,
      () => {
        const pmremGenerator = new THREE.PMREMGenerator(renderer);
        const envScene = new THREE.Scene();
        envScene.background = new THREE.Color(0x113366);
        const envMap = pmremGenerator.fromScene(envScene, 0.04).texture;
        scene.environment = envMap;
      }
    );

    const planetGroup = new THREE.Group();
    scene.add(planetGroup);

    const planetGeo = new THREE.SphereGeometry(1, 256, 256);
    const simplex = new SimplexNoise();

    const planetMaterial = new THREE.MeshPhysicalMaterial({
      color: '#88ccff',
      metalness: 0.1,
      roughness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      ior: 1.5,
      reflectivity: 1,
      transmission: 0.85,
      thickness: 2.5,
      attenuationColor: new THREE.Color('#2266aa'),
      attenuationDistance: 1.2,
      specularIntensity: 1.5,
      specularColor: new THREE.Color('#ffffff'),
      envMapIntensity: 1.5,
    });

    const updateNoise = () => {
      const t = performance.now() * 0.001;
      planetMaterial.roughness = 0.08 + Math.abs(simplex.noise(t * 0.5, 0, 0)) * 0.15;
      planetMaterial.clearcoatRoughness = 0.05 + Math.abs(simplex.noise(0, t * 0.7, 0)) * 0.15;
      requestAnimationFrame(updateNoise);
    };
    updateNoise();

    const positions = planetGeo.attributes.position.array;
    const originalPositions = new Float32Array(positions.length);
    originalPositions.set(positions);

    const deformGeometry = () => {
      const t = performance.now() * 0.001;
      for (let i = 0; i < positions.length; i += 3) {
        const x = originalPositions[i];
        const y = originalPositions[i + 1];
        const z = originalPositions[i + 2];
        const nx = x / 1;
        const ny = y / 1;
        const nz = z / 1;
        const noise = simplex.noise3d(nx * 3.5 + t * 0.3, ny * 3.5, nz * 3.5 + t * 0.2);
        const displacement = noise * 0.08;
        const len = Math.sqrt(x * x + y * y + z * z);
        const dirX = x / len;
        const dirY = y / len;
        const dirZ = z / len;
        positions[i] = x + dirX * displacement;
        positions[i + 1] = y + dirY * displacement;
        positions[i + 2] = z + dirZ * displacement;
      }
      planetGeo.attributes.position.needsUpdate = true;
      requestAnimationFrame(deformGeometry);
    };
    deformGeometry();

    const planet = new THREE.Mesh(planetGeo, planetMaterial);
    planet.castShadow = false;
    planet.receiveShadow = true;
    planetGroup.add(planet);

    const coreGeo = new THREE.SphereGeometry(0.85, 64, 64);
    const coreMat = new THREE.MeshBasicMaterial({
      color: '#4488ff',
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    planetGroup.add(core);

    const ringsGroup = new THREE.Group();
    planetGroup.add(ringsGroup);

    const createRing = (radius: number, tubeRadius: number, color: string, opacity = 0.7) => {
      const ringGeo = new THREE.TorusGeometry(radius, tubeRadius, 16, 200);
      const ringMat = new THREE.MeshPhysicalMaterial({
        color,
        metalness: 0.9,
        roughness: 0.15,
        clearcoat: 0.8,
        emissive: new THREE.Color(color),
        emissiveIntensity: 0.4,
        transparent: true,
        opacity,
        envMapIntensity: 1.5,
      });
      return new THREE.Mesh(ringGeo, ringMat);
    };

    const ring1 = createRing(1.45, 0.04, '#88aaff', 0.85);
    ring1.rotation.x = Math.PI / 2.3;
    ring1.rotation.y = Math.PI / 5;
    ringsGroup.add(ring1);

    const ring2 = createRing(1.55, 0.03, '#aa88ff', 0.65);
    ring2.rotation.x = Math.PI / 2.1;
    ring2.rotation.y = -Math.PI / 6;
    ringsGroup.add(ring2);

    const ring3 = createRing(1.65, 0.025, '#66ccff', 0.5);
    ring3.rotation.x = Math.PI / 2.5;
    ring3.rotation.y = Math.PI / 3;
    ringsGroup.add(ring3);

    const particlesGeo = new THREE.BufferGeometry();
    const particlesCount = 1500;
    const particlesPositions = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i += 3) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.4 + Math.random() * 0.4;
      const y = (Math.random() - 0.5) * 0.3;
      particlesPositions[i] = Math.cos(angle) * radius;
      particlesPositions[i + 1] = y;
      particlesPositions[i + 2] = Math.sin(angle) * radius;
    }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(particlesPositions, 3));
    const particlesMat = new THREE.PointsMaterial({
      color: '#aaccff',
      size: 0.015,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
    });
    const particles = new THREE.Points(particlesGeo, particlesMat);
    ringsGroup.add(particles);

    const starsGeo = new THREE.BufferGeometry();
    const starsCount = 3000;
    const starsPositions = new Float32Array(starsCount * 3);
    for (let i = 0; i < starsCount * 3; i += 3) {
      starsPositions[i] = (Math.random() - 0.5) * 30;
      starsPositions[i + 1] = (Math.random() - 0.5) * 20;
      starsPositions[i + 2] = (Math.random() - 0.5) * 20;
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3));
    const starsMat = new THREE.PointsMaterial({
      color: '#ffffff',
      size: 0.02,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
    });
    const stars = new THREE.Points(starsGeo, starsMat);
    scene.add(stars);

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5,
      0.4,
      0.85
    );
    bloomPass.anamorphic = true;
    bloomPass.anamorphicRatio = 0.15;
    bloomPass.anamorphicBlur = 0.4;
    composer.addPass(bloomPass);

    gsap.to(planet.rotation, { y: Math.PI * 2, duration: 20, ease: 'none', repeat: -1 });
    gsap.to(ringsGroup.rotation, { y: Math.PI * 2, duration: 25, ease: 'none', repeat: -1 });
    gsap.to(ring1.rotation, { z: Math.PI * 2, duration: 18, ease: 'none', repeat: -1 });
    gsap.to(core.scale, { x: 1.08, y: 1.08, z: 1.08, duration: 2, ease: 'sine.inOut', repeat: -1, yoyo: true });
    gsap.to(particlesMat, { opacity: 0.4, duration: 1.5, ease: 'sine.inOut', repeat: -1, yoyo: true });
    gsap.to(stars.rotation, { y: Math.PI * 0.1, duration: 40, ease: 'none', repeat: -1 });
    gsap.from(planetGroup.scale, { x: 0.01, y: 0.01, z: 0.01, duration: 2, ease: 'elastic.out(1, 0.5)', delay: 0.3 });
    gsap.from(ringsGroup.scale, { x: 0.01, y: 0.01, z: 0.01, duration: 2.2, ease: 'elastic.out(1, 0.5)', delay: 0.5 });

    const clock = new THREE.Clock();
    const animate = () => {
      controls.update();
      const delta = clock.getDelta();
      particles.rotation.y += delta * 0.3;
      particles.rotation.x += delta * 0.1;
      core.material.opacity = 0.4 + Math.sin(performance.now() * 0.003) * 0.2;
      composer.render();
      requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      composer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      scene.clear();
      gsap.killTweensOf('*');
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: '0',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        zIndex: '0',
      }}
    />
  );
}
