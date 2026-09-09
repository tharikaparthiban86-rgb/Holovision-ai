// ========================================
// HOLOVISION AI - CHAT.JS
// PART 1 - REAL AI CHAT
// ========================================

import { model } from "./firebase-config.js";

// ========================================
// GET HTML ELEMENTS
// ========================================

const questionInput =
document.getElementById("question");

const sendBtn =
document.getElementById("sendBtn");

const voiceBtn =
document.getElementById("voiceBtn");

const speakBtn =
document.getElementById("speakBtn");

const answerBox =
document.getElementById("answer");

// ========================================
// SEND BUTTON
// ========================================

if (sendBtn) {

sendBtn.addEventListener(  
    "click",  
    sendQuestion  
);

}

// ========================================
// REAL GEMINI AI
// ========================================

async function sendQuestion() {

if (!questionInput || !answerBox) {  
    return;  
}  


const question =  
    questionInput.value.trim();  


if (!question) {  

    alert(  
        "Please enter a question."  
    );  

    return;  
}  


// ====================================  
// THINKING MESSAGE  
// ====================================  

answerBox.innerHTML = `  

    <div class="ai-message">  

        HoloVision AI is thinking...  

    </div>  

`;  


try {  

    // =================================  
    // AI PROMPT  
    // =================================  

    const prompt = `

You are HoloVision AI, an educational
assistant for school and college students.

Answer the user's question clearly and
accurately.

Use simple language.

When useful, include:

Definition

Explanation

Key points

Example


User question:

${question}

`;  


    // =================================  
    // SEND TO GEMINI  
    // =================================  

    const result =  
        await model.generateContent(  
            prompt  
        );  


    const response =  
        result.response;  


    const answer =  
        response.text();  


    // =================================  
    // DISPLAY ANSWER  
    // =================================  

    answerBox.innerHTML = `  

        <div class="ai-message">  

            <strong>  
                HoloVision AI  
            </strong>  

            <br><br>  

            ${formatAIAnswer(answer)}  

        </div>  

    `;  


}

catch (error) {

console.error(  
    "Gemini AI Error:",  
    error  
);  

answerBox.innerHTML = `  

    <div class="ai-message">  

        <strong>Error Details:</strong>  

        <br><br>  

        ${escapeHTML(  
            error.message || String(error)  
        )}  

    </div>  

`;

}

}

// ========================================
// FORMAT AI ANSWER
// ========================================

function formatAIAnswer(text) {

let formatted =  
    escapeHTML(text);  


// ====================================  
// HEADINGS  
// ====================================  

formatted = formatted.replace(  
    /^### (.*)$/gm,  
    "<h3>$1</h3>"  
);  


formatted = formatted.replace(  
    /^## (.*)$/gm,  
    "<h2>$1</h2>"  
);  


formatted = formatted.replace(  
    /^# (.*)$/gm,  
    "<h1>$1</h1>"  
);  


// ====================================  
// BOLD TEXT  
// ====================================  

formatted = formatted.replace(  
    /\*\*(.*?)\*\*/g,  
    "<strong>$1</strong>"  
);  


// ====================================  
// BULLET POINTS  
// ====================================  

formatted = formatted.replace(  
    /^\* (.*)$/gm,  
    "• $1"  
);  


formatted = formatted.replace(  
    /^- (.*)$/gm,  
    "• $1"  
);  


// ====================================  
// NUMBERED LISTS  
// ====================================  

formatted = formatted.replace(  
    /^(\d+)\. (.*)$/gm,  
    "<strong>$1.</strong> $2"  
);  


  


// ====================================  
// LINE BREAKS  
// ====================================  

formatted =  
    formatted.replace(  
        /\n/g,  
        "<br>"  
    );  


return formatted;

}

// ========================================
// ESCAPE HTML
// ========================================

function escapeHTML(text) {

const div =  
    document.createElement("div");  

div.textContent = text;  

return div.innerHTML;

}

// ========================================
// ENTER KEY
// ========================================

if (questionInput) {

questionInput.addEventListener(  
    "keydown",  
    function (event) {  

        if (  
            event.key === "Enter" &&  
            !event.shiftKey  
        ) {  

            event.preventDefault();  

            sendQuestion();  

        }  

    }  
);

}

console.log(
"HoloVision AI - Part 1 loaded successfully."
);

// ========================================
// PART 2 - VOICE INPUT + AI SPEAK
// ========================================

let recognition = null;

// ========================================
// VOICE RECOGNITION
// ========================================

if (
"SpeechRecognition" in window ||
"webkitSpeechRecognition" in window
) {

const SpeechRecognition =  
    window.SpeechRecognition ||  
    window.webkitSpeechRecognition;  


recognition =  
    new SpeechRecognition();  


recognition.lang = "en-IN";  

recognition.continuous = false;  

recognition.interimResults = false;  


recognition.onstart = function () {  

    if (voiceBtn) {  

        voiceBtn.textContent =  
            "Listening...";  

    }  

};  


recognition.onresult =  
    function (event) {  

        const text =  
            event.results[0][0]  
                .transcript;  


        if (questionInput) {  

            questionInput.value =  
                text;  

        }  

    };  


recognition.onend = function () {  

    if (voiceBtn) {  

        voiceBtn.textContent =  
            "Speak";  

    }  

};  


recognition.onerror =  
    function (event) {  

        console.log(  
            "Voice recognition error:",  
            event.error  
        );  


        if (voiceBtn) {  

            voiceBtn.textContent =  
                "Speak";  

        }  

    };

}

// ========================================
// VOICE BUTTON
// ========================================

if (voiceBtn) {

voiceBtn.addEventListener(  
    "click",  
    function () {  

        if (!recognition) {  

            alert(  
                "Voice recognition is not supported in this browser."  
            );  

            return;  

        }  


        try {  

            recognition.start();  

        } catch (error) {  

            console.log(  
                "Voice recognition already running."  
            );  

        }  

    }  
);

}

