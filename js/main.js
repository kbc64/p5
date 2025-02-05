const width = 1080;
const height = 1920;
const half = width / 2;
const titleY = 760; // Başlık Y konumu
const titleSize = 32;

const leftLogoBoxX = 0;
const rightLogoBoxX = half;
const logoBoxY = 380;
const logoBoxWidth = half;
const logoHeigth = 350;

// Takım logoları için değişkenler
let team1Logo, team2Logo;

// Logo konum ve boyutları
const logoY = 230;            // Logo Y konumu
const logoWidth = 250;   // Logo genişliği
const logoHeight = 250;        // Logo yüksekliği


const matchCommentaryBoxY = 0;
const matchCommentaryBoxHeight = 180;
const matchCommentaryBoxTextY = matchCommentaryBoxY + matchCommentaryBoxHeight / 2;

// Orijinal logo kutusu renkleri (örnek)
const logo1Color = { r: 255, g: 0, b: 0, a: 180 };
const logo2Color = { r: 0, g: 0, b: 255, a: 180 };
// Maç yorum kutusu rengi
const originalMatchCommentaryBoxColor = { r: 255, g: 208, b: 0, a: 255 };

let img, futura, logo1;

// Roster alanları için siyah tonlarında arka plan (alfa 150) ve beyaz yazı:
const rosterLeftColor = { r: 0, g: 0, b: 0, a: 150 };
const rosterRightColor = { r: 0, g: 0, b: 0, a: 150 };
const rosterTextColor = { r: 255, g: 255, b: 255, a: 255 };
// Forma numarası (jersey) kutusu için renkler:
const jerseyBoxColor = { r: 80, g: 80, b: 80, a: 255 };
const jerseyTextColor = { r: 255, g: 255, b: 255, a: 255 };

let homeFadeStartTime = null;
let awayFadeStartTime = null;

// Takım isimleri
// Takım isimleri ve skorları
const team1Name = "GALATASARAY";
const team2Name = "FENERBAHÇE";
let team1Score = 0;
let team2Score = 0;


// Örnek oyuncu listeleri (Her takım için 16 oyuncu)
// Not: Dizinin ilk 11 elemanı "İlk 11", geri kalanı "Yedekler" olarak kabul edilecek.
let leftTeamPlayers = [
  { number: 1,  name: "Ali" },
  { number: 2,  name: "Veli" },
  { number: 3,  name: "Hakan" },
  { number: 4,  name: "Hagi" },
  { number: 5,  name: "Arif" },
  { number: 6,  name: "Metin" },
  { number: 7,  name: "Kerem" },
  { number: 8,  name: "Mert" },
  { number: 9,  name: "Onur" },
  { number: 10, name: "Berk" },
  { number: 11, name: "Cem" },
  { number: 12, name: "Emre" },
  { number: 13, name: "Can" },
  { number: 14, name: "Efe" },
  { number: 15, name: "Tayfun" },
  { number: 16, name: "Sarp" }
];

let rightTeamPlayers = [
  { number: 1,  name: "Ahmet" },
  { number: 2,  name: "Mehmet" },
  { number: 3,  name: "Hasan" },
  { number: 4,  name: "Hüseyin" },
  { number: 5,  name: "Mustafa" },
  { number: 6,  name: "Osman" },
  { number: 7,  name: "Faruk" },
  { number: 8,  name: "Sedat" },
  { number: 9,  name: "Semih" },
  { number: 10, name: "Sinan" },
  { number: 11, name: "Kemal" },
  { number: 12, name: "Adem" },
  { number: 13, name: "Celal" },
  { number: 14, name: "Rıza" },
  { number: 15, name: "Fikret" },
  { number: 16, name: "Suat" }
];

// Fade animasyonu parametreleri:

const playerFadeDelay = 200;    // Her oyuncu için gecikme (ms)
const playerFadeDuration = 500; // Her oyuncunun fade-in süresi (ms)
const headingFadeDuration = 500; // Bölüm başlığı fade-in süresi (ms)


function preload() {
  inter = loadFont("fonts/inter/inter.ttf");
  img = loadImage("images/stadyum.png");
  // Takım logolarını yükle
  team1Logo = loadImage("images/gs.png");  // Sol takım logosu
  team2Logo = loadImage("images/fb.png");  // Sağ takım logosu
}
  

let capturer

function setup() {


  capturer = new CCapture( {
    format: 'webm',
    framerate: 60,
    verbose: true,
    quality: 1
} );


  createCanvas(1080, 1920);
  textSize(24);
  textAlign(LEFT, TOP);
  // Ev sahibi (sol takım) animasyon başlangıcını ayarla:

  setTimeout(triggerMatchCommentaryAnimation, 1000);
  setTimeout(triggerRosterAnimation, 2000); // 3 saniye sonra başlatır

}

