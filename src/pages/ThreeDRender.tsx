
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const ThreeDRender = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const [currentView, setCurrentView] = useState<'3d' | 'slices'>('3d');

  useEffect(() => {
    // Initialize the 3D scene
    const initThree = () => {
      // Scene
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x1A1F2C);
      sceneRef.current = scene;

      // Camera
      const camera = new THREE.PerspectiveCamera(
        75,
        1, // Will be updated in the resizeHandler
        0.1,
        1000
      );
      camera.position.z = 5;
      cameraRef.current = camera;

      // Renderer
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      rendererRef.current = renderer;

      // Add renderer to DOM
      if (mountRef.current) {
        mountRef.current.appendChild(renderer.domElement);
        
        // Set initial size
        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }

      // Add orbit controls
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controlsRef.current = controls;

      // Add lighting
      const ambientLight = new THREE.AmbientLight(0x404040);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(1, 1, 1);
      scene.add(directionalLight);

      // Create a more anatomical-looking 3D model
      const brainGeometry = new THREE.SphereGeometry(2, 32, 32);
      // Deform the sphere to look more like a brain
      const vertices = brainGeometry.attributes.position;
      for (let i = 0; i < vertices.count; i++) {
        const x = vertices.getX(i);
        const y = vertices.getY(i);
        const z = vertices.getZ(i);
        
        // Add some random displacement for a more organic look
        const noise = 0.2 * Math.sin(5 * x) * Math.sin(5 * y) * Math.sin(5 * z);
        vertices.setX(i, x + noise * (Math.random() * 0.1));
        vertices.setY(i, y + noise * (Math.random() * 0.1));
        vertices.setZ(i, z + noise * (Math.random() * 0.1));
      }
      
      const material = new THREE.MeshPhongMaterial({
        color: 0xA456F0,
        transparent: true,
        opacity: 0.7,
        wireframe: false,
        shininess: 50,
      });
      
      const mesh = new THREE.Mesh(brainGeometry, material);
      scene.add(mesh);

      // Add a wireframe to the model
      const wireframeGeometry = new THREE.WireframeGeometry(brainGeometry);
      const wireframeMaterial = new THREE.LineBasicMaterial({ 
        color: 0xE5E5E7, 
        linewidth: 1 
      });
      const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);
      mesh.add(wireframe);

      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);
        
        // Add subtle rotation to the model
        mesh.rotation.y += 0.001;
        
        if (controlsRef.current) {
          controlsRef.current.update();
        }
        
        if (rendererRef.current && cameraRef.current && sceneRef.current) {
          rendererRef.current.render(sceneRef.current, cameraRef.current);
        }
      };
      
      animate();
    };

    initThree();

    // Clean up
    return () => {
      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, []);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (mountRef.current && rendererRef.current && cameraRef.current) {
        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;
        
        rendererRef.current.setSize(width, height);
        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();
      }
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Sample CT scan slice images
  const ctSlices = [
    { id: 1, src: "https://i.imgur.com/5KvmQgJ.png", label: "Slice 1" },
    { id: 2, src: "https://i.imgur.com/FBQxOt2.png", label: "Slice 2" },
    { id: 3, src: "https://i.imgur.com/uCZjrz3.png", label: "Slice 3" },
    { id: 4, src: "https://i.imgur.com/5KvmQgJ.png", label: "Slice 4" },
  ];

  return (
    <main className="main-content">
      <div className="container-custom">
        <div className="neuralscan-container">
          <h2 className="text-3xl font-bold mb-6 text-center text-medical-purple-light">
            3D CT Scan Rendering
          </h2>
          
          <div className="mb-6 flex justify-center">
            <div className="glass-card-light inline-flex rounded-full p-1">
              <button 
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  currentView === '3d' 
                    ? 'bg-medical-accent text-white' 
                    : 'text-gray-300 hover:text-white'
                }`}
                onClick={() => setCurrentView('3d')}
              >
                3D Model
              </button>
              <button 
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  currentView === 'slices' 
                    ? 'bg-medical-accent text-white' 
                    : 'text-gray-300 hover:text-white'
                }`}
                onClick={() => setCurrentView('slices')}
              >
                CT Slices
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-card flex flex-col">
              <div className="mb-4">
                <h3 className="text-xl font-semibold mb-2 text-medical-purple-light">Model Controls</h3>
                <div className="glass-card-light p-4 mb-4">
                  <p className="text-sm text-gray-300 mb-3">
                    Click and drag to rotate the model. Use scroll to zoom in and out.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center rounded bg-medical-dark/50 px-3 py-1">
                      <span className="text-xs text-gray-300">Drag</span>
                      <span className="text-xs text-medical-accent ml-2">Rotate</span>
                    </div>
                    <div className="flex items-center rounded bg-medical-dark/50 px-3 py-1">
                      <span className="text-xs text-gray-300">Scroll</span>
                      <span className="text-xs text-medical-accent ml-2">Zoom</span>
                    </div>
                    <div className="flex items-center rounded bg-medical-dark/50 px-3 py-1">
                      <span className="text-xs text-gray-300">Shift+Drag</span>
                      <span className="text-xs text-medical-accent ml-2">Pan</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="text-xl font-semibold mb-2 text-medical-purple-light">Render Settings</h3>
                <div className="glass-card-light p-4">
                  <p className="text-sm text-gray-300 mb-2">
                    This view represents an enhanced 3D model created from CT scan data 
                    with neural network-processed interpolation.
                  </p>
                  <ul className="text-sm text-gray-300 list-disc pl-5 space-y-1">
                    <li>Higher resolution between slices</li>
                    <li>Smoother surfaces from AI enhancement</li>
                    <li>Improved detail with less radiation exposure</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-auto">
                <Link to="/" className="button-secondary w-full flex items-center justify-center gap-2">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 20 20" 
                    fill="currentColor" 
                    className="w-5 h-5"
                  >
                    <path 
                      fillRule="evenodd"
                      d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
                      clipRule="evenodd" 
                    />
                  </svg>
                  Back to Upload
                </Link>
              </div>
            </div>
            
            <div className="flex flex-col">
              {currentView === '3d' ? (
                <div 
                  ref={mountRef}
                  className="glass-card flex items-center justify-center w-full h-[500px] rounded-2xl overflow-hidden"
                />
              ) : (
                <div className="glass-card w-full h-[500px] rounded-2xl overflow-auto p-4">
                  <h3 className="text-xl font-semibold mb-4 text-medical-purple-light">CT Scan Slices</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {ctSlices.map((slice) => (
                      <div key={slice.id} className="glass-card-light p-2">
                        <img 
                          src={slice.src} 
                          alt={slice.label} 
                          className="w-full h-auto rounded-lg mb-2 transition-all hover:scale-105"
                        />
                        <p className="text-xs text-center text-medical-purple-light">{slice.label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-2 glass-card-light">
                    <p className="text-sm text-gray-300">
                      These slices show the original and enhanced CT scan data. Our AI processing improves the resolution and detail between slices, reducing the need for additional radiation exposure.
                    </p>
                  </div>
                </div>
              )}
              
              <div className="glass-card-light p-4 mt-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-medical-purple-light">Rendering Quality</p>
                  <span className="text-xs text-medical-accent">High</span>
                </div>
                <div className="h-2 w-full bg-medical-dark/50 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-medical-purple to-medical-accent w-4/5 rounded-full"></div>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Enhance model quality by uploading more DICOM slices
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ThreeDRender;
