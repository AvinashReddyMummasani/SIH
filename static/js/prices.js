function loadMarket() {
    const main=document.getElementById("main-content");
    main.innerHTML=`
        <h2>Market Prices</h2>
        <table style="width:100%;border-collapse:collapse;">
            <tr><th>Crop</th><th>Price per kg (₹)</th></tr>
            <tr><td>Wheat</td><td>220</td></tr>
            <tr><td>Rice</td><td>45</td></tr>
            <tr><td>Tomato</td><td>30</td></tr>
            <tr><td>Potato</td><td>25</td></tr>
        </table>
        <p style="margin-top:10px;color:#555;font-style:italic;">Note: Prices are for demo only.</p>
    `;
}

