function loadCropUpload() {
    const main = document.getElementById("main-content");
    main.innerHTML = `
        <h2>Upload Plant Image</h2>
        <input type="file" id="plantImage" accept="image/*" style="margin-bottom:10px;">
        <button id="uploadBtn" style="padding:10px 20px;font-size:1rem;border:none;border-radius:8px;background:#388e3c;color:white;cursor:pointer;">Upload & Detect</button>
        <div id="uploadResult" style="margin-top:20px;"></div>
    `;

    document.getElementById("uploadBtn").onclick = async () => {
        const fileInput = document.getElementById("plantImage");
        const resultDiv = document.getElementById("uploadResult");

        if (!fileInput.files[0]) {
            alert("Please select an image!");
            return;
        }

        const file = fileInput.files[0];
        const formData = new FormData();
        formData.append("image", file);

        // Show loading text
        resultDiv.innerHTML = `<p style="color:gray;">Processing image, please wait...</p>`;

        try {
            // Send image to Flask backend
            const response = await fetch("/predict", {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            // Show uploaded image + prediction
            resultDiv.innerHTML = `
                <h3>Uploaded Image:</h3>
                <img src="${URL.createObjectURL(file)}" style="max-width:300px;border-radius:10px;margin-bottom:10px;">
                <h3>Detected Condition:</h3>
                <p style="font-size:1.2rem;font-weight:bold;color:#d32f2f;">${data.predicted_class}</p>
            `;
        } catch (err) {
            console.error(err);
            resultDiv.innerHTML = `<p style="color:red;">Error detecting disease. Please try again.</p>`;
        }
    };
}

