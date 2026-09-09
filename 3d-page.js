// ============================================================
// HOLOVISION AI - 3D VISUALIZATION
// 3D PAGE - PART 1
// Core data + model registry + helper functions
// ============================================================

let scene = null;
let camera = null;
let renderer = null;
let controls = null;

let currentModel = null;
let currentTopic = "";
let currentStage = 0;

let speechUtterance = null;
let speechEnabled = false;

let labelObjects = [];
let animationObjects = [];

let isXRay = false;
let autoRotateEnabled = false;
let animationStarted = false;

const DEFAULT_TOPIC = "human heart";


// ============================================================
// REAL 3D MODEL PATHS
// ============================================================
//
// IMPORTANT:
// These paths work only when the corresponding .glb files
// actually exist inside your project's /models/ folder.
//
// Example:
// HoloVision/
// ├── 3d.html
// ├── 3d-page.js
// └── models/
//      └── heart.glb
//
// If a model file does not exist, the application will show:
// "3D Model Currently Unavailable"
// ============================================================

const MODEL_REGISTRY = {

    "human heart": {
        title: "Human Heart",
        subtitle: "Realistic 3D anatomical model",
        path: "models/heart.glb",
        type: "anatomy",
        parts: [
            "Right Atrium",
            "Left Atrium",
            "Right Ventricle",
            "Left Ventricle",
            "Aorta",
            "Pulmonary Artery"
        ],
        explanation:
            "The human heart is a muscular organ that pumps blood throughout the body."
    },

    "human eye": {
        title: "Human Eye",
        subtitle: "3D anatomical visualization",
        path: "models/eye.glb",
        type: "anatomy",
        parts: [
            "Cornea",
            "Iris",
            "Lens",
            "Retina",
            "Optic Nerve"
        ],
        explanation:
            "The eye detects light and sends visual information to the brain."
    },

    "human lungs": {
        title: "Human Lungs",
        subtitle: "3D respiratory system visualization",
        path: "models/lungs.glb",
        type: "anatomy",
        parts: [
            "Right Lung",
            "Left Lung",
            "Trachea",
            "Bronchi",
            "Alveoli"
        ],
        explanation:
            "The lungs exchange oxygen and carbon dioxide during respiration."
    },

    "human kidney": {
        title: "Human Kidney",
        subtitle: "3D anatomical visualization",
        path: "models/kidney.glb",
        type: "anatomy",
        parts: [
            "Cortex",
            "Medulla",
            "Renal Pelvis",
            "Ureter",
            "Nephron"
        ],
        explanation:
            "The kidneys filter waste products from the blood and help maintain fluid balance."
    },

    "human skeleton": {
        title: "Human Skeleton",
        subtitle: "3D skeletal visualization",
        path: "models/skeleton.glb",
        type: "anatomy",
        parts: [
            "Skull",
            "Spine",
            "Rib Cage",
            "Pelvis",
            "Arms",
            "Legs"
        ],
        explanation:
            "The human skeleton provides structural support and protects important organs."
    },

    "dna double helix": {
        title: "DNA Double Helix",
        subtitle: "3D molecular structure",
        path: "models/dna.glb",
        type: "molecular",
        parts: [
            "Sugar-Phosphate Backbone",
            "Base Pairs",
            "Adenine",
            "Thymine",
            "Guanine",
            "Cytosine"
        ],
        explanation:
            "DNA stores genetic information using a double-helix structure."
    },

    "structure of the inner ear": {
        title: "Structure of the Inner Ear",
        subtitle: "3D anatomical visualization",
        path: "models/inner-ear.glb",
        type: "anatomy",
        parts: [
            "Cochlea",
            "Semicircular Canals",
            "Vestibule",
            "Auditory Nerve"
        ],
        explanation:
            "The inner ear is involved in hearing and maintaining balance."
    },

    "3d atomic orbitals": {
        title: "3D Atomic Orbitals",
        subtitle: "Interactive atomic visualization",
        path: "models/atomic-orbitals.glb",
        type: "science",
        parts: [
            "s Orbital",
            "p Orbital",
            "Electron Cloud",
            "Atomic Nucleus"
        ],
        explanation:
            "Atomic orbitals describe regions where electrons are likely to be found."
    },

    "crystal lattice structures": {
        title: "Crystal Lattice Structures",
        subtitle: "3D crystal structure",
        path: "models/crystal-lattice.glb",
        type: "science",
        parts: [
            "Lattice Point",
            "Unit Cell",
            "Atomic Arrangement"
        ],
        explanation:
            "A crystal lattice represents the repeating arrangement of particles in a crystal."
    },

    "neuron synapse": {
        title: "Neuron Synapse",
        subtitle: "3D neural communication model",
        path: "models/neuron-synapse.glb",
        type: "biology",
        parts: [
            "Neuron",
            "Axon",
            "Synaptic Terminal",
            "Synaptic Gap",
            "Receptors"
        ],
        explanation:
            "A synapse is a communication point between neurons."
    }

};


// ============================================================
// NORMALIZE TOPIC
// ============================================================

function normalizeTopic(topic) {

    if (!topic) {
        return "";
    }

    return topic
        .toLowerCase()
        .trim()
        .replace(/\s+/g, " ");

}


// ============================================================
// GET ELEMENT SAFELY
// ============================================================

function getElement(id) {
    return document.getElementById(id);
}


// ============================================================
// SET TEXT SAFELY
// ============================================================

function setText(id, text) {

    const element = getElement(id);

    if (element) {
        element.textContent = text;
    }

}


// ============================================================
// GET CURRENT TOPIC DATA
// ============================================================

function getTopicData(topic) {

    const normalized = normalizeTopic(topic);

    return MODEL_REGISTRY[normalized] || null;

}


// ============================================================
// CHECK TOPIC SUPPORT
// ============================================================

function isSupportedTopic(topic) {

    return !!getTopicData(topic);

}


// ============================================================
// RESET 3D DATA
// ============================================================

function reset3DData() {

    currentModel = null;
    currentTopic = "";
    currentStage = 0;

    labelObjects = [];
    animationObjects = [];

    isXRay = false;
    autoRotateEnabled = false;

}


// ============================================================
// MODEL STATUS
// ============================================================

function updateModelStatus(message) {

    const status = getElement("modelStatus");

    if (status) {
        status.textContent = message;
    }

}


// ============================================================
// MODEL LOADING STATUS
// ============================================================

function setModelLoading() {

    updateModelStatus("Loading 3D Model...");

}


// ============================================================
// MODEL UNAVAILABLE
// ============================================================

function showModelUnavailable() {

    const unavailable = getElement("modelUnavailable");

    if (unavailable) {
        unavailable.style.display = "flex";
    }

    updateModelStatus("3D Model Currently Unavailable");

}


// ============================================================
// HIDE MODEL UNAVAILABLE
// ============================================================

function hideModelUnavailable() {

    const unavailable = getElement("modelUnavailable");

    if (unavailable) {
        unavailable.style.display = "none";
    }

}


// ============================================================
// DEFAULT HUMAN HEART
// ============================================================

function setDefaultHumanHeart() {

    const input = getElement("topicInput");

    if (input && !input.value.trim()) {
        input.value = "Human Heart";
    }

    currentTopic = DEFAULT_TOPIC;

}


// ============================================================
// REMOVE CURRENT MODEL
// ============================================================

function removeCurrentModel() {

    if (!currentModel || !scene) {
        return;
    }

    scene.remove(currentModel);

    currentModel.traverse(function (object) {

        if (object.geometry) {
            object.geometry.dispose();
        }

        if (object.material) {

            if (Array.isArray(object.material)) {

                object.material.forEach(function (material) {
                    if (material.map) {
                        material.map.dispose();
                    }
                    material.dispose();
                });

            } else {

                if (object.material.map) {
                    object.material.map.dispose();
                }

                object.material.dispose();
            }

        }

    });

    currentModel = null;

}


// ============================================================
// CLEAR LABELS
// ============================================================