function draw() {
  
  if (frameCount === 1) {
    console.log('buaradayım')
    capturer.start()
}
    

noStroke(); 

  background("aqua");
  image(img, 0, 0, width, height);

  // Logo kutularını çiz:
  addBox(leftLogoBoxX, logoBoxY, logoBoxWidth, logoHeigth, logo1Color);
  addBox(rightLogoBoxX, logoBoxY, logoBoxWidth, logoHeigth, logo2Color);

  addBox(0, 730, width, 60, { r: 169, g: 169, b: 169, a: 180 })

  image(team1Logo, half/2-logoWidth/2, logoY + 25, logoWidth, logoHeight);  // Sol takım logosu
  image(team2Logo, half+half/2-logoWidth/2, logoY + 25, logoWidth, logoHeight); // Sağ takım logosu

  textFont('futura');
  textSize(44);
  textAlign(CENTER, CENTER);
  fill(255); // Beyaz renk

  let teamNameY = logoY + logoHeight + 50; // Logonun altına konumlandır

  text(team1Name, half / 2, teamNameY+ 25); // Sol takım adı
  text(team2Name, half + half / 2, teamNameY+25); // Sağ takım adı

  textSize(96); // Skorları büyük gösterelim
  text(team1Score, half / 2, teamNameY + 120); // Sol takım skoru
  text(team2Score, half + half / 2, teamNameY + 120); // Sağ takım skoru
  // Başlık:
  addTitle("Türkiye Süper Ligi 2.Hafta (2 Kasım 1984)");
  //addTitle2()
  
  // Maç yorum kutusu (animasyonlu):
  addMatchCommentary();
  
  // Roster alanı: Logo kutusunun altından canvas sonuna kadar
  //
  rosterY = 795
  let rosterHeight = height - rosterY;

  if (homeFadeStartTime !== null) {
    addBox(leftLogoBoxX, rosterY, logoBoxWidth, rosterHeight, rosterLeftColor);
    renderTeamRoster(leftLogoBoxX, rosterY, logoBoxWidth, rosterHeight, leftTeamPlayers, rosterTextColor, homeFadeStartTime);

    addBox(rightLogoBoxX, rosterY, logoBoxWidth, rosterHeight, rosterRightColor);
    renderTeamRoster(rightLogoBoxX, rosterY, logoBoxWidth, rosterHeight, rightTeamPlayers, rosterTextColor, awayFadeStartTime);
  }
  
  
  
  
  var start = frameCount / 100

  if (frameCount < 60 * 15) {
   
    capturer.capture(canvas)
    
} else if (frameCount === 60 * 15) {
    capturer.save()
    capturer.stop()
  

}


}

function addTitle(title) {
  fill(0, 0, 0);
  textSize(titleSize);
  textFont('futura');
  textAlign(CENTER, CENTER);
  text(title, half, titleY);
}

function addTitle2(title) {
  fill(255, 255, 255);
  textSize(titleSize);
  textFont('futura');
  textAlign(CENTER, CENTER);
  text("(2 Haziran 1984)", half, titleY+60);
}




function addMatchCommentary() {
  drawAnimatedMatchCommentaryBox(originalMatchCommentaryBoxColor);
  addMatchCommentaryText("Maça galatasaray başlıyor");
}

function addMatchCommentaryText(t) {
  fill(0, 0, 0);
  textSize(52);
  textFont('futura');
  textAlign(CENTER, CENTER);
  text(t, half, matchCommentaryBoxTextY);
}

// Animasyonlu maç yorum kutusu (önceki örnekten)
let animationStartTime = -1;  
const animationDuration = 2000; 
const toggleInterval = 150;     

function drawAnimatedMatchCommentaryBox(baseColor) {
  let currentColor = baseColor;
  const whiteColor = { r: 255, g: 255, b: 255, a: 255 };

  if (animationStartTime !== -1) {
    let elapsed = millis() - animationStartTime;
    if (elapsed < animationDuration) {
      let phase = floor(elapsed / toggleInterval);
      currentColor = (phase % 2 === 0) ? whiteColor : baseColor;
    } else {
      animationStartTime = -1;
      currentColor = baseColor;
    }
  }
  
  fill(currentColor.r, currentColor.g, currentColor.b, currentColor.a);
  rect(0, matchCommentaryBoxY, width, matchCommentaryBoxHeight);
}

function addBox(x, y, boxWidth, boxHeight, color) {
  fill(color.r, color.g, color.b, color.a);
  rect(x, y, boxWidth, boxHeight);
}

