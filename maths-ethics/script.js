// Maths & Ethics - Geometric Constraints Visualization
// script.js - Complete Three.js implementation

// Global variables
let scene, camera, renderer, controls;
let ethicalBoundaries = [];
let robot, human;
let clock = new THREE.Clock();
let animationId;

// Configuration
const CONFIG = {
    camera: { x: 15, y: 8, z: 15 },
    robot: { x: -7, y: 1, z: 0 },
    human: { x: 7, y: 0.7, z: 0 },
    boundary: { radius: 5 },
    performance: {
        maxPixelRatio: 2,
        scaleUpdateInterval: 0.1
    }
};

// Memory optimization - reusable vector
const tempVec = new THREE.Vector3();

// Initialize the visualization
function initVisualization() {
    console.log("🚀 Initializing Maths & Ethics Visualization...");
    
    try {
        // Check if Three.js is loaded
        if (typeof THREE === 'undefined') {
            throw new Error('Three.js library not loaded');
        }

        setupScene();
        setupCamera();
        setupRenderer();
        setupControls();
        setupLighting();
        createSceneElements();
        
        // Hide loading indicator
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
        
        // Start animation loop
        animate();
        
        console.log("✅ Visualization initialized successfully!");
        
    } catch (error) {
        console.error('❌ Failed to initialize:', error);
        showError(error.message);
    }
}

function setupScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a1a);
    scene.fog = new THREE.Fog(0x0a0a1a, 10, 50);
}

function setupCamera() {
    const container = document.getElementById('visualization-container');
    if (!container) {
        throw new Error('Visualization container not found');
    }
    
    camera = new THREE.PerspectiveCamera(
        60, 
        container.clientWidth / container.clientHeight, 
        0.1, 
        1000
    );
    camera.position.set(CONFIG.camera.x, CONFIG.camera.y, CONFIG.camera.z);
    camera.lookAt(0, 2, 0);
}

function setupRenderer() {
    const container = document.getElementById('visualization-container');
    
    renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: false
    });
    
    // Check WebGL support
    if (!renderer.getContext()) {
        throw new Error('WebGL not supported in this browser');
    }
    
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, CONFIG.performance.maxPixelRatio));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    const sceneContainer = document.getElementById('scene-container');
    sceneContainer.appendChild(renderer.domElement);
}

function setupControls() {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 2, 0);
    
    // Add control instructions
    controls.addEventListener('change', function() {
        updateMetrics();
    });
}

function setupLighting() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    // Main directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(20, 30, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);

    // Accent lights for better visualization
    const pointLight1 = new THREE.PointLight(0x00ff88, 0.3, 20);
    pointLight1.position.set(5, 10, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x0088ff, 0.2, 20);
    pointLight2.position.set(-5, 8, -5);
    scene.add(pointLight2);
}

function createSceneElements() {
    createEthicalManifold();
    createFigures();
    createMovementPaths();
    createGrid();
    createCoordinateAxes();
}

function createEthicalManifold() {
    // Main ethical boundary sphere
    const geometry = new THREE.SphereGeometry(CONFIG.boundary.radius, 32, 32);
    const material = new THREE.MeshPhongMaterial({
        color: 0x00ff88,
        transparent: true,
        opacity: 0.15,
        wireframe: true,
        emissive: 0x004400
    });

    const ethicalSphere = new THREE.Mesh(geometry, material);
    ethicalSphere.position.set(0, 3, 0);
    scene.add(ethicalSphere);
    ethicalBoundaries.push(ethicalSphere);

    // SO(3) Representation - Rotating rings
    createSORings(ethicalSphere);
    
    // Constraint points
    createConstraintPoints(ethicalSphere);
}

function createSORings(parentSphere) {
    const ringColors = [0xff4444, 0xffaa00, 0x00ff88];
    const ringRadii = [5.2, 5.3, 5.4];
    
    ringColors.forEach((color, index) => {
        const ringGeometry = new THREE.TorusGeometry(ringRadii[index], 0.08, 16, 100);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.7
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        
        // Different orientations for SO(3) representation
        switch(index) {
            case 0: ring.rotation.x = Math.PI / 2; break;
            case 1: ring.rotation.z = Math.PI / 2; break;
            case 2: ring.rotation.y = Math.PI / 4; break;
        }
        
        parentSphere.add(ring);
    });
}

function createConstraintPoints(parentSphere) {
    for (let i = 0; i < 25; i++) {
        const pointGeometry = new THREE.SphereGeometry(0.08, 8, 8);
        const pointMaterial = new THREE.MeshBasicMaterial({
            color: new THREE.Color().setHSL(i / 25, 0.9, 0.6),
            emissive: new THREE.Color().setHSL(i / 25, 0.7, 0.3)
        });
        const point = new THREE.Mesh(pointGeometry, pointMaterial);
        
        // Spherical distribution
        const phi = Math.acos(-1 + (i / 25) * 2);
        const theta = Math.sqrt(25) * Math.PI * i; // Golden angle distribution
        const radius = CONFIG.boundary.radius + Math.random() * 0.3;
        
        point.position.set(
            radius * Math.sin(phi) * Math.cos(theta),
            radius * Math.sin(phi) * Math.sin(theta),
            radius * Math.cos(phi)
        );
        
        parentSphere.add(point);
    }
}

function createFigures() {
    createRobot();
    createHuman();
}

function createRobot() {
    const robotGroup = new THREE.Group();
    
    // Robot body
    const bodyGeometry = new THREE.CylinderGeometry(0.5, 0.4, 2, 8);
    const bodyMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x0088ff,
        emissive: 0x002244,
        shininess: 100
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    robotGroup.add(body);

    // Robot head
    const headGeometry = new THREE.SphereGeometry(0.3, 8, 8);
    const headMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x0066cc,
        emissive: 0x001133
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1.2;
    robotGroup.add(head);

    // Robot "eyes" for personality
    const eyeGeometry = new THREE.SphereGeometry(0.05, 6, 6);
    const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(0.15, 1.25, 0