function clearLabels() {

    if (!scene) {
        return;
    }

    labelObjects.forEach(function (label) {
        scene.remove(label);
    });

    labelObjects = [];

}


// ============================================================
// RESET VIEW
// ============================================================

function resetViewState() {

    isXRay = false;
    autoRotateEnabled = false;

    if (controls) {
        controls.enableRotate = true;
    }

}


// ============================================================
// EXPORT BASIC FUNCTIONS
// ============================================================

window.loadTopic = loadTopic;
window.resetCamera = resetCamera;
window.clear3DVisualisation = clear3DVisualisation;

// ============================================================
// HOLOVISION AI - 3D VISUALIZATION
// PART 2 - THREE.JS SCENE + CAMERA + CONTROLS
// ============================================================

function start3D() {

    const viewer = getElement("viewer");

    if (!viewer) {
        console.error("3D viewer element not found.");
        return;
    }

    // --------------------------------------------------------
    // Prevent duplicate Three.js initialization
    // --------------------------------------------------------

    if (renderer) {
        console.log("3D scene already initialized.");
        return;
    }


    // --------------------------------------------------------
    // SCENE
    // --------------------------------------------------------

    scene = new THREE.Scene();

    scene.background = new THREE.Color(0x020711);


    // --------------------------------------------------------
    // CAMERA
    // --------------------------------------------------------

    const width = viewer.clientWidth || 800;
    const height = viewer.clientHeight || 600;

    camera = new THREE.PerspectiveCamera(
        45,
        width / height,
        0.1,
        1000
    );

    camera.position.set(0, 1.5, 6);


    // --------------------------------------------------------
    // RENDERER
    // --------------------------------------------------------

    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio || 1, 2)
    );

    renderer.setSize(width, height);

    renderer.outputColorSpace = THREE.SRGBColorSpace;

    viewer.innerHTML = "";

    viewer.appendChild(renderer.domElement);


    // --------------------------------------------------------
    // ORBIT CONTROLS
    // --------------------------------------------------------

    if (typeof THREE.OrbitControls !== "undefined") {

        controls = new THREE.OrbitControls(
            camera,
            renderer.domElement
        );

        controls.enableDamping = true;
        controls.dampingFactor = 0.05;

        controls.enablePan = false;

        controls.minDistance = 1.5;
        controls.maxDistance = 15;

        controls.target.set(0, 0, 0);

    } else {

        console.warn(
            "OrbitControls is not available."
        );

    }


    // --------------------------------------------------------
    // LIGHTING
    // --------------------------------------------------------

    const ambientLight = new THREE.AmbientLight(
        0xffffff,
        1.8
    );

    scene.add(ambientLight);


    const mainLight = new THREE.DirectionalLight(
        0xffffff,
        2.5
    );

    mainLight.position.set(
        5,
        8,
        6
    );

    scene.add(mainLight);


    const fillLight = new THREE.DirectionalLight(
        0x88aaff,
        1.5
    );

    fillLight.position.set(
        -5,
        3,
        4
    );

    scene.add(fillLight);


    const backLight = new THREE.DirectionalLight(
        0xffffff,
        1.2
    );

    backLight.position.set(
        0,
        4,
        -6
    );

    scene.add(backLight);


    // --------------------------------------------------------
    // BUTTON EVENTS
    // --------------------------------------------------------

    const rotateBtn = getElement("rotateBtn");
    const zoomBtn = getElement("zoomBtn");
    const resetBtn = getElement("resetBtn");
    const xrayBtn = getElement("xrayBtn");


    if (rotateBtn) {

        rotateBtn.addEventListener(
            "click",
            function () {

                setAutoRotation();

            }
        );

    }


    if (zoomBtn) {

        zoomBtn.addEventListener(
            "click",
            function () {

                zoomIn();

            }
        );

    }


    if (resetBtn) {

        resetBtn.addEventListener(
            "click",
            function () {

                resetCamera();

            }
        );

    }


    if (xrayBtn) {

        xrayBtn.addEventListener(
            "click",
            function () {

                toggleXRay();

            }
        );

    }


    // --------------------------------------------------------
    // TOPIC INPUT ENTER KEY
    // --------------------------------------------------------

    const topicInput = getElement("topicInput");

    if (topicInput) {

        topicInput.addEventListener(
            "keydown",
            function (event) {

                if (event.key === "Enter") {

                    event.preventDefault();

                    loadTopic();

                }

            }
        );

    }


    // --------------------------------------------------------
    // WINDOW RESIZE
    // --------------------------------------------------------

    window.addEventListener(
        "resize",
        resize3D
    );


    // --------------------------------------------------------
    // INITIAL CAMERA
    // --------------------------------------------------------

    resetCamera();


    // --------------------------------------------------------
    // ANIMATION LOOP
    // --------------------------------------------------------

    if (!animationStarted) {

        animationStarted = true;

        animate();

    }


    console.log("HoloVision 3D scene initialized.");

}


// ============================================================
// RESET CAMERA
// ============================================================

function resetCamera() {

    if (!camera) {
        return;
    }

    camera.position.set(
        0,
        1.5,
        6
    );


    if (controls) {

        controls.target.set(
            0,
            0,
            0
        );

        controls.update();

    }

}


// ============================================================
// RESIZE 3D VIEWER
// ============================================================

function resize3D() {

    const viewer = getElement("viewer");

    if (!viewer || !camera || !renderer) {
        return;
    }

    const width =
        viewer.clientWidth || 800;

    const height =
        viewer.clientHeight || 600;


    camera.aspect =
        width / height;

    camera.updateProjectionMatrix();


    renderer.setSize(
        width,
        height
    );

}


// ============================================================
// TOGGLE X-RAY
// ============================================================

function toggleXRay() {

    if (!currentModel) {
        return;
    }

    isXRay = !isXRay;


    currentModel.traverse(
        function (object) {

            if (!object.isMesh) {
                return;
            }

            const materials =
                Array.isArray(object.material)
                    ? object.material
                    : [object.material];


            materials.forEach(
                function (material) {

                    if (!material) {
                        return;
                    }

                    if (isXRay) {

                        material.transparent = true;
                        material.opacity = 0.35;

                    } else {

                        material.transparent = false;
                        material.opacity = 1;

                    }

                    material.needsUpdate = true;

                }
            );

        }
    );


    const xrayBtn =
        getElement("xrayBtn");

    if (xrayBtn) {

        xrayBtn.textContent =
            isXRay
                ? "Normal View"
                : "X-Ray";

    }

}


// ============================================================
// RESET VIEW STATE
// ============================================================

function reset3DView() {

    isXRay = false;

    resetCamera();

    if (currentModel) {

        currentModel.traverse(
            function (object) {

                if (!object.isMesh) {
                    return;
                }

                const materials =
                    Array.isArray(object.material)
                        ? object.material
                        : [object.material];


                materials.forEach(
                    function (material) {

                        if (!material) {
                            return;
                        }

                        material.transparent = false;
                        material.opacity = 1;
                        material.needsUpdate = true;

                    }
                );

            }
        );

    }


    const xrayBtn =
        getElement("xrayBtn");

    if (xrayBtn) {
        xrayBtn.textContent = "X-Ray";
    }

}

// ============================================================
// HOLOVISION AI - 3D VISUALIZATION
// PART 3 - TOPIC SELECTION + REAL GLB MODEL LOADING
// ============================================================


// ============================================================
// ALL 30 TOPIC MODEL PATHS
// ============================================================
//
// IMPORTANT:
// A model will load ONLY if the matching .glb file actually
// exists inside the /models/ folder.
//
// Do NOT create fake/AI-generated models just to fill the UI.
// If a real model is not available, HoloVision shows:
// "3D Model Currently Unavailable"
// ============================================================