// ========================================
// SPEAK AI ANSWER
// ========================================

if (speakBtn) {

speakBtn.addEventListener(  
    "click",  
    function () {  

        if (!answerBox) {  
            return;  
        }  


        const text =  
            answerBox.innerText.trim();  


        if (!text) {  

            alert(  
                "There is no answer to read."  
            );  

            return;  

        }  


        if (  
            !("speechSynthesis" in window)  
        ) {  

            alert(  
                "Text-to-speech is not supported."  
            );  

            return;  

        }  


        speechSynthesis.cancel();  


        const speech =  
            new SpeechSynthesisUtterance(  
                text  
            );  


        speech.lang = "en-IN";  

        speech.rate = 0.95;  

        speech.pitch = 1;  

        speech.volume = 1;  


        speechSynthesis.speak(  
            speech  
        );  

    }  
);

}

console.log(
"HoloVision AI - Part 2 loaded successfully."
);

// ========================================
// PART 3 - STUDY MODE + IMAGE + CAMERA
// ========================================

// ========================================
// GET ELEMENTS
// ========================================

const studyBtn =
document.getElementById("studyBtn");

const clearBtn =
document.getElementById("clearBtn");

const cameraBtn =
document.getElementById("cameraBtn");

const uploadBtn =
document.getElementById("uploadBtn");

const imageInput =
document.getElementById("imageInput");

const imagePreview =
document.getElementById("imagePreview");

// ========================================
// STUDY MODE
// ========================================

if (studyBtn) {

studyBtn.addEventListener(  
    "click",  
    async function () {  

        if (!questionInput || !answerBox) {  
            return;  
        }  


        const question =  
            questionInput.value.trim();  


        if (!question) {  

            alert(  
                "Enter a topic first."  
            );  

            return;  

        }  


        answerBox.innerHTML = `  

            <div class="ai-message">  

                HoloVision AI is creating  
                your study notes...  

            </div>  

        `;  


        try {  

            const prompt = `

You are HoloVision AI Study Mode.

Create simple study notes for:

${question}

Include:

1. Definition


2. Simple explanation


3. Important points


4. Example


5. Short exam revision points



Use easy language suitable for students.

`;  


            const result =  
                await model.generateContent(  
                    prompt  
                );  


            const response =  
                result.response;  


            const answer =  
                response.text();  


            answerBox.innerHTML = `  

                <div class="ai-message">  

                    <strong>  
                        HoloVision AI - Study Mode  
                    </strong>  

                    <br><br>  

                    ${formatAIAnswer(answer)}  

                </div>  

            `;  

        } catch (error) {  

            console.error(  
                "Study Mode Error:",  
                error  
            );  


            answerBox.innerHTML = `  

                <div class="ai-message">  

                    Unable to create study notes  
                    right now.  

                </div>  

            `;  

        }  

    }  
);

          }
// ========================================
// CLEAR CHAT
// ========================================

if (clearBtn) {

clearBtn.addEventListener(  
    "click",  
    function () {  

        if (questionInput) {  

            questionInput.value = "";  

        }  


        if (answerBox) {  

            answerBox.innerHTML = "";  

        }  


        if (typeof visual3dArea !== "undefined") {  

            visual3dArea.innerHTML = "";  

        }  


        if (  
            typeof holoRotation !== "undefined"  
        ) {  

            holoRotation = 0;  

        }  


        if (  
            typeof modelScale !== "undefined"  
        ) {  

            modelScale = 1;  

        }  


        if (imagePreview) {  

            imagePreview.innerHTML = "";  

        }  


        if (imageInput) {  

            imageInput.value = "";  

        }  


        if (  
            "speechSynthesis" in window  
        ) {  

            speechSynthesis.cancel();  

        }  

    }  
);

}

// ========================================
// UPLOAD IMAGE BUTTON
// ========================================

if (uploadBtn && imageInput) {

uploadBtn.addEventListener(  
    "click",  
    function () {  

        imageInput.click();  

    }  
);

}

// ========================================
// CAMERA BUTTON
// ========================================

if (cameraBtn && imageInput) {

cameraBtn.addEventListener(  
    "click",  
    function () {  

        imageInput.click();  

    }  
);

}

// ========================================
// IMAGE PREVIEW
// ========================================

if (imageInput) {

imageInput.addEventListener(  
    "change",  
    function () {  

        const file =  
            imageInput.files[0];  


        if (!file) {  

            return;  

        }  


        if (  
            !file.type.startsWith("image/")  
        ) {  

            alert(  
                "Please select an image."  
            );  

            imageInput.value = "";  

            return;  

        }  


        const reader =  
            new FileReader();  


        reader.onload =  
            function (event) {  

                if (!imagePreview) {  

                    return;  

                }  


                imagePreview.innerHTML = `  

                    <div  
                        class="selected-image-box"  
                    >  

                        <p>  
                            Selected Image  
                        </p>  

                        <img  
                            src="${event.target.result}"  
                            alt="Selected Image"  
                            style="  
                                max-width:100%;  
                                max-height:300px;  
                                border-radius:12px;  
                                margin-top:10px;  
                                box-shadow:  
                                    0 0 15px  
                                    rgba(0,234,255,.5);  
                            "  
                        >  

                    </div>  

                `;  

            };  


        reader.readAsDataURL(file);  

    }  
);

}

console.log(
"HoloVision AI - Part 3 loaded successfully."
);
// ========================================
// REAL 3D BUTTON - QUICK EDIT VERSION
// ========================================

function setupReal3DButton() {

    if (typeof visual3dBtn === "undefined" || !visual3dBtn) {
        console.log("3D button not found");
        return;
    }

    console.log("Real 3D button ready");

    visual3dBtn.addEventListener("click", function () {

        const topic = questionInput.value.trim();

        if (!topic) {
            alert("Please enter a topic first.");
            return;
        }

        window.location.href =
            "3d.html?topic=" +
            encodeURIComponent(topic);

    });
}


