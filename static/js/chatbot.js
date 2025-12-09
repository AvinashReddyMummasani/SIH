console.log("chatbot.js loaded");

// ✅ Escape safely for onclick buttons
function escapeForButton(text) {
    return text
        .replace(/\\/g, "\\\\")   // escape backslashes
        .replace(/'/g, "\\'")     // escape single quotes
        .replace(/"/g, '\\"')     // escape double quotes
        .replace(/\n/g, " ");     // avoid breaking attribute
}

// ✅ Load Chatbot UI
function loadChatbot() {
    const main = document.getElementById("main-content");

    main.innerHTML = `
        <div class="chatbot-container">
            <div class="chatbot-header">💬 FARMGUIDE Chatbot</div>
            <div id="chatbox"></div>
            <div class="chatbot-input">
                <input id="userInput" type="text" placeholder="Type your question...">
                <button onclick="sendMessage()">Send</button>
                <button onclick="startVoiceInput()">🎙️ Speak</button>
            </div>
        </div>
    `;

    // ✅ Enter key triggers send
    document.getElementById("userInput").addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            sendMessage();
        }
    });
}

// ✅ Send message to Flask backend
window.sendMessage = async function () {
    const input = document.getElementById("userInput");
    const message = input.value.trim();
    if (!message) return;

    const chatbox = document.getElementById("chatbox");

    // Add user bubble
    chatbox.innerHTML += `<div class="message user">${marked.parse(message)}</div>`;
    input.value = "";

    try {
        const response = await fetch("/treatment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message })
        });

        const data = await response.json();

        if (data.success) {
            const safeText = escapeForButton(data.treatment);

            // Bot reply with Markdown + Listen button
            chatbox.innerHTML += `
                <div class="message bot">
                    ${marked.parse(data.treatment)}
                    <button onclick="playVoice('${safeText}')">🔊 Listen</button>
                </div>`;
        } else {
            chatbox.innerHTML += `<div class="message bot error">⚠️ ${data.error || "Unknown error"}</div>`;
        }
    } catch (err) {
        console.error("Error:", err);
        chatbox.innerHTML += `<div class="message bot error">⚠️ Unable to reach server</div>`;
    }

    chatbox.scrollTop = chatbox.scrollHeight;
};

// ✅ Text-to-Speech using Flask `/speak` (Google TTS Telugu)
async function playVoice(text) {
    try {
        const cleanText = text.replace(/\s+/g, " ").trim();

        const res = await fetch("/speak", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: cleanText })
        });

        if (!res.ok) {
            throw new Error("TTS request failed");
        }

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);

        const audio = new Audio(url);
        audio.play();
    } catch (err) {
        console.error("TTS error:", err);
    }
}

// ✅ Telugu Speech-to-Text
window.startVoiceInput = function () {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        alert("Your browser does not support speech recognition.");
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "te-IN"; // Telugu input
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        document.getElementById("userInput").value = transcript;
        sendMessage();
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event);
    };
};