const ALL_TOPIC_MODELS = {

    // --------------------------------------------------------
    // SCIENCE
    // --------------------------------------------------------

    "human heart": "models/heart.glb",

    "human eye": "models/eye.glb",

    "human lungs": "models/lungs.glb",

    "human kidney": "models/kidney.glb",

    "human skeleton": "models/skeleton.glb",

    "structure of the inner ear":
        "models/inner-ear.glb",

    "dna double helix replication":
        "models/dna.glb",

    "3d atomic orbitals":
        "models/atomic-orbitals.glb",

    "crystal lattice structures":
        "models/crystal-lattice.glb",

    "neuron synapse":
        "models/neuron-synapse.glb",


    // --------------------------------------------------------
    // SOCIAL SCIENCE / EARTH / SPACE
    // --------------------------------------------------------

    "internal layers of the earth":
        "models/earth-layers.glb",

    "tectonic plate boundaries & fault lines":
        "models/tectonic-plates.glb",

    "volcanic plumbing systems":
        "models/volcano.glb",

    "oceanic crust subduction zones":
        "models/subduction.glb",

    "formation of river landforms":
        "models/river-landforms.glb",

    "planetary orbital inclinations & ellipses":
        "models/orbits.glb",

    "gravitational pull & spacetime curvature":
        "models/gravity.glb",

    "milky way galaxy spiral structure":
        "models/milky-way.glb",

    "internal structural engineering of ancient monuments":
        "models/ancient-monument.glb",

    "stratigraphy in archeological excavations":
        "models/archaeological-stratigraphy.glb",


    // --------------------------------------------------------
    // MATHEMATICS
    // --------------------------------------------------------

    "hypercubes (4d tesseracts)":
        "models/hypercube.glb",

    "non-orientable surfaces":
        "models/non-orientable-surface.glb",

    "partial derivatives and gradient vectors":
        "models/gradient-vectors.glb",

    "quadric surfaces":
        "models/quadric-surfaces.glb",

    "volumes of solids of revolution":
        "models/solids-of-revolution.glb",

    "spherical and cylindrical coordinate systems":
        "models/coordinate-systems.glb",

    "vector cross products in 3d":
        "models/vector-cross-product.glb",

    "3d coordinate space (x, y, z axes)":
        "models/3d-coordinate-space.glb",

    "intersecting 3d planes":
        "models/intersecting-planes.glb",

    "net folds of complex polyhedrons":
        "models/complex-polyhedrons.glb"

};


// ============================================================
// TOPIC ALIASES
// ============================================================

const TOPIC_ALIASES = {

    "heart":
        "human heart",

    "eye":
        "human eye",

    "lungs":
        "human lungs",

    "kidney":
        "human kidney",

    "skeleton":
        "human skeleton",

    "brain":
        "human brain",

    "dna":
        "dna double helix replication",

    "inner ear":
        "structure of the inner ear",

    "atomic orbitals":
        "3d atomic orbitals",

    "crystal lattice":
        "crystal lattice structures",

    "neuron":
        "neuron synapse",

    "earth layers":
        "internal layers of the earth",

    "tectonic plates":
        "tectonic plate boundaries & fault lines",

    "volcano":
        "volcanic plumbing systems",

    "subduction":
        "oceanic crust subduction zones",

    "river landforms":
        "formation of river landforms",

    "planetary orbits":
        "planetary orbital inclinations & ellipses",

    "gravity":
        "gravitational pull & spacetime curvature",

    "milky way":
        "milky way galaxy spiral structure",

    "hypercube":
        "hypercubes (4d tesseracts)",

    "tesseract":
        "hypercubes (4d tesseracts)"

};


// ============================================================
// GET REAL MODEL PATH
// ============================================================

function getRealModelPath(topic) {

    const normalized =
        normalizeTopic(topic);

    // Direct match
    if (ALL_TOPIC_MODELS[normalized]) {

        return ALL_TOPIC_MODELS[normalized];

    }


    // Alias match
    const alias =
        TOPIC_ALIASES[normalized];

    if (alias && ALL_TOPIC_MODELS[alias]) {

        return ALL_TOPIC_MODELS[alias];

    }


    return null;

}


// ============================================================
// GET MODEL PATH
// ============================================================

function getTopicModelPath(topic) {

    return getRealModelPath(topic);

}


// ============================================================
// LOAD SELECTED TOPIC
// ============================================================

function loadTopic() {

    const input =
        getElement("topicInput");

    if (!input) {
        return;
    }


    const rawTopic =
        input.value.trim();


    if (!rawTopic) {

        alert(
            "Please enter or select a topic."
        );

        return;

    }


    const normalized =
        normalizeTopic(rawTopic);


    const resolvedTopic =
        TOPIC_ALIASES[normalized] ||
        normalized;


    currentTopic =
        resolvedTopic;


    // --------------------------------------------------------
    // Find topic information
    // --------------------------------------------------------

    const topicData =
        getTopicData(resolvedTopic);


    // --------------------------------------------------------
    // Find model path
    // --------------------------------------------------------

    const modelPath =
        getTopicModelPath(resolvedTopic);


    // --------------------------------------------------------
    // Unsupported topic
    // --------------------------------------------------------

    if (!topicData || !modelPath) {

        currentStage = 0;

        removeCurrentModel();

        clearLabels();

        showModelUnavailable();


        setText(
            "modelTitle",
            rawTopic
        );

        setText(
            "modelSubtitle",
            "3D visualization unavailable"
        );

        setText(
            "aboutTitle",
            rawTopic
        );

        setText(
            "aboutText",
            "A suitable real 3D model is currently unavailable for this topic."
        );

        updatePartsList([]);

        return;

    }


    // --------------------------------------------------------
    // Update UI
    // --------------------------------------------------------

    currentStage = 1;

    hideModelUnavailable();

    setText(
        "modelTitle",
        topicData.title
    );

    setText(
        "modelSubtitle",
        topicData.subtitle
    );


    updateAboutSection(
        topicData
    );


    updatePartsList(
        topicData.parts || []
    );


    // --------------------------------------------------------
    // Remove previous model
    // --------------------------------------------------------

    removeCurrentModel();

    clearLabels();

    reset3DView();

    setModelLoading();


    // --------------------------------------------------------
    // Load real GLB model
    // --------------------------------------------------------

    loadReal3DModel(
        modelPath,
        topicData
    );

}


// ============================================================
// LOAD REAL GLB MODEL
// ============================================================

function loadReal3DModel(
    modelPath,
    topicData
) {

    if (!scene) {

        console.error(
            "3D scene is not initialized."
        );

        return;

    }


    if (
        typeof THREE === "undefined" ||
        typeof THREE.GLTFLoader === "undefined"
    ) {

        console.error(
            "Three.js or GLTFLoader is missing."
        );

        showModelUnavailable();

        return;

    }


    setModelLoading();


    const loader =
        new THREE.GLTFLoader();


    loader.load(

        modelPath,


        // ----------------------------------------------------
        // SUCCESS
        // ----------------------------------------------------

        function (gltf) {

            if (!gltf || !gltf.scene) {

                showModelUnavailable();

                return;

            }


            currentModel =
                gltf.scene;


            // Add model to scene
            scene.add(
                currentModel
            );


            // Center and scale
            centerAndScaleModel(
                currentModel
            );


            // Update status
            hideModelUnavailable();

            updateModelStatus(
                "3D Model Loaded"
            );


            // Add basic labels
            addBasicLabels(
                topicData
            );


            // Start normal view
            setNormalView();


            // Update title again
            setText(
                "modelTitle",
                topicData.title
            );

            setText(
                "modelSubtitle",
                topicData.subtitle
            );


            console.log(
                "3D model loaded:",
                modelPath
            );

        },


        // ----------------------------------------------------
        // PROGRESS
        // ----------------------------------------------------

        function (xhr) {

            if (
                xhr &&
                xhr.total
            ) {

                const percent =
                    Math.round(
                        (xhr.loaded / xhr.total) * 100
                    );

                updateModelStatus(
                    "Loading 3D Model... " +
                    percent +
                    "%"
                );

            } else {

                updateModelStatus(
                    "Loading 3D Model..."
                );

            }

        },


        // ----------------------------------------------------
        // ERROR
        // ----------------------------------------------------

        function (error) {

            console.error(
                "Unable to load 3D model:",
                modelPath,
                error
            );


            removeCurrentModel();

            clearLabels();

            showModelUnavailable();


            setText(
                "modelSubtitle",
                "Real 3D model unavailable"
            );

        }

    );

}


