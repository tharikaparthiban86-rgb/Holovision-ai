import { getAI, getGenerativeModel, GoogleAIBackend }
from "https://www.gstatic.com/firebasejs/12.17.0/firebase-ai.js";

import { app } from "./firebase-config.js";

const ai = getAI(app, {
    backend: new GoogleAIBackend()
});

const model = getGenerativeModel(ai, {
    model: "gemini-3.6-flash"
});

export { model };
