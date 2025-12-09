const buttons=document.querySelectorAll(".left-bar button");
const mainContent=document.getElementById("main-content");

buttons.forEach(btn=>{
    btn.addEventListener("click",()=>{
        const feature=btn.dataset.feature;
        mainContent.innerHTML=`<h2>${feature}</h2><p>Loading ${feature}...</p>`;
        if(feature==="Weather") loadWeather();
        if(feature==="Chatbot") loadChatbot();
        if(feature==="Upload Image") loadImageUpload();
        if(feature==="Market Prices") loadMarket();
        if(feature==="Notifications") loadNotifications();
    });
});
