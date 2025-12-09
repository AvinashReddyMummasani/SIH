function loadNotifications() {
    const main = document.getElementById("main-content");
    main.innerHTML = `
        <h2>Notifications</h2>
        <ul style="list-style:none;padding-left:0;">
            <li style="background:#ffecb3;margin:5px 0;padding:10px;border-radius:8px;">🌾 New subsidy scheme announced!</li>
            <li style="background:#c8e6c9;margin:5px 0;padding:10px;border-radius:8px;">💧 Irrigation advisory: Avoid overwatering today.</li>
            <li style="background:#ffe0b2;margin:5px 0;padding:10px;border-radius:8px;">🛒 Market Alert: Tomato prices increased by 5%.</li>
        </ul>
    `;
}