// ============================================================
// CENTER AND SCALE MODEL
// ============================================================

function centerAndScaleModel(
    model
) {

    if (!model) {
        return;
    }


    const box =
        new THREE.Box3()
            .setFromObject(model);


    const size =
        new THREE.Vector3();


    const center =
        new THREE.Vector3();


    box.getSize(size);

    box.getCenter(center);


    // --------------------------------------------------------
    // Move model to origin
    // --------------------------------------------------------

    model.position.sub(
        center
    );


    // --------------------------------------------------------
    // Find largest dimension
    // --------------------------------------------------------

    const maxDimension =
        Math.max(
            size.x,
            size.y,
            size.z
        );


    if (
        maxDimension > 0 &&
        isFinite(maxDimension)
    ) {

        const targetSize = 3;

        const scale =
            targetSize /
            maxDimension;


        model.scale.setScalar(
            scale
        );

    }


    // --------------------------------------------------------
    // Recalculate center
    // --------------------------------------------------------

    const finalBox =
        new THREE.Box3()
            .setFromObject(model);


    const finalCenter =
        new THREE.Vector3();


    finalBox.getCenter(
        finalCenter
    );


    model.position.sub(
        finalCenter
    );


    // --------------------------------------------------------
    // Reset camera target
    // --------------------------------------------------------

    if (controls) {

        controls.target.set(
            0,
            0,
            0
        );

        controls.update();

    }

}


// ============================================================
// UPDATE ABOUT SECTION
// ============================================================

function updateAboutSection(
    topicData
) {

    if (!topicData) {
        return;
    }


    setText(
        "aboutTitle",
        topicData.title
    );


    setText(
        "aboutText",
        topicData.explanation ||
        "Explore this topic using the interactive 3D visualization."
    );

}


// ============================================================
// UPDATE PARTS LIST
// ============================================================

function updatePartsList(
    parts
) {

    const container =
        getElement("partsList");


    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (
        !parts ||
        parts.length === 0
    ) {

        const empty =
            document.createElement("div");

        empty.textContent =
            "No parts information available.";

        container.appendChild(
            empty
        );

        return;

    }


    parts.forEach(
        function (part, index) {

            const item =
                document.createElement("button");


            item.type = "button";

            item.className =
                "part-item";


            item.textContent =
                part;


            item.dataset.index =
                index;


            item.addEventListener(
                "click",
                function () {

                    selectModelPart(
                        index,
                        part
                    );

                }
            );


            container.appendChild(
                item
            );

        }
    );

}


// ============================================================
// SELECT MODEL PART
// ============================================================

function selectModelPart(
    index,
    partName
) {

    if (!currentModel) {

        return;

    }


    console.log(
        "Selected part:",
        index,
        partName
    );


    // --------------------------------------------------------
    // Highlight matching object when model names match.
    // --------------------------------------------------------

    let found = false;


    currentModel.traverse(
        function (object) {

            if (
                !object.isMesh ||
                !object.name
            ) {
                return;
            }


            const objectName =
                object.name
                    .toLowerCase();


            const searchName =
                partName
                    .toLowerCase();


            if (
                objectName.includes(
                    searchName
                )
            ) {

                found = true;

                object.userData.holoSelected =
                    true;

            }

        }
    );


    // --------------------------------------------------------
    // Show information even when the downloaded model does
    // not contain matching named meshes.
    // --------------------------------------------------------

    if (!found) {

        updateModelStatus(
            partName +
            " selected"
        );

    } else {

        updateModelStatus(
            partName +
            " highlighted"
        );

    }

}


// ============================================================
// SHOW FIRST STAGE
// ============================================================

function showStageOne() {

    currentStage = 1;

    if (currentModel) {

        resetCamera();

    }

}

// ============================================================
// HOLOVISION AI - 3D VISUALIZATION
// PART 4 - LEARNING MODES + 3D LABELS + CHALLENGE
// ============================================================


// ============================================================
// LEARNING MODE SETUP
// ============================================================

function setupLearningModes() {

    const exploreBtn =
        getElement("exploreBtn");

    const experimentBtn =
        getElement("experimentBtn");

    const challengeBtn =
        getElement("challengeBtn");


    if (exploreBtn) {

        exploreBtn.addEventListener(
            "click",
            function () {

                setLearningMode("explore");

            }
        );

    }


    if (experimentBtn) {

        experimentBtn.addEventListener(
            "click",
            function () {

                setLearningMode("experiment");

            }
        );

    }


    if (challengeBtn) {

        challengeBtn.addEventListener(
            "click",
            function () {

                setLearningMode("challenge");

            }
        );

    }


    // Default mode
    setLearningMode("explore");

}


// ============================================================
// SET LEARNING MODE
// ============================================================

function setLearningMode(mode) {

    currentStage = 1;


    const explorePanel =
        getElement("explorePanel");

    const experimentPanel =
        getElement("experimentPanel");

    const challengePanel =
        getElement("challengePanel");


    // Hide all panels
    if (explorePanel) {
        explorePanel.style.display = "none";
    }

    if (experimentPanel) {
        experimentPanel.style.display = "none";
    }

    if (challengePanel) {
        challengePanel.style.display = "none";
    }


    // --------------------------------------------------------
    // Explore
    // --------------------------------------------------------

    if (mode === "explore") {

        if (explorePanel) {
            explorePanel.style.display = "block";
        }

        currentStage = 1;

    }


    // --------------------------------------------------------
    // Experiment
    // --------------------------------------------------------

    else if (mode === "experiment") {

        if (experimentPanel) {
            experimentPanel.style.display = "block";
        }

        currentStage = 2;

        updateExperimentForTopic();

    }


    // --------------------------------------------------------
    // Challenge
    // --------------------------------------------------------

    else if (mode === "challenge") {

        if (challengePanel) {
            challengePanel.style.display = "block";
        }

        currentStage = 3;

        updateChallengeForTopic();

    }


    // --------------------------------------------------------
    // Active button
    // --------------------------------------------------------

    const buttons = [
        getElement("exploreBtn"),
        getElement("experimentBtn"),
        getElement("challengeBtn")
    ];


    buttons.forEach(
        function (button) {

            if (!button) {
                return;
            }

            button.classList.remove(
                "active"
            );

        }
    );


    if (mode === "explore" && exploreBtn) {
        exploreBtn.classList.add("active");
    }

    if (mode === "experiment" && experimentBtn) {
        experimentBtn.classList.add("active");
    }

    if (mode === "challenge" && challengeBtn) {
        challengeBtn.classList.add("active");
    }

}


// ============================================================
// EXPERIMENT CONTROLS
// ============================================================

function setupExperimentControls() {

    const experimentButtons =
        document.querySelectorAll(
            "[data-experiment]"
        );


    experimentButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const action =
                        button.dataset.experiment;

                    runExperiment(
                        action
                    );

                }
            );

        }
    );

}


// ============================================================
// RUN EXPERIMENT
// ============================================================

function runExperiment(action) {

    if (!currentModel) {

        updateModelStatus(
            "Load a 3D model first."
        );

        return;

    }


    switch (action) {

        case "rotate":

            autoRotateEnabled =
                !autoRotateEnabled;

            updateModelStatus(
                autoRotateEnabled
                    ? "Auto rotation enabled"
                    : "Auto rotation disabled"
            );

            break;


        case "xray":

            toggleXRay();

            break;


        case "reset":

            reset3DView();

            updateModelStatus(
                "View reset"
            );

            break;


        case "zoom":

            zoomIn();

            break;


        default:

            updateModelStatus(
                "Experiment control selected"
            );

    }

}


// ============================================================
// UPDATE EXPERIMENT FOR CURRENT TOPIC
// ============================================================