// ========================================
// LOAD THREE.JS
// ========================================

function loadReal3D() {

    if (
        typeof THREE !== "undefined"
    ) {

        startReal3D(
            questionInput.value.trim()
        );

        return;
    }


    const script =
        document.createElement("script");

    script.src =
        "https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.min.js";


    script.onload =
        function () {

            loadOrbitControls();

        };


    script.onerror =
        function () {

            alert(
                "Three.js could not load."
            );

        };


    document.head.appendChild(script);

}


// ========================================
// LOAD ORBIT CONTROLS
// ========================================

function loadOrbitControls() {

    const script =
        document.createElement("script");

    script.src =
        "https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js";


    script.onload =
        function () {

            loadReal3DViewer();

        };


    script.onerror =
        function () {

            alert(
                "3D Controls could not load."
            );

        };


    document.head.appendChild(script);

}


// ========================================
// LOAD REAL 3D VIEWER
// ========================================

function loadReal3DViewer() {

    const script =
        document.createElement("script");

    script.src =
        "./real3d.js";


    script.onload =
        function () {

            startReal3D(
                questionInput.value.trim()
            );

        };


    script.onerror =
        function () {

            alert(
                "real3d.js could not load."
            );

        };


    document.body.appendChild(script);

}


// ========================================
// START BUTTON
// ========================================

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        setupReal3DButton
    );

} else {

    setupReal3DButton();

}
// ========================================
// WAIT FOR PAGE
// ========================================

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        setupReal3DButton
    );

} else {

    setupReal3DButton();

}
// ========================================    
// HOLOVISION AI    
// PART 5 - ANSWER CONTROLS    
// ========================================    
    
    
// ========================================    
// COPY AI ANSWER    
// ========================================    
    
const copyAnswerBtn =    
    document.getElementById("copyAnswerBtn");    
    
    
if (copyAnswerBtn) {    
    
    copyAnswerBtn.addEventListener(    
        "click",    
        async function () {    
    
            if (!answerBox) {    
                return;    
            }    
    
    
            const text =    
                answerBox.innerText.trim();    
    
    
            if (!text) {    
    
                alert(    
                    "There is no answer to copy."    
                );    
    
                return;    
    
            }    
    
    
            try {    
    
                await navigator.clipboard.writeText(    
                    text    
                );    
    
    
                copyAnswerBtn.textContent =    
                    "✓ Copied";    
    
    
                setTimeout(    
                    function () {    
    
                        copyAnswerBtn.textContent =    
                            "Copy";    
    
                    },    
                    1500    
                );    
    
    
            } catch (error) {    
    
                console.error(    
                    "Copy error:",    
                    error    
                );    
    
    
                alert(    
                    "Unable to copy the answer."    
                );    
    
            }    
    
        }    
    );    
    
}    

// ========================================    
// STOP AI SPEAKING    
// ========================================    
    
const stopSpeakBtn =    
    document.getElementById("stopSpeakBtn");    
    
    
if (stopSpeakBtn) {    
    
    stopSpeakBtn.addEventListener(    
        "click",    
        function () {    
    
            if (    
                "speechSynthesis" in window    
            ) {    
    
                speechSynthesis.cancel();    
    
            }    
    
        }    
    );    
    
}    
    
    
console.log(    
    "HoloVision AI - Part 5 loaded successfully."    
);    
    
    
// ========================================    
// HOLOVISION AI    
// PART 5A - AI IMAGE SCANNER    
// ========================================    
    
    
// ========================================    
// SELECTED IMAGE FILE    
// ========================================    
    
let selectedImageFile = null;    
    
    
// ========================================    
// STORE SELECTED IMAGE    
// ========================================    
    
if (imageInput) {    
    
    imageInput.addEventListener(    
        "change",    
        function () {    
    
            const file =    
                imageInput.files[0];    
    
    
            if (!file) {    
    
                selectedImageFile = null;    
    
                return;    
    
            }    
    
    
            selectedImageFile = file;    
    
        }    
    );    
    
}    
    
    
// ========================================    
// CREATE ANALYZE BUTTON    
// ========================================    
    
function createAnalyzeImageButton() {    
    
    if (!imagePreview) {    
        return;    
    }    
    
    
    const oldButton =    
        document.getElementById(    
            "analyzeImageBtn"    
        );    
    
    
    if (oldButton) {    
        return;    
    }    
    
    
    const analyzeButton =    
        document.createElement(    
            "button"    
        );    
    
    
    analyzeButton.id =    
        "analyzeImageBtn";    
    
    
    analyzeButton.type =    
        "button";    
    
    
    analyzeButton.textContent =    
        "Analyze Image with AI";    
    
    
    analyzeButton.style.cssText = `    
    
        margin-top:15px;    
    
        padding:12px 20px;    
    
        border:2px solid #00eaff;    
    
        border-radius:10px;    
    
        background:#031522;    
    
        color:#00eaff;    
    
        font-size:16px;    
    
        font-weight:bold;    
    
        cursor:pointer;    
    
        box-shadow:    
            0 0 15px    
            rgba(0,234,255,.5);    
    
    `;    
    
    
    analyzeButton.addEventListener(    
        "click",    
        analyzeImageWithAI    
    );    
    
    
    imagePreview.appendChild(    
        analyzeButton    
    );    
    
}    
    
    
// ========================================    
// PART 5A STATUS    
// ========================================    
    
console.log(    
    "HoloVision AI - Part 5A loaded successfully."    
);    
    
    
    
// ========================================    
// HOLOVISION AI    
// PART 5B - SHOW ANALYZE BUTTON    
// ========================================    
    
