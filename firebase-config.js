import {
initializeApp
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-app.js";

import {
getAuth
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-auth.js";

import {
getAI,
getGenerativeModel,
GoogleAIBackend
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-ai.js";

// ========================================
// FIREBASE CONFIG
// ========================================

const firebaseConfig = {

apiKey: "AIzaSyAh-zY2lZIOMaTYEwAGkGfgRXrkwLXvmm4",  

authDomain: "holovision-ai.firebaseapp.com",  

projectId: "holovision-ai",  

storageBucket:  
    "holovision-ai.firebasestorage.app",  

messagingSenderId:  
    "1021963543399",  

appId:  
    "1:1021963543399:web:e50257be7cb69a412545c2"

};

// ========================================
// INITIALIZE FIREBASE
// ========================================

const app =
initializeApp(firebaseConfig);

// ========================================
// APP CHECK
// ========================================

// ========================================
// FIREBASE AUTH
// ========================================

const auth =
getAuth(app);

// ========================================
// FIREBASE AI LOGIC
// ========================================

const ai =
getAI(app, {

backend:  
        new GoogleAIBackend()  

});

// ========================================
// GEMINI MODEL
// ========================================

const model =
getGenerativeModel(ai, {

model:  
        "gemini-3.6-flash"  

});

// ========================================
// EXPORT
// ========================================

export {

app,  
auth,  
model

};
