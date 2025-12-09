from flask import Flask, request, jsonify, render_template,send_file
import numpy as np
import cv2
import tensorflow as tf
from dotenv import load_dotenv
import os, requests
import pickle
from gtts import gTTS
import uuid

load_dotenv()

OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")
GOOGLE_AI_KEY = os.getenv("GOOGLE_AI_KEY")
IMAGE_API_KEY = os.getenv("IMAGE_API_KEY")

app = Flask(__name__)

#diesease list
disease={0:"bactierial spot",
         1:"early blight",
         2:"healthy",
         3:"late blight",
         4:"leaf mold",
         5:"septoria leaf spot",
         6:"spider mites",
         7:"target spot",
         8:"tomato mosacic virus",
         9:"tomato yellow leaf curl virus"
         }

#home page
@app.route('/')
def home():
    return render_template("landing.html")

#related html pages connection
@app.route('/login.html')
def login():
    return render_template("login.html")

@app.route('/signup.html')
def signup():
    return render_template("signup.html")

@app.route('/index.html')
def index():
    return render_template("index.html")

model = tf.keras.models.load_model("plant_disease_model.h5")

#predicts disease
@app.route('/predict', methods=['POST'])
def predict():
    uploaded_file = request.files['image']
    file_bytes = np.frombuffer(uploaded_file.read(), np.uint8)
    img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR) 
    img = cv2.resize(img, (256,256))   
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)  
    img = img.astype("float32") / 255.0  
    
    img = np.expand_dims(img, axis=0)

    #model prediction
    preds = model.predict(img)
    predicted_class = np.argmax(preds, axis=1)[0] #predicted disease index
    
    return jsonify({
        "predicted_class": disease[int(predicted_class)],
        "raw_output": preds.tolist()
    })

#recommend fertillizer
fertilizer=['10-26-26', '14-35-14', '17-17-17', '20-20', '28-28', 'DAP', 'Urea']
with open("fertilizer recommender.pkl", "rb") as f:
    model_f=pickle.load(f)
with open("ohe (2).pkl", "rb") as f:
    ohe=pickle.load(f)
with open("sds.pkl", "rb") as f:
    sds=pickle.load(f)
@app.route('/find_f', methods=['POST'])
def find_f():
    try:
        temperature = request.form.get("temperature")
        humidity = request.form.get("humidity")
        moisture = request.form.get("moisture")
        soiltype = request.form.get("soiltype")
        croptype = request.form.get("croptype")
        nitrogen = request.form.get("nitrogen")
        potassium = request.form.get("potassium")
        phosphorus = request.form.get("phosphorus")

        # One-hot encode soil + crop
        sc = ohe.transform([[soiltype, croptype]])
        if isinstance(sc, np.ndarray) is False:
            sc = sc.toarray()   # In case it's sparse

        # Numeric values
        sc2 = np.array([
            float(temperature), float(humidity), float(moisture),
            float(nitrogen), float(potassium), float(phosphorus)
        ]).reshape(1, -1)

        # Combine
        sc = np.hstack((sc, sc2))   # safer than concatenate
        sc = sds.transform(sc)

        # Predict
        fert = model_f.predict(sc)[0]
        #print("fertilizer",fertilizer[int(fert)])
        return jsonify({"recommended_fertilizer": fertilizer[int(fert)]})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Your Ollama server config
OLLAMA_SERVER_IP = "10.204.200.177"
OLLAMA_SERVER_URL = f"http://{OLLAMA_SERVER_IP}:5000"

@app.route("/treatment", methods=["POST"])
def get_treatment():
    data = request.get_json()
    message = data.get("message", "").strip()

    # Handle exit here if needed
    if message.lower() == "exit":
        return jsonify({"success": True, "treatment": "Chat closed. Goodbye!"})

    try:
        # Send to Ollama server
        response = requests.post(f"{OLLAMA_SERVER_URL}/treatment", json={"message": message}, timeout=30)

        if response.status_code == 200:
            ollama_data = response.json()
            if ollama_data.get("success"):
                return jsonify({"success": True, "treatment": ollama_data["treatment"]})
            else:
                return jsonify({"success": False, "error": ollama_data.get("error", "Unknown error")})
        else:
            return jsonify({"success": False, "error": f"HTTP {response.status_code}: {response.text}"})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

#makes available to all devices through LAN

#speaker text

@app.route("/speak", methods=["POST"])
def speak():
    try:
        data = request.get_json()
        text = data.get("text", "")
        if not text.strip():
            return jsonify({"error": "Empty text"}), 400

        # Generate unique filename inside /tmp or static folder
        filename = f"tts_{uuid.uuid4().hex}.mp3"
        filepath = os.path.join("static", filename)

        # Create static folder if missing
        os.makedirs("static", exist_ok=True)

        # Generate TTS audio
        tts = gTTS(text=text, lang="te")  # Telugu output
        tts.save(filepath)

        # ✅ Return file with absolute path
        return send_file(os.path.abspath(filepath), mimetype="audio/mpeg")

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