function updateExperimentForTopic() {

    if (!currentTopic) {
        return;
    }


    const data =
        getTopicData(currentTopic);


    if (!data) {
        return;
    }


    updateModelStatus(
        "Experiment Mode: " +
        data.title
    );

}


// ============================================================
// HEART ANIMATION
// ============================================================

function updateHeartAnimation() {

    if (!currentModel) {
        return;
    }


    if (
        currentTopic !== "human heart"
    ) {

        return;

    }


    const time =
        performance.now() * 0.001;


    const pulse =
        1 +
        Math.sin(time * 5) * 0.035;


    currentModel.scale.set(
        pulse,
        pulse,
        pulse
    );

}


// ============================================================
// CHALLENGE SETUP
// ============================================================

let currentChallenge = null;
let challengeScore = 0;


function setupChallenge() {

    const challengeButtons =
        document.querySelectorAll(
            "[data-answer]"
        );


    challengeButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const answer =
                        button.dataset.answer ||
                        button.textContent.trim();


                    checkChallengeAnswer(
                        answer
                    );

                }
            );

        }
    );


    updateChallengeForTopic();

}


// ============================================================
// UPDATE CHALLENGE
// ============================================================

function updateChallengeForTopic() {

    const data =
        getTopicData(currentTopic);


    if (!data) {

        currentChallenge = null;

        return;

    }


    // --------------------------------------------------------
    // Simple topic-based challenge
    // --------------------------------------------------------

    if (
        currentTopic === "human heart"
    ) {

        currentChallenge = {

            question:
                "Which chamber pumps oxygen-rich blood to the body?",

            answers: [
                "Left Ventricle",
                "Right Atrium",
                "Right Ventricle",
                "Left Atrium"
            ],

            correct:
                "Left Ventricle"

        };

    }


    else if (
        currentTopic === "human eye"
    ) {

        currentChallenge = {

            question:
                "Which part of the eye detects light?",

            answers: [
                "Retina",
                "Cornea",
                "Iris",
                "Lens"
            ],

            correct:
                "Retina"

        };

    }


    else if (
        currentTopic === "human lungs"
    ) {

        currentChallenge = {

            question:
                "Where does most gas exchange occur?",

            answers: [
                "Alveoli",
                "Trachea",
                "Bronchi",
                "Larynx"
            ],

            correct:
                "Alveoli"

        };

    }


    else {

        currentChallenge = {

            question:
                "Explore the 3D model and identify an important part.",

            answers:
                data.parts.slice(
                    0,
                    Math.min(
                        data.parts.length,
                        4
                    )
                ),

            correct:
                data.parts[0]

        };

    }


    renderChallenge();

}


// ============================================================
// RENDER CHALLENGE
// ============================================================

function renderChallenge() {

    if (!currentChallenge) {
        return;
    }


    const question =
        getElement("challengeQuestion");

    const answerContainer =
        getElement("challengeAnswers");


    if (question) {

        question.textContent =
            currentChallenge.question;

    }


    if (!answerContainer) {
        return;
    }


    answerContainer.innerHTML = "";


    currentChallenge.answers.forEach(
        function (answer) {

            const button =
                document.createElement("button");


            button.type = "button";

            button.className =
                "challenge-answer";


            button.textContent =
                answer;


            button.addEventListener(
                "click",
                function () {

                    checkChallengeAnswer(
                        answer
                    );

                }
            );


            answerContainer.appendChild(
                button
            );

        }
    );

}


// ============================================================
// CHECK CHALLENGE ANSWER
// ============================================================

function checkChallengeAnswer(answer) {

    if (!currentChallenge) {
        return;
    }


    const result =
        getElement("challengeResult");


    if (
        normalizeTopic(answer) ===
        normalizeTopic(
            currentChallenge.correct
        )
    ) {

        challengeScore++;


        if (result) {

            result.textContent =
                "Correct! 🎉 Score: " +
                challengeScore;

        }


        updateModelStatus(
            "Correct answer!"
        );


    } else {

        if (result) {

            result.textContent =
                "Try again. Explore the 3D model and check the parts.";
        }


        updateModelStatus(
            "Try again."
        );

    }

}


// ============================================================
// CREATE 3D TEXT LABEL
// ============================================================

function createTextLabel(
    text,
    position
) {

    const canvas =
        document.createElement("canvas");


    const context =
        canvas.getContext("2d");


    canvas.width = 512;
    canvas.height = 128;


    context.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    context.font =
        "bold 42px Arial";


    context.textAlign =
        "center";


    context.textBaseline =
        "middle";


    context.fillStyle =
        "#ffffff";


    context.fillText(
        text,
        canvas.width / 2,
        canvas.height / 2
    );


    const texture =
        new THREE.CanvasTexture(
            canvas
        );


    texture.needsUpdate = true;


    const material =
        new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            depthTest: false
        });


    const sprite =
        new THREE.Sprite(
            material
        );


    sprite.position.copy(
        position
    );


    sprite.scale.set(
        2.4,
        0.6,
        1
    );


    scene.add(sprite);

    labelObjects.push(sprite);


    return sprite;

}


// ============================================================
// ADD BASIC 3D LABELS
// ============================================================

function addBasicLabels(topicData) {

    clearLabels();


    if (
        !currentModel ||
        !topicData
    ) {

        return;

    }


    // Only create simple general labels.
    // Exact anatomical labels depend on the names contained
    // inside the actual GLB model.

    const box =
        new THREE.Box3()
            .setFromObject(
                currentModel
            );


    const center =
        new THREE.Vector3();


    box.getCenter(
        center
    );


    const size =
        new THREE.Vector3();


    box.getSize(
        size
    );


    const labelPosition =
        new THREE.Vector3(
            center.x,
            center.y + size.y * 0.65,
            center.z
        );


    createTextLabel(
        topicData.title,
        labelPosition
    );

}


// ============================================================
// REMOVE LABELS WHEN MODEL CHANGES
// ============================================================

function removeAllLabels() {

    clearLabels();

}


// ============================================================
// RESET CHALLENGE
// ============================================================

function resetChallenge() {

    challengeScore = 0;

    currentChallenge = null;

    const result =
        getElement("challengeResult");


    if (result) {
        result.textContent = "";
    }


    updateChallengeForTopic();

}

// ============================================================
// HOLOVISION AI - 3D VISUALIZATION
// PART 5 - SEARCH + VOICE + AI ASSISTANT + VIEW MODES
// ============================================================


// ============================================================
// TOPIC BUTTONS
// ============================================================

function setupTopicButtons() {

    const buttons =
        document.querySelectorAll(
            "[data-topic]"
        );


    buttons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const topic =
                        button.dataset.topic;


                    if (!topic) {
                        return;
                    }


                    const input =
                        getElement("topicInput");


                    if (input) {

                        input.value =
                            topic;

                    }


                    loadTopic();

                }
            );

        }
    );

}


// ============================================================
// GLOBAL SEARCH
// ============================================================

function setupGlobalSearch() {

    const search =
        getElement("globalSearch");


    if (!search) {
        return;
    }


    search.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key !== "Enter"
            ) {
                return;
            }


            event.preventDefault();


            const value =
                search.value.trim();


            if (!value) {
                return;
            }


            const input =
                getElement("topicInput");


            if (input) {

                input.value =
                    value;

            }


            loadTopic();

        }
    );

}


// ============================================================
// SEARCH SUGGESTIONS
// ============================================================