if (imageInput) {    
    
    imageInput.addEventListener(    
        "change",    
        function () {    
    
            const file =    
                imageInput.files[0];    
    
    
            if (!file) {    
                return;    
            }    
    
    
            selectedImageFile = file;    
    
    
            // Wait for preview to load    
            setTimeout(    
                function () {    
    
                    if (!imagePreview) {    
                        return;    
                    }    
    
    
                    // Remove old button if exists    
                    const oldButton =    
                        document.getElementById(    
                            "analyzeImageBtn"    
                        );    
    
    
                    if (oldButton) {    
                        oldButton.remove();    
                    }    
    
    
                    // Create button    
                    const analyzeButton =    
                        document.createElement(    
                            "button"    
                        );    
    
    
                    analyzeButton.id =    
                        "analyzeImageBtn";    
    
    
                    analyzeButton.type =    
                        "button";    
    
    
                    analyzeButton.textContent =    
                        "Analyze Image with AI";    
    
    
                    analyzeButton.style.cssText = `    
                        display:block;    
                        width:100%;    
                        margin-top:15px;    
                        padding:14px;    
                        border:2px solid #00eaff;    
                        border-radius:12px;    
                        background:#031522;    
                        color:#00eaff;    
                        font-size:16px;    
                        font-weight:bold;    
                        cursor:pointer;    
                        box-shadow:    
                            0 0 15px    
                            rgba(0,234,255,.6);    
                    `;    
    
                 analyzeButton.addEventListener(    
    "click",    
    analyzeImageWithAI    
);    
    
                        
                    imagePreview.appendChild(    
                        analyzeButton    
                    );    
    
                },    
                1000    
            );    
    
        }    
    );    
    
}    
    
    
console.log(    
    "HoloVision AI - Part 5B loaded successfully."    
);    
    
    
// ========================================    
// HOLOVISION AI    
// PART 5C - REAL AI IMAGE ANALYSIS    
// ========================================    
    
    
// ========================================    
// ANALYZE IMAGE WITH GEMINI AI    
// ========================================    
    
async function analyzeImageWithAI() {    
    
    if (!selectedImageFile) {    
    
        alert(    
            "Please upload an image first."    
        );    
    
        return;    
    
    }    
    
    
    if (!answerBox) {    
    
        return;    
    
    }    
    
    
    // ====================================    
    // SHOW LOADING MESSAGE    
    // ====================================    
    
    answerBox.innerHTML = `    
    
        <div class="ai-message">    
    
            <strong>    
                HoloVision AI    
            </strong>    
    
            <br><br>    
    
            📷 Analyzing your image...    
    
            <br><br>    
    
            Please wait.    
    
        </div>    
    
    `;    
    
    
    try {    
    
        // ====================================    
        // CONVERT IMAGE TO BASE64    
        // ====================================    
    
        const imageData =    
            await fileToBase64(    
                selectedImageFile    
            );    
    
            // ====================================    
        // AI PROMPT    
        // ====================================    
    
        const prompt = `    
    
You are HoloVision AI, an educational    
assistant for school and college students.    
    
Analyze the uploaded image carefully.    
    
Explain the image in simple and clear    
language.    
    
If it is an educational diagram,    
include:    
    
1. What the image shows    
2. Main parts or important elements    
3. Simple explanation    
4. Important points    
5. Educational use    
    
If there is text in the image,    
try to explain that text clearly.    
    
Do not give unnecessary information.    
    
        `;    
    
    
        // ====================================    
        // SEND IMAGE + PROMPT TO GEMINI    
        // ====================================    
    
        const result =    
            await model.generateContent(    
                [    
                    prompt,    
    
                    {    
                        inlineData: {    
    
                            data:    
                                imageData,    
    
                            mimeType:    
                                selectedImageFile.type    
    
                        }    
                    }    
                ]    
            );    
    
    
        const response =    
            result.response;    
    
    
        const answer =    
            response.text();    
    
    // ====================================    
        // DISPLAY AI ANSWER    
        // ====================================    
    
        answerBox.innerHTML = `    
    
            <div class="ai-message">    
    
                <strong>    
                    📷 HoloVision AI Image Analysis    
                </strong>    
    
                <br><br>    
    
                ${formatAIAnswer(answer)}    
    
            </div>    
    
        `;    
    
    
    } catch (error) {    
    
        console.error(    
            "Image Analysis Error:",    
            error    
        );    
    
    
        const errorMessage =    
            error.message ||    
            String(error);    
// ====================================    
        // AI QUOTA / RATE LIMIT ERROR    
        // ====================================    
    
        if (    
            errorMessage.includes("429") ||    
            errorMessage.toLowerCase().includes("quota") ||    
            errorMessage.toLowerCase().includes("rate limit")    
        ) {    
    
            answerBox.innerHTML = `    
    
                <div class="ai-message">    
    
                    <strong>    
                        ⚠️ AI Request Limit Reached    
                    </strong>    
    
                    <br><br>    
    
                    Image analysis is temporarily    
                    unavailable.    
    
                    <br><br>    
    
                    Please wait and try again later.    
    
                </div>    
    
            `;    
    
        } else {    
    
            // ====================================    
            // NORMAL ERROR    
            // ====================================    
    
            answerBox.innerHTML = `    
    
                <div class="ai-message">    
    
                    <strong>    
                        ⚠️ Image Analysis Error    
                    </strong>    
    
                    <br><br>    
    
                    Something went wrong while    
                    analyzing the image.    
    
                    <br><br>    
    
                    Please try again.    
    
                </div>    
    
            `;    
    
        }    
    
    }    
    
}    
    
    
// ========================================    
// CONVERT IMAGE FILE TO BASE64    
// ========================================    
    
function fileToBase64(file) {    
    
    return new Promise(    
        function (resolve, reject) {    
    
            const reader =    
                new FileReader();    
    
    
            reader.onload =    
                function () {    
    
                    const result =    
                        reader.result;    
    
    
                    const base64 =    
                        result.split(",")[1];    
    
    
                    resolve(base64);    
    
                };    
    
    
            reader.onerror =    
                function () {    
    
                    reject(    
                        new Error(    
                            "Unable to read image."    
                        )    
                    );    
    
                };    
    
    
            reader.readAsDataURL(    
                file    
            );    
    
        }    
    );    
    
}    
    
    
// ========================================    
// PART 5C STATUS    
// ========================================    
    
