// Maths & Ethics - Geometric Constraints Visualization
// script.js - With double entry protection

// Global variables
let scene, camera, renderer, controls;
let ethicalBoundaries = [];
let robot, human;
let clock = new THREE.Clock();
let animationId;
let isInitialized = false; // Double entry protection

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
    
    // DOUBLE ENTRY PROTECTION - Check if already initialized
    if (isInitialized) {
        console.warn("⚠️ Visualization already initialized - skipping");
        return;
    }
    
    // DOUBLE ENTRY PROTECTION - Check if canvas already exists
    const container = document.getElementById('scene-container');
    if (!container) {
        console.error("❌ Scene container not found");
        return;
    }
    
    if (container.querySelector('canvas')) {
        console.warn("⚠️ Canvas already exists - skipping initialization");
        return;
    }
    
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
        
        // Mark as initialized
        isInitialized = true;
        
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

// ... (all your existing functions remain the same - setupScene, setupCamera, etc.)

function setupRenderer() {
    const container = document.getElementById('visualization-container');
    if (!container) {
        throw new Error('Visualization container not found');
    }
    
    // DOUBLE ENTRY PROTECTION - Final canvas check
    const sceneContainer = document.getElementById('scene-container');
    if (sceneContainer.querySelector('canvas')) {
        throw new Error('Canvas already exists - double initialization prevented');
    }
    
    renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: false
    });
    
    // ... rest of setupRenderer code
}

// ... (rest of your functions remain unchanged)

// Cleanup and utilities
function cleanup() {
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
    if (renderer) {
        renderer.dispose();
        renderer = null;
    }
    if (controls) {
        controls.dispose();
        controls = null;
    }
    
    isInitialized = false;
    console.log("🧹 Visualization cleaned up");
}

// Export functions for global access
window.MathsEthics = {
    init: initVisualization,
    cleanup: cleanup,
    onResize: onWindowResize,
    isInitialized: () => isInitialized
};

// SIMPLIFIED INITIALIZATION - Prevents double execution
(function() {
    // Wait for both DOM and Three.js to be ready
    function checkAndInit() {
        if (typeof THREE !== 'undefined' && document.readyState === 'complete') {
            // Small delay to ensure everything is settled
            setTimeout(initVisualization, 100);
        }
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkAndInit);
    } else {
        checkAndInit();
    }
})();

// Handle window resize
window.addEventListener('resize', onWindowResize);

// Handle page unload
window.addEventListener('beforeunload', cleanup);

console.log("📜 Maths & Ethics script loaded successfully!");