function setupSearchSuggestions() {

    const search =
        getElement("globalSearch");


    if (!search) {
        return;
    }


    let suggestionBox =
        getElement(
            "searchSuggestions"
        );


    if (!suggestionBox) {

        suggestionBox =
            document.createElement("div");

        suggestionBox.id =
            "searchSuggestions";

        suggestionBox.className =
            "search-suggestions";


        if (search.parentElement) {

            search.parentElement.appendChild(
                suggestionBox
            );

        }

    }


    search.addEventListener(
        "input",
        function () {

            const value =
                normalizeTopic(
                    search.value
                );


            suggestionBox.innerHTML = "";


            if (!value) {

                suggestionBox.style.display =
                    "none";

                return;

            }


            const topics =
                Object.keys(
                    MODEL_REGISTRY
                );


            const matches =
                topics.filter(
                    function (topic) {

                        return topic.includes(
                            value
                        );

                    }
                ).slice(0, 6);


            if (matches.length === 0) {

                suggestionBox.style.display =
                    "none";

                return;

            }


            matches.forEach(
                function (topic) {

                    const item =
                        document.createElement(
                            "button"
                        );


                    item.type =
                        "button";


                    item.className =
                        "search-suggestion";


                    item.textContent =
                        MODEL_REGISTRY[topic].title;


                    item.addEventListener(
                        "click",
                        function () {

                            search.value =
                                MODEL_REGISTRY[
                                    topic
                                ].title;


                            const input =
                                getElement(
                                    "topicInput"
                                );


                            if (input) {

                                input.value =
                                    MODEL_REGISTRY[
                                        topic
                                    ].title;

                            }


                            suggestionBox.style.display =
                                "none";


                            loadTopic();

                        }
                    );


                    suggestionBox.appendChild(
                        item
                    );

                }
            );


            suggestionBox.style.display =
                "block";

        }
    );


    document.addEventListener(
        "click",
        function (event) {

            if (
                event.target !== search &&
                !suggestionBox.contains(
                    event.target
                )
            ) {

                suggestionBox.style.display =
                    "none";

            }

        }
    );

}


// ============================================================
// SPEECH SETUP
// ============================================================

function setupSpeech() {

    if (
        !("speechSynthesis" in window)
    ) {

        console.warn(
            "Speech synthesis is not supported."
        );

        return;

    }


    const speechBtn =
        getElement("speechBtn");


    if (speechBtn) {

        speechBtn.addEventListener(
            "click",
            function () {

                toggleSpeech();

            }
        );

    }

}


// ============================================================
// TOGGLE SPEECH
// ============================================================

function toggleSpeech() {

    if (
        !("speechSynthesis" in window)
    ) {

        alert(
            "Voice output is not supported in this browser."
        );

        return;

    }


    if (
        speechSynthesis.speaking
    ) {

        speechSynthesis.cancel();

        speechEnabled = false;

        updateSpeechButton();

        return;

    }


    speechEnabled = true;

    speakCurrentTopic();

    updateSpeechButton();

}


// ============================================================
// UPDATE SPEECH BUTTON
// ============================================================

function updateSpeechButton() {

    const button =
        getElement("speechBtn");


    if (!button) {
        return;
    }


    if (
        speechSynthesis &&
        speechSynthesis.speaking
    ) {

        button.textContent =
            "Stop Voice";

    } else {

        button.textContent =
            "Voice Assistant";

    }

}


// ============================================================
// SPEAK CURRENT TOPIC
// ============================================================

function speakCurrentTopic() {

    const data =
        getTopicData(
            currentTopic
        );


    if (!data) {

        speakText(
            "A suitable 3D model is currently unavailable for this topic."
        );

        return;

    }


    const text =
        data.title +
        ". " +
        data.explanation;


    speakText(text);

}


// ============================================================
// SPEAK TEXT
// ============================================================

function speakText(text) {

    if (
        !("speechSynthesis" in window)
    ) {

        return;

    }


    speechSynthesis.cancel();


    speechUtterance =
        new SpeechSynthesisUtterance(
            text
        );


    speechUtterance.rate =
        0.95;


    speechUtterance.pitch =
        1;


    speechUtterance.volume =
        1;


    speechUtterance.onend =
        function () {

            speechEnabled = false;

            updateSpeechButton();

        };


    speechSynthesis.speak(
        speechUtterance
    );

}


// ============================================================
// AI ASSISTANT SETUP
// ============================================================

function setupAIAssistant() {

    const askButton = getElement("askAIButton");
    const questionInput = getElement("aiQuestion");

    if (!askButton) {
        console.warn("AI Send button not found.");
        return;
    }

    if (askButton.dataset.aiReady === "true") {
        return;
    }

    askButton.dataset.aiReady = "true";

    askButton.addEventListener("click", function () {
        askAI();
    });

    if (questionInput) {

        questionInput.addEventListener("keydown", function (event) {

            if (event.key === "Enter" && !event.shiftKey) {

                event.preventDefault();

                askAI();
            }

        });

    }

}


// ============================================================
// ASK AI
// ============================================================

async function askAI() {

    const input = getElement("aiQuestion");

    if (!input) {
        console.warn("AI question input not found.");
        return;
    }

    const question = input.value.trim();

    if (!question) {

        showAIAnswer(
            "Please enter a question."
        );

        return;
    }

    showAIAnswer("Thinking...");

    try {

        const answer =
            await generateLearningAnswer(question);

        showAIAnswer(answer);

        if (speechEnabled) {
            speakText(answer);
        }

    } catch (error) {

        console.error(
            "AI Assistant error:",
            error
        );

        showAIAnswer(
            "Sorry, I couldn't generate an answer right now."
        );

    }

}


// ============================================================
// ASK AI
// ============================================================

async function askAI() {

    const input = getElement("aiQuestion");

    if (!input) {
        console.warn("AI question input not found.");
        return;
    }

    const question = input.value.trim();

    if (!question) {

        showAIAnswer(
            "Please enter a question."
        );

        return;
    }

    showAIAnswer("Thinking...");

    try {

        const answer =
            await generateLearningAnswer(question);

        showAIAnswer(answer);

        if (speechEnabled) {
            speakText(answer);
        }

    } catch (error) {

        console.error(
            "AI Assistant error:",
            error
        );

        showAIAnswer(
            "Sorry, I couldn't generate an answer right now."
        );

    }

}


// ============================================================
// GENERATE LEARNING ANSWER
// ============================================================
//
// This is the local learning-answer fallback.
//
// Later, Gemini/Firebase AI Logic can be connected here
// without changing the rest of the 3D page.
// ============================================================

async function generateLearningAnswer(question) {

    const topicData = getTopicData(currentTopic);

    const topicName =
        topicData
            ? topicData.title
            : currentTopic || "this topic";

    const q = normalizeTopic(question);

    // Heart
    if (
        q.includes("heart") &&
        (q.includes("what") || q.includes("explain"))
    ) {
        return (
            "The human heart is a muscular organ " +
            "that pumps blood throughout the body."
        );
    }

    if (
        q.includes("heart") &&
        q.includes("function")
    ) {
        return (
            "The main function of the heart is " +
            "to circulate blood throughout the body."
        );
    }

    // DNA
    if (q.includes("dna")) {
        return (
            "DNA stores genetic information. " +
            "Its structure is commonly represented " +
            "as a double helix."
        );
    }

    // Lungs
    if (
        q.includes("lung") ||
        q.includes("lungs")
    ) {
        return (
            "The lungs are respiratory organs. " +
            "They help exchange oxygen and carbon dioxide."
        );
    }

    // Eye
    if (q.includes("eye")) {
        return (
            "The eye detects light and sends visual " +
            "information to the brain."
        );
    }

    // Selected topic answer
    if (topicData) {
        return (
            `${topicName} is currently selected in HoloVision AI. ` +
            `${topicData.explanation}`
        );
    }

    return (
        `You are currently exploring ${topicName}. ` +
        "Ask about its structure, parts, function, " +
        "or how it works."
    );
}


// ============================================================
// SHOW AI ANSWER
// ============================================================

function showAIAnswer(
    answer
) {

    const output =
        getElement("aiAnswer");


    if (!output) {
        return;
    }


    output.textContent =
        answer;

}


// ============================================================
// NORMAL VIEW
// ============================================================

function setNormalView() {

    isXRay = false;


    if (!currentModel) {
        return;
    }


    currentModel.traverse(
        function (object) {

            if (!object.isMesh) {
                return;
            }


            const materials =
                Array.isArray(object.material)
                    ? object.material
                    : [object.material];


            materials.forEach(
                function (material) {

                    if (!material) {
                        return;
                    }


                    material.transparent =
                        false;


                    material.opacity =
                        1;


                    material.depthWrite =
                        true;


                    material.needsUpdate =
                        true;

                }
            );

        }
    );


    const button =
        getElement("xrayBtn");


    if (button) {

        button.textContent =
            "X-Ray";

    }


    updateModelStatus(
        "Normal View"
    );

}