console.log(    
    "HoloVision AI - Part 5C loaded successfully."    
);    
    
// ========================================    
// HOLOVISION AI    
// PART 6A - QUIZ BUTTON FIXED    
// ========================================    
    
function createQuizButton() {    
    
    // Check question input    
    if (!questionInput) {    
        console.log("Question input not found");    
        return;    
    }    
    
    // Prevent duplicate button    
    const oldQuizButton =    
        document.getElementById(    
            "generateQuizBtn"    
        );    
    
    if (oldQuizButton) {    
        return;    
    }    
    
    // Create button    
    const quizButton =    
        document.createElement("button");    
    
    quizButton.id =    
        "generateQuizBtn";    
    
    quizButton.type =    
        "button";    
    
    quizButton.textContent =    
        "📝 Generate AI Quiz";    
    
    // Button style    
    quizButton.style.cssText = `    
        display:block;    
        width:100%;    
        margin-top:15px;    
        margin-bottom:15px;    
        padding:14px;    
        border:2px solid #00eaff;    
        border-radius:12px;    
        background:#031522;    
        color:#00eaff;    
        font-size:16px;    
        font-weight:bold;    
        cursor:pointer;    
        box-shadow:0 0 15px rgba(0,234,255,.6);    
    `;    
    
    quizButton.addEventListener(    
    "click",    
    generateQuiz    
);    
    
    // Add button after question input    
    questionInput.insertAdjacentElement(    
        "afterend",    
        quizButton    
    );    
    
}    
    
    
// ========================================    
// CREATE BUTTON IMMEDIATELY    
// ========================================    
    
createQuizButton();    
    
    
// ========================================    
// PART 6A STATUS    
// ========================================    
    
console.log(    
    "HoloVision AI - Part 6A loaded successfully."    
);    
    
