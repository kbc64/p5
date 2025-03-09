let DATA = null;
let canvas, ctx;
let globalFont = new FontFace("Roboto", "url(fonts/Roboto-Regular.ttf)");

// 🎯 **Roboto fontunu yükleyip global hale getiriyoruz**
async function loadGlobalFont() {
    await globalFont.load();
    document.fonts.add(globalFont);
    console.log("✅ Roboto fontu yüklendi!");
}

async function loadMatchData() {
    try {
        const response = await fetch("json/mac.json"); // 📂 JSON'u oku
        if (!response.ok) throw new Error("JSON yüklenemedi!");
        
        const data = await response.json(); // 📦 JSON'u parse et
        return data;
    } catch (error) {
        console.error("❌ Hata:", error);
    }
}

loadGlobalFont().then(() => {
    loadMatchData().then(data => {
        if (data) {
            DATA = data;
            run();
        }
    });
});

function run() {
    createCanvas();
    addBackgroundImage();
}

function createCanvas() {
    canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1920;
    document.body.appendChild(canvas);

    ctx = canvas.getContext("2d");

  
    
}

function addBackgroundImage() {
    if (!DATA || !DATA['info'] || !DATA['info']['bgImage']) {
        console.error("❌ Arkaplan resmi bulunamadı!");
        return;
    }

    const bgImage = new Image();
    bgImage.src = DATA['info']['bgImage'];

    bgImage.onload = () => {
        ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
        console.log("✅ Arkaplan resmi eklendi!");

        // 📝 **Resim yüklendikten sonra tarih kutusunu ekle**
        addDate();
    };

    bgImage.onerror = () => {
        console.error("❌ Arkaplan resmi yüklenirken hata oluştu!");
    };
}

function addDate() {
    if (!ctx || !canvas) {
        console.error("❌ Canvas oluşturulmamış!");
        return;
    }

    // 📌 **Arka plan dikdörtgenini çiz**
    let alpha = MATCH_DATE_BOX_COLOR.a / 255; // 0-255 değerini 0-1 aralığına çeviriyoruz
    ctx.fillStyle = `rgba(${MATCH_DATE_BOX_COLOR.r}, ${MATCH_DATE_BOX_COLOR.g}, ${MATCH_DATE_BOX_COLOR.b}, ${alpha})`;
    ctx.fillRect(MATCH_DATE_BOX_X, MATCH_DATE_BOX_Y, MATCH_DATE_BOX_WIDTH, MATCH_DATE_BOX_HEIGHT);

    // 📌 **Metni çiz**
    ctx.font = "40px Roboto";
    ctx.fillStyle = "white"; // Yazı rengi
    ctx.textAlign = "center";
   
    let textMetrics = ctx.measureText("Lorem Ipsum");
    let textHeight = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent;

    // 📌 Metni kutunun ortasına al (Yatay ve Dikey Ortalamalı)
    let textX = MATCH_DATE_BOX_WIDTH / 2; // X ekseninde ortada
    let textY = MATCH_DATE_BOX_Y + (MATCH_DATE_BOX_HEIGHT / 2) + (textHeight / 2); // Y ekseninde ortada

    ctx.fillText("Lorem Ipsum", textX, textY);
}
