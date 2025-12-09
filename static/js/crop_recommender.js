console.log("fertilizer.js loaded");

function loadcrop_recommender() {
    const main = document.getElementById("main-content");
    main.innerHTML = `
        <h2>Fertilizer Recommendation</h2>
        <form id="fertilizerForm">
            <label>Temperature:</label>
            <input type="number" step="0.1" name="temperature" required><br><br>

            <label>Humidity:</label>
            <input type="number" step="0.1" name="humidity" required><br><br>

            <label>Moisture:</label>
            <input type="number" step="0.1" name="moisture" required><br><br>

            <label>Soil Type:</label>
            <input type="text" name="soiltype" required><br><br>

            <label>Crop Type:</label>
            <input type="text" name="croptype" required><br><br>

            <label>Nitrogen:</label>
            <input type="number" step="0.1" name="nitrogen" required><br><br>

            <label>Potassium:</label>
            <input type="number" step="0.1" name="potassium" required><br><br>

            <label>Phosphorus:</label>
            <input type="number" step="0.1" name="phosphorus" required><br><br>

            <button type="submit">Get Recommendation</button>
        </form>
        <div id="fertilizerResult" style="margin-top:20px;"></div>
    `;

    document.getElementById("fertilizerForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const response = await fetch("/find_f", {
        method: "POST",
        body: formData
    });

    const data = await response.json();

    // Log the data to console
    console.log("Flask returned:", data);

    // Display on page
    if (data.recommended_fertilizer) {
        document.getElementById("fertilizerResult").innerText = 
            "Recommended Fertilizer: " + data.recommended_fertilizer;
    } else {
        document.getElementById("fertilizerResult").innerText = 
            "Error: " + (data.error || "No recommendation received");
    }
});
}