// ========================================    
// HOLOVISION AI    
// PART 6B - REAL AI QUIZ GENERATOR    
// ========================================    
    
    
async function generateQuiz() {    
    
    if (!questionInput || !answerBox) {    
        return;    
    }    
    
    
    const topic =    
        questionInput.value.trim();    
    
    
    if (!topic) {    
    
        alert(    
            "Please enter a topic first."    
        );    
    
        return;    
    
    }    
    
    
    // ====================================    
    // LOADING MESSAGE    
    // ====================================    
    
    answerBox.innerHTML = `    
    
        <div class="ai-message">    
    
            <strong>    
                HoloVision AI Quiz    
            </strong>    
    
            <br><br>    
    
            Creating your quiz...    
    
        </div>    
    
    `;    
    
    
    try {    
       
       
   // ========================================    
// PART 7A - INTERACTIVE QUIZ JSON FORMAT    
// ========================================    
    
    
// Replace the old quiz prompt with this    
    
const prompt = `    
    
You are HoloVision AI Quiz Generator.    
    
Create an interactive quiz about:    
    
${topic}    
    
Generate exactly 5 multiple choice questions.    
    
Return ONLY valid JSON.    
    
Use this exact format:    
    
[    
    {    
        "question": "Question text",    
        "options": [    
            "Option A",    
            "Option B",    
            "Option C",    
            "Option D"    
        ],    
        "answer": "Option A"    
    }    
]    
    
Rules:    
    
- Generate exactly 5 questions.    
- Each question must have exactly 4 options.    
- The correct answer must exactly match one option.    
- Return only JSON.    
- Do not use markdown.    
- Do not add explanations.    
- Do not add extra text before or after JSON.    
    
IMPORTANT:    
    
Your response must start with [    
    
Your response must end with ]    
    
Do not write:    
    
- Welcome message    
- Quiz title    
- Explanation    
- Markdown  code blocks    
- Correct Answer outside JSON    
- Any text before JSON    
- Any text after JSON    
    
Return ONLY the JSON array.    
    
Topic:    
    
${topic}    
    
`;    
            
    
        // ====================================    
        // GENERATE QUIZ    
        // ====================================    
    
        const result =    
            await model.generateContent(    
                prompt    
            );    
    
    
        const response =    
            result.response;    
    
    
        const quiz =    
            response.text();    
                
                
  // ====================================    
// CLEAN AI RESPONSE    
// ====================================    
    
let quizData;    
    
try {    
    
    // Remove markdown code blocks    
    const cleanQuiz =    
        quiz    
            .replace(/```json/gi, "")    
            .replace(/```/g, "")    
            .trim();    
    
    // Convert AI response to JSON    
    quizData =    
        JSON.parse(cleanQuiz);    
    
    
    // Check quiz data    
    if (    
        !Array.isArray(quizData) ||    
        quizData.length === 0    
    ) {    
    
        throw new Error(    
            "Invalid quiz data"    
        );    
    
    }    
    
    
} catch (error) {    
    
    console.error(    
        "Quiz JSON Error:",    
        error    
    );    
    
    
    answerBox.innerHTML = `    
    
        <div class="ai-message">    
    
            <strong>    
                Quiz Generation Error    
            </strong>    
    
            <br><br>    
    
            AI returned an invalid quiz format.    
    
            <br><br>    
    
            Please click Generate AI Quiz again.    
    
        </div>    
    
    `;    
    
    return;    
    
}    
    
    
// ====================================    
// SAVE QUIZ DATA    
// ====================================    
    
window.currentQuizData =    
    quizData;    
    
    // ====================================    
// SAVE QUIZ DATA    
// ====================================    
    
window.currentQuizData =    
    quizData;    
    
    
            
    
        // ====================================    
// BUILD INTERACTIVE QUIZ    
// ====================================    
    
let quizHTML = `    
    
    <div class="ai-message quiz-container">    
    
        <h2>    
            📝 HoloVision AI Quiz    
        </h2>    
    
    
        <!-- QUIZ PROGRESS -->    
    
        <div class="quiz-progress-container">    
    
            <div    
                id="quizProgressText"    
            >    
                Quiz Progress: 0 / ${quizData.length}    
            </div>    
    
    
            <div class="progress-bar">    
    
                <div    
                    id="quizProgressFill"    
                    class="progress-fill"    
                ></div>    
    
            </div>    
    
        </div>    
            
        <div    
    id="quizTimer"    
>    
    ⏱️ Time Left: 05:00    
</div>    
    
    
<button    
    id="startQuizBtn"    
    type="button"    
>    
    ▶ Start Quiz    
</button>    
    
        <p>    
    
            <strong>Topic:</strong>    
    
            ${escapeHTML(topic)}    
    
        </p>    
    
`;    
// ====================================    
// CREATE QUESTIONS    
// ====================================    
    
quizData.forEach(    
    function (item, questionIndex) {    
    
        quizHTML += `    
    
            <div    
                class="quiz-question"    
            >    
    
                <h3>    
                    Question ${questionIndex + 1}    
                </h3>    
    
                <p>    
                    ${escapeHTML(    
                        item.question    
                    )}    
                </p>    
    
        `;    
    
    
        // ====================================    
        // CREATE OPTIONS    
        // ====================================    
    
        item.options.forEach(    
            function (    
                option,    
                optionIndex    
            ) {    
    
                const optionLetter =    
                    String.fromCharCode(    
                        65 + optionIndex    
                    );    
    
    
                quizHTML += `    
    
                    <label    
                        class="quiz-option"    
                        style="    
                            display:flex;    
                            align-items:center;    
                            gap:8px;    
                            cursor:pointer;    
                            margin:12px 0;    
                        "    
                    >    
    
                        <input    
                            type="radio"    
                            name="question-${questionIndex}"    
                            value="${escapeHTML(option)}"    
                            style="display:none;"    
                        >    
    
    
                        <span    
                            class="custom-radio"    
                            style="    
                                width:18px;    
                                height:18px;    
                                border:2px solid white;    
                                border-radius:50%;    
                                display:inline-block;    
                                flex-shrink:0;    
                                background:transparent;    
                                box-sizing:border-box;    
                            "    
                        ></span>    
    
    
                        <strong>    
                            ${optionLetter}.    
                        </strong>    
    
                        ${escapeHTML(option)}    
    
                    </label>    
    
                `;    
    
            }    
        );    
    
    
        quizHTML += `    
    
            </div>    
    
        `;    
    
    }    
);    
    
    
// ====================================    
// SUBMIT BUTTON    
// ====================================    
    
quizHTML += `    
    
        <button    
            id="submitQuizBtn"    
            type="button"    
        >    
    
            Submit Quiz    
    
        </button>    
    
    
        <div    
            id="quizScore"    
        ></div>    
    
    
    </div>    
    
`;    
    
    
// ====================================    
// DISPLAY QUIZ    
// ====================================    
    
answerBox.innerHTML =    
    quizHTML;    
    
// ====================================    
// QUIZ COUNTDOWN TIMER    
// ====================================    
    
let quizSeconds = 300;    
    
let quizTimerInterval = null;    
    
let quizStarted = false;    
    
    
const quizTimer =    
    document.getElementById(    
        "quizTimer"    
    );    
    
    
const startQuizBtn =    
    document.getElementById(    
        "startQuizBtn"    
    );    
    
    // ====================================    
// START QUIZ    
// ====================================    
    
startQuizBtn.addEventListener(    
    "click",    
    function () {    
    
        quizStarted = true;    
    
        startQuizBtn.disabled =    
            true;    
    
        startQuizBtn.style.opacity =    
            "0.6";    
    
        startQuizBtn.textContent =    
            "Quiz Started";    
    
    
        quizTimerInterval =    
            setInterval(    
                function () {    
    
                    quizSeconds--;    
    
    
                    const minutes =    
                        Math.floor(    
                            quizSeconds / 60    
                        );    
    
    
                    const seconds =    
                        quizSeconds % 60;    
    
    
                    const formattedMinutes =    
                        String(minutes)    
                        .padStart(2, "0");    
    
    
                    const formattedSeconds =    
                        String(seconds)    
                        .padStart(2, "0");    
    
    
                    quizTimer.textContent =    
                        `⏱️ Time Left: ${formattedMinutes}:${formattedSeconds}`;    
    
    
                    // TIME UP    
    
                    if (    
                        quizSeconds <= 0    
                    ) {    
    
                        clearInterval(    
                            quizTimerInterval    
                        );    
    
    
                        quizTimer.textContent =    
                            "⏰ Time's Up!";    
    
    
                        alert(    
                            "⏰ Time is up! Your quiz will be submitted automatically."    
                        );    
    
    
                        document    
                            .getElementById(    
                                "submitQuizBtn"    
                            )    
                            .click();    
    
                    }    
    
                },    
                1000    
            );    
    
    }    
);    
// ====================================    
// SHOW BLUE WHEN OPTION SELECTED    
// ====================================    
    
const quizRadios =    
    answerBox.querySelectorAll(    
        'input[type="radio"]'    
    );    
    
    
quizRadios.forEach(    
    function (radio) {    
    
        radio.addEventListener(    
            "change",    
            function () {    
    
                const questionName =    
                    this.name;    
    
    
                // Reset all circles in same question    
                document    
                    .querySelectorAll(    
                        `input[name="${questionName}"]`    
                    )    
                    .forEach(    
                        function (option) {    
    
                            const circle =    
                                option.nextElementSibling;    
    
    
                            circle.style.setProperty(    
                                "background",    
                                "transparent",    
                                "important"    
                            );    
    
    
                            circle.style.setProperty(    
                                "border-color",    
                                "white",    
                                "important"    
                            );    
    
                        }    
                    );    
    
    
                // Selected circle → BLUE    
                const selectedCircle =    
                    this.nextElementSibling;    
    
    
                selectedCircle.style.setProperty(    
                    "background",    
                    "#00eaff",    
                    "important"    
                );    
    
    
                selectedCircle.style.setProperty(    
                    "border-color",    
                    "#00eaff",    
                    "important"    
                );    
                    
                    
                // ====================================    
        // UPDATE QUIZ PROGRESS    
        // ====================================    
            
                    
                const answeredQuestions =    
    new Set(    
        Array.from(quizRadios)    
            .filter(    
                radio => radio.checked    
            )    
            .map(    
                radio => radio.name    
            )    
    ).size;    
    
    
const totalQuestions =    
    quizData.length;    
    
    
const percentage =    
    (answeredQuestions / totalQuestions) * 100;    
    
    
const quizProgressText =    
    document.getElementById(    
        "quizProgressText"    
    );    
    
    
const quizProgressFill =    
    document.getElementById(    
        "quizProgressFill"    
    );    
    
    
quizProgressText.textContent =    
    `Quiz Progress: ${answeredQuestions} / ${totalQuestions}`;    
    
    
quizProgressFill.style.width =    
    `${percentage}%`;    
    
            }    
        );    
    
    }    
);    
    
    
// ====================================    
// QUIZ SUBMIT    
// ====================================    
    
const submitQuizBtn =    
    document.getElementById(    
        "submitQuizBtn"    
    );    
    
    
submitQuizBtn.addEventListener(    
    "click",    
    function () {    
    	    
        
        
    // ====================================    
// CHECK ALL QUESTIONS ANSWERED    
// ====================================    
    
let answeredCount = 0;    
    
    
quizData.forEach(    
    function (item, questionIndex) {    
    
        const selectedOption =    
            document.querySelector(    
                `input[name="question-${questionIndex}"]:checked`    
            );    
    
    
        if (selectedOption) {    
    
            answeredCount++;    
    
        }    
    
    }    
);    
    
    
// If not all questions answered    
    
if (    
    answeredCount <    
    quizData.length    
) {    
    
    alert(    
        `⚠️ Please answer all ${quizData.length} questions before submitting!`    
    );    
    
    return;    
    
}    
    
    
        let score = 0;    
    
    
        quizData.forEach(    
            function (    
                item,    
                questionIndex    
            ) {    
    
                // ====================================    
                // GET SELECTED OPTION    
                // ====================================    
    
                const selectedOption =    
                    document.querySelector(    
                        `input[name="question-${questionIndex}"]:checked`    
                    );    
// ====================================    
                // GET ALL OPTIONS    
                // ====================================    
    
                const allOptions =    
                    document.querySelectorAll(    
                        `input[name="question-${questionIndex}"]`    
                    );    
    
    
                // ====================================    
                // FIND CORRECT OPTION    
                // ====================================    
    
                let correctOption =    
                    null;    
    
    
                const aiAnswer =    
                    String(    
                        item.answer    
                    )    
                    .trim()    
                    .toLowerCase();    
    
    
                allOptions.forEach(    
                    function (    
                        option,    
                        optionIndex    
                    ) {    
    
                        const optionValue =    
                            option.value    
                            .trim()    
                            .toLowerCase();    
    
    
                        const letter =    
                            String.fromCharCode(    
                                65 + optionIndex    
                            )    
                            .toLowerCase();    
    
    
                        // Exact match    
                        if (    
                            aiAnswer ===    
                            optionValue    
                        ) {    
    
                            correctOption =    
                                option;    
    
                        }    
    
    
                        // Match A / B / C / D    
                        else if (    
                            aiAnswer ===    
                            letter    
                        ) {    
    
                            correctOption =    
                                option;    
    
                        }    
    
    
                        // Match Option A    
                        else if (    
                            aiAnswer ===    
                            "option " + letter    
                        ) {    
    
                            correctOption =    
                                option;    
    
                        }    
    
    
                        // Match A. Answer    
                        else if (    
                            aiAnswer.startsWith(    
                                letter + "."    
                            )    
                        ) {    
    
                            correctOption =    
                                option;    
    
                        }    
    
                    }    
                );    
    
    
                // ====================================    
                // COLOR ALL CIRCLES    
                // ====================================    
    
                allOptions.forEach(    
                    function (option) {    
    
                        const circle =    
                            option.nextElementSibling;    
    
    
                        // Default circle    
                        circle.style.setProperty(    
                            "background",    
                            "transparent",    
                            "important"    
                        );    
    
    
                        circle.style.setProperty(    
                            "border-color",    
                            "white",    
                            "important"    
                        );    
    
    // ====================================    
                        // CORRECT → GREEN    
                        // ====================================    
    
                        if (    
                            option ===    
                            correctOption    
                        ) {    
    
                            circle.style.setProperty(    
                                "background",    
                                "#00ff66",    
                                "important"    
                            );    
    
    
                            circle.style.setProperty(    
                                "border-color",    
                                "#00ff66",    
                                "important"    
                            );    
    
                        }    
    
    
                        // ====================================    
                        // WRONG SELECTED → RED    
                        // ====================================    
    
                        if (    
                            option.checked &&    
                            option !==    
                            correctOption    
                        ) {    
    
                            circle.style.setProperty(    
                                "background",    
                                "#ff0000",    
                                "important"    
                            );    
    
    
                            circle.style.setProperty(    
                                "border-color",    
                                "#ff0000",    
                                "important"    
                            );    
    
                        }    
    
    
                        // Disable after submit    
                        option.disabled =    
                            true;    
    
                    }    
                );    
    
    
                // ====================================    
                // CALCULATE SCORE    
                // ====================================    
    
                if (    
                    selectedOption ===    
                    correctOption    
                ) {    
    
                    score++;    
    
                }    
    
            }    
        );    
    
    
clearInterval(    
    quizTimerInterval    
);    
    
    
    
// ====================================    
// SAVE QUIZ HISTORY    
// ====================================    
    
const currentScore =    
    score;    
    
    
const currentPercentage =    
    Math.round(    
        (score / quizData.length) * 100    
    );    
    
    
// Get old quiz history    
    
let quizHistory =    
    JSON.parse(    
        localStorage.getItem(    
            "holoVisionQuizHistory"    
        )    
    ) || [];    
    
    
// Add current quiz    
    
quizHistory.push({    
    
    topic: topic,    
    
    score: currentScore,    
    
    total: quizData.length,    
    
    percentage: currentPercentage,    
    
    date: new Date().toLocaleString()    
    
});    
    
    
// Keep only last 5 quizzes    
    
if (    
    quizHistory.length > 5    
) {    
    
    quizHistory =    
        quizHistory.slice(-5);    
    
}    
    
    
// Save history    
    
localStorage.setItem(    
    "holoVisionQuizHistory",    
    JSON.stringify(quizHistory)    
);    
    
    
// ====================================    
// FIND BEST SCORE    
// ====================================    
    
const bestQuiz =    
    quizHistory.reduce(    
        function (    
            best,    
            current    
        ) {    
    
            if (    
                current.percentage >    
                best.percentage    
            ) {    
    
                return current;    
    
            }    
    
            return best;    
    
        }    
    );    
    
    
const bestScore =    
    `${bestQuiz.score} / ${bestQuiz.total}`;    
    
const bestPercentage =    
    bestQuiz.percentage;    
        
        
        // ====================================    
        // SHOW SCORE    
        // ====================================    
    
        const quizScore =    
            document.getElementById(    
                "quizScore"    
            );    
    
    
        const percentage =    
    Math.round(    
        (score / quizData.length) * 100    
    );    
    
    
let performanceMessage = "";    
let performanceEmoji = "";    
    
    
if (percentage === 100) {    
    
    performanceMessage =    
        "Excellent! Perfect Score!";    
    
    performanceEmoji =    
        "🏆";    
    
}    
    
else if (percentage >= 80) {    
    
    performanceMessage =    
        "Very Good! Keep it up!";    
    
    performanceEmoji =    
        "🎉";    
    
}    
    
else if (percentage >= 60) {    
    
    performanceMessage =    
        "Good Job! Keep Practicing!";    
    
    performanceEmoji =    
        "👍";    
    
}    
    
else {    
    
    performanceMessage =    
        "Keep Practicing! You Can Improve!";    
    
    performanceEmoji =    
        "💪";    
    
}    
    
    
quizScore.innerHTML = `    
    
    <br>    
    
    <div class="quiz-result">    
    
        <h2>    
            🎉 Quiz Completed!    
        </h2>    
    
        <h3>    
            Your Score: ${score} / ${quizData.length}    
        </h3>    
    
        <h3>    
            Score Percentage: ${percentage}%    
        </h3>    
    
        <h3>    
            🏆 Best Score: ${bestScore}    
        </h3>    
    
        <p>    
            Best Percentage: ${bestPercentage}%    
        </p>    
    
        <button    
            id="newQuizBtn"    
            type="button"    
        >    
            🔄 Generate New Quiz    
        </button>    
    
    </div>    
    
`;    
const newQuizBtn =    
    document.getElementById(    
        "newQuizBtn"    
    );    
    
    
newQuizBtn.addEventListener(    
    "click",    
    function () {    
    
        // Enable quiz generation again    
        questionInput.value =    
            topic;    
    
    
        // Scroll to question input    
        questionInput.scrollIntoView({    
            behavior: "smooth"    
        });    
    
    
        // Generate a new quiz    
        generateQuiz();    
    
    }    
);    
    
        // ====================================    
        // DISABLE SUBMIT BUTTON    
        // ====================================    
    
        submitQuizBtn.disabled =    
            true;    
    
    
        submitQuizBtn.style.opacity =    
            "0.6";    
    
    
        submitQuizBtn.textContent =    
            "Quiz Submitted";    
    
    
        quizScore.scrollIntoView({    
            behavior: "smooth"    
        });    
    
    }    
);    
// ====================================    
// PART 7C STATUS    
// ====================================    
    
console.log(    
    "Interactive Quiz Display Created"    
);    
    
    
// ====================================    
// QUIZ ERROR HANDLING    
// ====================================    
    
} catch (error) {    
    
    console.error(    
        "Quiz Generator Error:",    
        error    
    );    
    
    
    const errorMessage =    
        error.message ||    
        String(error);    
    
    
    // ====================================    
    // QUOTA / RATE LIMIT ERROR    
    // ====================================    
    
    if (    
        errorMessage.includes("429") ||    
        errorMessage.toLowerCase().includes("quota") ||    
        errorMessage.toLowerCase().includes("rate limit")    
    ) {    
    
        answerBox.innerHTML = `    
    
            <div class="ai-message">    
    
                <strong>    
                    ⚠️ AI Request Limit Reached    
                </strong>    
    
                <br><br>    
    
                You have reached the current AI usage limit.    
    
                <br><br>    
    
                Please wait and try again later.    
    
            </div>    
    
        `;    
    
    }    
    
    
    // ====================================    
    // OTHER ERROR    
    // ====================================    
    
    else {    
    
        answerBox.innerHTML = `    
    
            <div class="ai-message">    
    
                <strong>    
                    ⚠️ Quiz Generation Error    
                </strong>    
    
                <br><br>    
    
                Something went wrong.    
    
                <br><br>    
    
                Please try again.    
    
            </div>    
    
        `;    
    
    }    
    
}    
    
    
// ====================================    
// CLOSE generateQuiz FUNCTION    
// ====================================    
    
}    
    