/*  
   renderTeamRoster():
   Belirtilen alanda, takım oyuncularını “İlk 11” ve “Yedekler” olarak iki bölüme ayırır.
   Her bölümde önce başlık (fade‑in animasyonlu) sonra oyuncular fade‑in animasyonu uygulanır.
*/
function renderTeamRoster(x, y, boxWidth, boxHeight, teamPlayers, textColor, fadeStartTime) {
  let starting11 = teamPlayers.slice(0, 11);
  let substitutes = teamPlayers.slice(11);
  
  let currentY = y;
  
  // "İlk 11" başlığını animasyonla çiz (fade başlangıcı: fadeStartTime)
  currentY = renderAnimatedSectionHeading(x, currentY, "İlk 11", fadeStartTime);
  
  // İlk 11 oyuncuları; başlık animasyon süresini ekleyerek başlatıyoruz:
  let startingSectionFadeStartTime = fadeStartTime + headingFadeDuration;
  currentY = renderAnimatedRosterSection(x, currentY, boxWidth, starting11, textColor, startingSectionFadeStartTime);
  
  // Hesapla: İlk 11 bölümü tamamlandığında (son oyuncu başlangıcının zamanı + süresi)
  let starting11TotalDelay = startingSectionFadeStartTime + (starting11.length - 1) * playerFadeDelay + playerFadeDuration;
  
  // "Yedekler" başlığını animasyonla çiz (fade başlangıcı: starting11TotalDelay)
  currentY = renderAnimatedSectionHeading(x, currentY, "Yedekler", starting11TotalDelay);
  
  // Yedek oyuncularını animasyonla çizleyelim:
  let substitutesFadeStartTime = starting11TotalDelay + headingFadeDuration;
  currentY = renderAnimatedRosterSection(x, currentY, boxWidth, substitutes, textColor, substitutesFadeStartTime);
  
  return currentY;
}

/*  
   renderAnimatedSectionHeading():
   Belirtilen (x, y) konumunda, başlık metnini fade‑in animasyonuyla çizer.
   Dönüş değeri, sonraki çizim için y konumunu belirtir.
*/
function renderAnimatedSectionHeading(x, y, headingText, sectionFadeStartTime) {
  let elapsed = millis() - sectionFadeStartTime;
  let alphaValue;
  if (elapsed < 0) {
    alphaValue = 0;
  } else if (elapsed > headingFadeDuration) {
    alphaValue = 255;
  } else {
    alphaValue = map(elapsed, 0, headingFadeDuration, 0, 255);
  }
  const headingHeight = 40;
  fill(255, 255, 255, alphaValue);
  textFont('futura');
  textSize(28);
  textAlign(LEFT, CENTER);
  text(headingText, x + 20, y + headingHeight / 2);
  return y + headingHeight;
}

/*  
   renderAnimatedRosterSection():
   Belirtilen konumdan başlayarak, oyuncu listesindeki her oyuncuyu fade‑in animasyonu ile alt alta çizer.
   Her oyuncu için, forma numarası için sol kısımda bir kutu ve sağında oyuncu adı yer alır.
   Döngü sonunda, çizilen son y konumunu geri döner.
*/

function triggerMatchCommentaryAnimation() {
  animationStartTime = millis();
}

function triggerRosterAnimation() {
  if (homeFadeStartTime === null) {
    homeFadeStartTime = millis();
    awayFadeStartTime = homeFadeStartTime + leftTeamPlayers.length * playerFadeDelay + 2 * headingFadeDuration;
  }
}


function renderAnimatedRosterSection(x, startY, sectionWidth, players, textColor, fadeStartTime) {
  let rowHeight = 60;
  let padding = 10;
  let jerseyBoxWidth = 60;

  textFont('futura');
  textSize(36);

  let currentY = startY + padding + rowHeight / 2;
  for (let i = 0; i < players.length; i++) {
    let player = players[i];

    // Eğer animasyon başlamamışsa, oyuncuyu hiç gösterme!
    if (fadeStartTime === null) {
      continue;
    }

    // Her oyuncu için animasyon gecikmesini hesapla:
    let playerFadeTime = millis() - fadeStartTime - (i * playerFadeDelay);
    let alphaValue;
    if (playerFadeTime < 0) {
      alphaValue = 0; // Animasyon başlamadan önce tamamen görünmez
    } else if (playerFadeTime > playerFadeDuration) {
      alphaValue = 255;
    } else {
      alphaValue = map(playerFadeTime, 0, playerFadeDuration, 0, 255);
    }

    // Forma numarası kutusunu çiz:
    let jerseyX = x + padding;
    let jerseyY = currentY - rowHeight / 2;
    fill(jerseyBoxColor.r, jerseyBoxColor.g, jerseyBoxColor.b, alphaValue);
    rect(jerseyX, jerseyY, jerseyBoxWidth, rowHeight);

    // Forma numarasını kutu içinde göster:
    push();
    textAlign(CENTER, CENTER);
    fill(jerseyTextColor.r, jerseyTextColor.g, jerseyTextColor.b, alphaValue);
    text(player.number, jerseyX + jerseyBoxWidth / 2, jerseyY + rowHeight / 2);
    pop();

    // Oyuncu adını yazdır:
    fill(textColor.r, textColor.g, textColor.b, alphaValue);
    textAlign(LEFT, CENTER);
    let nameX = jerseyX + jerseyBoxWidth + 10;
    text(player.name, nameX, currentY);

    currentY += rowHeight;
  }
  return currentY;
}