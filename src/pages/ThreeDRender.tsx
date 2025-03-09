import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const ThreeDRender = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

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

      // Sample 3D model (placeholder until real CT scan data is loaded)
      // In a real app, you would load the actual 3D model data here
      const geometry = new THREE.SphereGeometry(2, 32, 32);
      const material = new THREE.MeshPhongMaterial({
        color: 0xA456F0,
        transparent: true,
        opacity: 0.7,
        wireframe: false,
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      // Add a wireframe to the sphere
      const wireframeGeometry = new THREE.WireframeGeometry(geometry);
      const wireframeMaterial = new THREE.LineBasicMaterial({ 
        color: 0xE5E5E7, 
        linewidth: 1 
      });
      const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);
      mesh.add(wireframe);

      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);
        
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

  return (
    <main className="main-content">
      <div className="container-custom">
        <div className="neuralscan-container">
          <h2 className="text-3xl font-bold mb-6 text-center text-medical-purple-light">
            3D CT Scan Rendering
          </h2>
          
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
              <div 
                ref={mountRef}
                className="glass-card flex items-center justify-center w-full h-[500px] rounded-2xl overflow-hidden"
              />
              
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