// ============================================================
// TRANSPARENT VIEW
// ============================================================

function setTransparentView() {

    if (!currentModel) {
        return;
    }


    isXRay = false;


    currentModel.traverse(
        function (object) {

            if (!object.isMesh) {
                return;
            }


            const materials =
                Array.isArray(object.material)
                    ? object.material
                    : [object.material];


            materials.forEach(
                function (material) {

                    if (!material) {
                        return;
                    }


                    material.transparent =
                        true;


                    material.opacity =
                        0.55;


                    material.depthWrite =
                        false;


                    material.needsUpdate =
                        true;

                }
            );

        }
    );


    updateModelStatus(
        "Transparent View"
    );

}


// ============================================================
// X-RAY VIEW
// ============================================================

function setXRayView() {

    if (!currentModel) {
        return;
    }


    isXRay = true;


    currentModel.traverse(
        function (object) {

            if (!object.isMesh) {
                return;
            }


            const materials =
                Array.isArray(object.material)
                    ? object.material
                    : [object.material];


            materials.forEach(
                function (material) {

                    if (!material) {
                        return;
                    }


                    material.transparent =
                        true;


                    material.opacity =
                        0.28;


                    material.depthWrite =
                        false;


                    material.needsUpdate =
                        true;

                }
            );

        }
    );


    const button =
        getElement("xrayBtn");


    if (button) {

        button.textContent =
            "Normal View";

    }


    updateModelStatus(
        "X-Ray View"
    );

}


// ============================================================
// VIEW MODE BUTTONS
// ============================================================

function setupViewModeButtons() {

    const buttons =
        document.querySelectorAll(
            ".view-btn"
        );


    buttons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const mode =
                        button.dataset.mode;


                    setActiveViewButton(
                        button
                    );


                    if (
                        mode === "normal"
                    ) {

                        setNormalView();

                    }

                    else if (
                        mode === "transparent"
                    ) {

                        setTransparentView();

                    }

                    else if (
                        mode === "xray"
                    ) {

                        setXRayView();

                    }

                }
            );

        }
    );

}


// ============================================================
// ACTIVE VIEW BUTTON
// ============================================================

function setActiveViewButton(
    activeButton
) {

    const buttons =
        document.querySelectorAll(
            ".view-btn"
        );


    buttons.forEach(
        function (button) {

            button.classList.remove(
                "active"
            );

        }
    );


    if (activeButton) {

        activeButton.classList.add(
            "active"
        );

    }

}


// ============================================================
// CLEAR 3D VISUALISATION
// ============================================================

function clear3DVisualisation() {

    removeCurrentModel();

    clearLabels();

    reset3DView();


    currentTopic = "";

    currentStage = 0;


    const input =
        getElement("topicInput");


    if (input) {
        input.value = "";
    }


    setText(
        "modelTitle",
        "3D Visualization"
    );


    setText(
        "modelSubtitle",
        "Select a topic to begin"
    );


    setText(
        "aboutTitle",
        "About Topic"
    );


    setText(
        "aboutText",
        "Select a topic to explore it in interactive 3D."
    );


    updatePartsList([]);


    hideModelUnavailable();


    updateModelStatus(
        "Ready"
    );


    const aiAnswer =
        getElement("aiAnswer");


    if (aiAnswer) {
        aiAnswer.textContent = "";
    }


    const challengeResult =
        getElement("challengeResult");


    if (challengeResult) {
        challengeResult.textContent = "";
    }

}

// ============================================================
// HOLOVISION AI - 3D VISUALIZATION
// PART 6 - TOPICS + ZOOM + ROTATION + KEYBOARD CONTROLS
// ============================================================


// ============================================================
// ALL TOPIC BUTTON CONNECTION
// ============================================================

function setupAllTopicButtons() {
    const buttons = document.querySelectorAll("[data-topic]");

    buttons.forEach(button => {
        if (button.dataset.holoReady === "true") return;

        button.dataset.holoReady = "true";

        const topic = button.dataset.topic?.trim();

        if (!topic) return;

        
    });
}


// ============================================================
// UPDATE MODEL STATUS
// ============================================================

function updateModelStatus(message) {

    const status =
        getElement("modelStatus");


    if (status) {
        status.textContent = message;
    }

}


// ============================================================
// AUTO ROTATION
// ============================================================

function setAutoRotation() {

    autoRotateEnabled =
        !autoRotateEnabled;


    if (controls) {

        controls.autoRotate =
            autoRotateEnabled;

        controls.autoRotateSpeed =
            1.5;

    }


    updateModelStatus(
        autoRotateEnabled
            ? "Auto Rotation: ON"
            : "Auto Rotation: OFF"
    );


    const rotateBtn =
        getElement("rotateBtn");


    if (rotateBtn) {

        rotateBtn.classList.toggle(
            "active",
            autoRotateEnabled
        );

    }

}


// ============================================================
// ZOOM IN
// ============================================================

function zoomIn() {

    if (!camera) {
        return;
    }


    const direction =
        new THREE.Vector3();


    camera.getWorldDirection(
        direction
    );


    camera.position.addScaledVector(
        direction,
        0.7
    );


    if (controls) {
        controls.update();
    }


    updateModelStatus(
        "Zoom In"
    );

}


// ============================================================
// ZOOM OUT
// ============================================================

function zoomOut() {

    if (!camera) {
        return;
    }


    const direction =
        new THREE.Vector3();


    camera.getWorldDirection(
        direction
    );


    camera.position.addScaledVector(
        direction,
        -0.7
    );


    // Keep camera within safe distance
    if (controls) {

        const distance =
            camera.position.distanceTo(
                controls.target
            );


        if (
            distance < controls.minDistance
        ) {

            camera.position
                .normalize()
                .multiplyScalar(
                    controls.minDistance
                );

        }


        if (
            distance > controls.maxDistance
        ) {

            camera.position
                .normalize()
                .multiplyScalar(
                    controls.maxDistance
                );

        }


        controls.update();

    }


    updateModelStatus(
        "Zoom Out"
    );

}


// ============================================================
// RESET VIEW MODE
// ============================================================

function resetViewMode() {

    setNormalView();

    resetCamera();

    autoRotateEnabled = false;


    if (controls) {
        controls.autoRotate = false;
    }


    const rotateBtn =
        getElement("rotateBtn");


    if (rotateBtn) {

        rotateBtn.classList.remove(
            "active"
        );

    }


    updateModelStatus(
        "View Reset"
    );

}


// ============================================================
// KEYBOARD CONTROLS
// ============================================================

function setupKeyboardControls() {

    if (
        document.body.dataset.holoKeyboardReady ===
        "true"
    ) {
        return;
    }


    document.body.dataset.holoKeyboardReady =
        "true";


    document.addEventListener(
        "keydown",
        function (event) {

            // Don't control 3D while typing
            const active =
                document.activeElement;


            if (
                active &&
                (
                    active.tagName === "INPUT" ||
                    active.tagName === "TEXTAREA"
                )
            ) {

                return;

            }


            switch (event.key) {

                case "+":
                case "=":

                    zoomIn();

                    break;


                case "-":
                case "_":

                    zoomOut();

                    break;


                case "r":
                case "R":

                    resetCamera();

                    break;


                case "x":
                case "X":

                    toggleXRay();

                    break;


                case " ":

                    event.preventDefault();

                    setAutoRotation();

                    break;

            }

        }
    );

}


// ============================================================
// MODEL STATUS AFTER LOAD
// ============================================================

function updateLoadedModelStatus() {

    if (!currentModel) {

        updateModelStatus(
            "No 3D Model Loaded"
        );

        return;

    }


    const data =
        getTopicData(
            currentTopic
        );


    if (data) {

        updateModelStatus(
            data.title +
            " • 3D Model Ready"
        );

    } else {

        updateModelStatus(
            "3D Model Ready"
        );

    }

}


