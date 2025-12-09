function loadProfile() {
    const main = document.getElementById("main-content");

    // Load saved data from localStorage
    const savedProfile = JSON.parse(localStorage.getItem("farmerProfile")) || {};

    main.innerHTML = `
        <h2>Profile</h2>
        <div style="display:flex;gap:30px;flex-wrap:wrap;">
            <div style="flex:1;min-width:300px;">
                <h3>Edit Profile</h3>
                <form id="profileForm" style="display:flex;flex-direction:column;gap:10px;">
                    <strong>Basic Info:</strong>
                    <input type="text" name="fullname" placeholder="Full Name" value="${savedProfile.fullname || ''}" required>
                    <input type="number" name="age" placeholder="Age" value="${savedProfile.age || ''}" required>
                    <select name="gender">
                        <option value="">Select Gender</option>
                        <option value="Male" ${savedProfile.gender === "Male" ? "selected":""}>Male</option>
                        <option value="Female" ${savedProfile.gender === "Female" ? "selected":""}>Female</option>
                        <option value="Other" ${savedProfile.gender === "Other" ? "selected":""}>Other</option>
                    </select>
                    <input type="text" name="contact" placeholder="Contact Number" value="${savedProfile.contact || ''}" required>
                    <input type="text" name="language" placeholder="Preferred Language" value="${savedProfile.language || ''}">

                    <strong>Farm Details:</strong>
                    <input type="text" name="location" placeholder="Location" value="${savedProfile.location || ''}">
                    <input type="text" name="landSize" placeholder="Land Size (acres)" value="${savedProfile.landSize || ''}">
                    <input type="text" name="soilType" placeholder="Soil Type" value="${savedProfile.soilType || ''}">
                    <input type="text" name="irrigation" placeholder="Irrigation Source" value="${savedProfile.irrigation || ''}">

                    <strong>Crop Details:</strong>
                    <input type="text" name="currentCrop" placeholder="Current Crop" value="${savedProfile.currentCrop || ''}">
                    <input type="text" name="previousCrop" placeholder="Previous Season Crop" value="${savedProfile.previousCrop || ''}">

                    <strong>Inputs & Resources:</strong>
                    <input type="text" name="fertilizer" placeholder="Available Fertilizer" value="${savedProfile.fertilizer || ''}">
                    <input type="text" name="seeds" placeholder="Seed Varieties" value="${savedProfile.seeds || ''}">
                    <input type="text" name="machinery" placeholder="Machinery Owned" value="${savedProfile.machinery || ''}">

                    <button type="submit" style="padding:10px;background:#388e3c;color:white;border:none;border-radius:8px;cursor:pointer;">Save Profile</button>
                </form>
            </div>

            <div style="flex:1;min-width:300px;">
                <h3>Profile Summary</h3>
                <div id="profileSummary" style="background:#f0f0f0;padding:15px;border-radius:10px;">
                    <p>Fill the form to see summary here.</p>
                </div>
            </div>
        </div>
    `;

    // Function to update summary
    function updateSummary(data) {
        const summaryDiv = document.getElementById("profileSummary");
        summaryDiv.innerHTML = `
            <p><strong>Name:</strong> ${data.fullname || "-"}</p>
            <p><strong>Age:</strong> ${data.age || "-"}</p>
            <p><strong>Gender:</strong> ${data.gender || "-"}</p>
            <p><strong>Contact:</strong> ${data.contact || "-"}</p>
            <p><strong>Language:</strong> ${data.language || "-"}</p>
            <hr>
            <p><strong>Location:</strong> ${data.location || "-"}</p>
            <p><strong>Land Size:</strong> ${data.landSize || "-"}</p>
            <p><strong>Soil Type:</strong> ${data.soilType || "-"}</p>
            <p><strong>Irrigation:</strong> ${data.irrigation || "-"}</p>
            <hr>
            <p><strong>Current Crop:</strong> ${data.currentCrop || "-"}</p>
            <p><strong>Previous Crop:</strong> ${data.previousCrop || "-"}</p>
            <hr>
            <p><strong>Fertilizer:</strong> ${data.fertilizer || "-"}</p>
            <p><strong>Seeds:</strong> ${data.seeds || "-"}</p>
            <p><strong>Machinery:</strong> ${data.machinery || "-"}</p>
        `;
    }

    // Load saved summary if available
    if (savedProfile.fullname) updateSummary(savedProfile);

    // Save form
    document.getElementById("profileForm").onsubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        localStorage.setItem("farmerProfile", JSON.stringify(data));
        alert("Profile saved successfully!");
        updateSummary(data);
    };
}