// ============================================================
// SELECT ACTIVE TOPIC BUTTON
// ============================================================

function setActiveTopicButton(
    topic
) {

    const normalized =
        normalizeTopic(topic);


    const buttons =
        document.querySelectorAll(
            "[data-topic]"
        );


    buttons.forEach(
        function (button) {

            const buttonTopic =
                normalizeTopic(
                    button.dataset.topic
                );


            button.classList.toggle(
                "active",
                buttonTopic === normalized
            );

        }
    );

}


// ============================================================
// LOAD SELECTED REAL MODEL
// ============================================================

function loadSelectedRealModel(
    topic
) {

    const normalized =
        normalizeTopic(topic);


    const path =
        getTopicModelPath(
            normalized
        );


    const data =
        getTopicData(
            normalized
        );


    if (!path || !data) {

        showModelUnavailable();

        return;

    }


    currentTopic =
        normalized;


    removeCurrentModel();

    clearLabels();

    hideModelUnavailable();

    setModelLoading();


    loadReal3DModel(
        path,
        data
    );

}


// ============================================================
// REFRESH CURRENT MODEL
// ============================================================

function refreshCurrentModel() {

    if (!currentTopic) {
        return;
    }


    loadSelectedRealModel(
        currentTopic
    );

}


// ============================================================
// CLEAR ACTIVE TOPIC
// ============================================================

function clearActiveTopic() {

    document
        .querySelectorAll("[data-topic]")
        .forEach(function (button) {

            button.classList.remove(
                "active"
            );

        });

}


// ============================================================
// UPDATE TOPIC AFTER MODEL LOAD
// ============================================================

function updateTopicUI() {

    const data =
        getTopicData(
            currentTopic
        );


    if (!data) {
        return;
    }


    setText(
        "modelTitle",
        data.title
    );


    setText(
        "modelSubtitle",
        data.subtitle
    );


    updateAboutSection(
        data
    );


    updatePartsList(
        data.parts || []
    );


    setActiveTopicButton(
        currentTopic
    );


    updateLoadedModelStatus();

}


// ============================================================
// SAFE MODEL LOAD AFTER SCENE INITIALIZATION
// ============================================================

function loadDefaultModel() {

    const input =
        getElement("topicInput");


    let topic =
        input
            ? input.value.trim()
            : "";


    if (!topic) {

        topic =
            DEFAULT_TOPIC;

    }


    if (input) {
        input.value = topic;
    }


    currentTopic =
        normalizeTopic(topic);


    loadTopic();

}


// ============================================================
// CLEAN CURRENT 3D OBJECTS
// ============================================================

function cleanup3DObjects() {

    clearLabels();

    removeCurrentModel();

}


// ============================================================
// PREPARE 3D PAGE
// ============================================================

function prepare3DPage() {

    console.log(
        "Preparing HoloVision 3D page..."
    );


    setupAllTopicButtons();

    setupGlobalSearch();

    setupSearchSuggestions();

    setupSpeech();

    setupAIAssistant();

    setupViewModeButtons();

    setupLearningModes();

    setupExperimentControls();

    setupChallenge();

    setupKeyboardControls();


    console.log(
        "HoloVision 3D page controls ready."
    );

}

// ============================================================
// HOLOVISION AI - 3D VISUALIZATION
// PART 7 - FINAL INITIALIZATION + ANIMATION + CLEANUP
// ============================================================


// ============================================================
// MAIN ANIMATION LOOP
// ============================================================

function animate() {

    if (!renderer || !scene || !camera) {
        animationStarted = false;
        return;
    }


    requestAnimationFrame(
        animate
    );


    // --------------------------------------------------------
    // Controls
    // --------------------------------------------------------

    if (controls) {
        controls.update();
    }


    // --------------------------------------------------------
    // Heart pulse animation
    // --------------------------------------------------------

    updateHeartAnimation();


    // --------------------------------------------------------
    // Render
    // --------------------------------------------------------

    renderer.render(
        scene,
        camera
    );

}


// ============================================================
// ENSURE DEFAULT HUMAN HEART
// ============================================================

function ensureDefaultHumanHeart() {

    const input =
        getElement("topicInput");


    if (!input) {
        return;
    }


    if (!input.value.trim()) {

        input.value =
            "Human Heart";

    }

}


// ============================================================
// FINAL PAGE SETUP
// ============================================================

function finalPageSetup() {

    // Prevent duplicate initialization
    if (
        document.body.dataset.holo3DInitialized ===
        "true"
    ) {

        console.log(
            "HoloVision 3D is already initialized."
        );

        return;

    }


    document.body.dataset.holo3DInitialized =
        "true";


    console.log(
        "Initializing HoloVision AI 3D..."
    );


    // --------------------------------------------------------
    // 1. Create Three.js scene
    // --------------------------------------------------------

    start3D();


    // --------------------------------------------------------
    // 2. Prepare page controls
    // --------------------------------------------------------

    prepare3DPage();
 

    console.log(
        "HoloVision AI 3D initialization complete."
    );

}


// ============================================================
// RESET CAMERA BUTTON SUPPORT
// ============================================================

function resetCameraAndView() {

    resetViewMode();

}


// ============================================================
// CLEANUP THREE.JS
// ============================================================

function cleanup3DScene() {

    // --------------------------------------------------------
    // Stop speech
    // --------------------------------------------------------

    if (
        "speechSynthesis" in window
    ) {

        speechSynthesis.cancel();

    }


    speechEnabled = false;


    // --------------------------------------------------------
    // Remove model
    // --------------------------------------------------------

    clearLabels();

    removeCurrentModel();


    // --------------------------------------------------------
    // Dispose renderer
    // --------------------------------------------------------

    if (renderer) {

        renderer.dispose();

        renderer.forceContextLoss();

        if (
            renderer.domElement &&
            renderer.domElement.parentElement
        ) {

            renderer.domElement.parentElement
                .removeChild(
                    renderer.domElement
                );

        }

    }


    // --------------------------------------------------------
    // Reset variables
    // --------------------------------------------------------

    renderer = null;
    scene = null;
    camera = null;
    controls = null;

    currentModel = null;

    animationStarted = false;

}


// ============================================================
// PAGE UNLOAD
// ============================================================

window.addEventListener(
    "beforeunload",
    function () {

        cleanup3DScene();

    }
);


// ============================================================
// PUBLIC FUNCTIONS
// ============================================================

window.loadTopic =
    loadTopic;


window.clear3DVisualisation =
    clear3DVisualisation;


window.resetCamera =
    resetCamera;


window.resetCameraAndView =
    resetCameraAndView;


window.setXRayView =
    setXRayView;


window.setNormalView =
    setNormalView;


window.setTransparentView =
    setTransparentView;


window.toggleXRay =
    toggleXRay;


window.toggleSpeech =
    toggleSpeech;


window.askAI =
    askAI;


window.setLearningMode =
    setLearningMode;


window.zoomIn =
    zoomIn;


window.zoomOut =
    zoomOut;


window.setAutoRotation =
    setAutoRotation;


window.loadSelectedRealModel =
    loadSelectedRealModel;


window.refreshCurrentModel =
    refreshCurrentModel;


window.resetChallenge =
    resetChallenge;


// ============================================================
// START APPLICATION
// ============================================================
//
// IMPORTANT:
// This is the ONLY place where the page is initialized.
// Do not add another DOMContentLoaded block elsewhere.
// ============================================================

function bootHoloVision3D() {

    try {

        finalPageSetup();

    } catch (error) {

        console.error(
            "HoloVision 3D initialization error:",
            error
        );


        updateModelStatus(
            "3D initialization failed"
        );

    }

}


// ============================================================
// DOM READY
// ============================================================

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        bootHoloVision3D,
        {
            once: true
        }
    );

} else {

    bootHoloVision3D();

}


// ============================================================
// END OF HOLOVISION AI 3D PAGE
// ============================================================