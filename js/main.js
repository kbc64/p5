p5.disableFriendlyErrors = true;

isRecord = false;


let goalTimes = []; // Her gol anının millis() değeri burada tutulacak
let whistleTimes = [];    // Düdük anları için zamanlar

const WHISTLE_MESSAGES = [
  "Maç Başladı!",
  "İlk Yarı Bitti!",
  "İkinci Yarı Başladı!",
  "Maç Bitti!"
];

let MAC_INFO;
let colors;
let currenAnimsationIndex = 1;
let lastChangeTime = 0;
let interval = 80; // 100ms'de bir renk değiştir (Hızlı yanıp sönme efekti)
let animationDuration = 800; // Toplam 2 saniye boyunca devam edecek
let animationStartTime = null;
let animating = false;
let startTime = null
let byPass = false
let isAppendAction = true
let isSquadAnimation = false

//const ANIMATION_DURATION = 6000;
let mySound;

let team1Logo, team2Logo;
let homeScore = 0
let awayScore = 0
let INITIAL_DELAY = 1000;
const squadDelay = 3000;
const goalAnimation = 1500;
let counter = 0;


let isDC = false
let videoTime = null;

const actions = []


let startFrameTime;


let soundStarted = false;



const remoteServer = 'http://192.168.1.103:8000';
// const remoteServer = 'http://127.0.0.1:8000';


let homePlayers = null;
let awayPlayers = null;
let homeCoach = "";
let awayCoach = "";
let homeSubstitutes = [];
let awaySubstitutes = [];
let playerPositions = {};


let isSquadAnimating = false; // Animasyonun aktif olup olmadığını belirtir
let isSquadOnTheScreen = false;
let isActionBox = false

function preload() {

  MAC_INFO = loadJSON('./json/mac.json', ()=>{
    team1Logo = loadImage(remoteServer + MAC_INFO['info']['homeLogo']);
    team2Logo = loadImage(remoteServer + MAC_INFO['info']['awayLogo']);
    backgroundImage = loadImage(remoteServer + MAC_INFO['info']['bgImage']);

  });
  
  ballImage = loadImage("../images/assets/ball.png");
  missPenalty = loadImage("../images/assets/miss.png");
  yellowImage = loadImage("../images/assets/yellow.png");
  redImage = loadImage("../images/assets/red.png");
  yellowRedImage = loadImage("../images/assets/yellow_red.png");
  enterImage = loadImage("../images/assets/enter.png");
  exitImage = loadImage("../images/assets/exit.png");
  logoImg = loadImage("../images/assets/logo.png");
  
  
 
  roboto = loadFont('fonts/Roboto-Regular.ttf');

    sound = loadSound('../images/finish.mp3'); // Ses dosyasını yükle



}



const capturer = new CCapture({
  format: 'webm',
  framerate: 60,
  verbose: true
})

function setup() {

  let canvas = createCanvas(WIDTH, HEIGTH);
  videoTime = MAC_INFO['videoDuration']
  let canvasElement = document.getElementById('defaultCanvas0'); // p5.js'in varsayılan canvas ID'si
  const ctx = canvasElement.getContext('2d', { willReadFrequently: true });

  frameRate(60); // FPS'i 60 olarak sınırla
  pixelDensity(1); // beyaz patlamayı engeller


  if (isRecord) {
    capturer.start();
  }
  
  homePlayers = MAC_INFO['homePlayers']
  awayPlayers = MAC_INFO['awayPlayers']
  homeCoach = MAC_INFO['info']['homeCoach'];
  awayCoach = MAC_INFO['info']['awayCoach'];
  homeSubstitutes = MAC_INFO['homeSubstitutes'];
  awaySubstitutes = MAC_INFO['awaySubstitutes'];
  

  Settings()
  textFont(roboto); // Varsayılan font olarak ayarla
  starTime = millis()


}





function addBox(x, y, boxWidth, boxHeight, color) {
  fill(color.r, color.g, color.b, color.a);
  rect(x, y, boxWidth, boxHeight);
}



function draw() {
  noStroke();
  background(backgroundImage);
  addMatchDate(MATCH_DATE_BOX_X, MATCH_DATE_BOX_Y, MATCH_DATE_BOX_WIDTH, MATCH_DATE_BOX_HEIGHT, MATCH_DATE_BOX_COLOR);
  addGuzelLogo()

 

  if(!isRecord) {
    let elapsedTime = millis() - starTime;

      if (elapsedTime >= 1000) {
        counter++;
        starTime = millis();
      }

      fill(0);
      textSize(32);
      textAlign(LEFT, TOP);
      text(counter, 10, 10);
    }


   

  addBox(LOGO_HOME_BOX_X, LOGO_BOX_Y, LOGO_BOX_WIDTH, LOGO_BOX_HEIGHT, {'r':0, 'g':0, 'b':0, a:TOP_MIDDLE_ALPHA});
  addBox(LOGO_AWAY_BOX_X, LOGO_BOX_Y, LOGO_BOX_WIDTH, LOGO_BOX_HEIGHT, {'r':0, 'g':0, 'b':0, a:TOP_MIDDLE_ALPHA});

  addBox(LOGO_HOME_BOX_X, LOGO_BOX_Y, LOGO_BOX_WIDTH, 25, MATCH_COMMENTARY_HOME_COLOR);
  addBox(LOGO_AWAY_BOX_X, LOGO_BOX_Y, LOGO_BOX_WIDTH, 25, MATCH_COMMENTARY_AWAY_COLOR);



  let homeSize = resizeLogo(team1Logo)
  image(team1Logo,  HALF_X/2 - homeSize.width/2, LOGO_IMAGE_Y, homeSize.width, homeSize.height);
  let awaySize = resizeLogo(team2Logo)
  image(team2Logo, HALF_X + HALF_X/2 - awaySize.width/2, LOGO_IMAGE_Y, awaySize.width, awaySize.height);
  addTeamName(MAC_INFO['info']['homeTeam'], HOME_NAME_X, TEAM_NAME_Y, HOME_NAME_COLOR);
  addTeamName(MAC_INFO['info']['awayTeam'], AWAY_NAME_X, TEAM_NAME_Y, AWAY_NAME_COLOR);
  addTeamScore(homeScore, SCORE_HOME_X, SCORE_TEAM_Y, SCORE_HOME_COLOR);
  addTeamScore(awayScore, SCORE_AWAY_X, SCORE_TEAM_Y, SCORE_AWAY_COLOR);
  


  addAction()

  MatchComentaryAnimation()

  

  if (frameCount < 60 * videoTime && isRecord) {

    capturer.capture(canvas)

  } else if (frameCount === 60 * videoTime && isRecord) {
    capturer.save()
    capturer.stop()

    sound.play();


  }

 



}

function addGuzelLogo() {
  const boxHeight = MATCH_DATE_BOX_Y;
  const mTop = 8;

  addBox(0, 0, WIDTH, boxHeight, { r: 0, g: 0, b: 0, a: TOP_MIDDLE_ALPHA });

  const logoHeight = boxHeight * 0.9;
  const logoWidth = (logoImg.width / logoImg.height) * logoHeight;
  const spacing = 3;
  const textContent = 'Güzel Çorba';

  push(); // Tüm ayarlar buradan itibaren lokal tutulur!

    textFont('Arial');
    textSize(28);
    const textWidthVal = textWidth(textContent); // Şimdi doğru çalışır!

    const totalWidth = logoWidth + spacing + textWidthVal;
    const startX = (WIDTH - totalWidth) / 2;
    const logoY = (boxHeight - logoHeight) / 2;
    const opacity = 100;

    tint(255, opacity);
    image(logoImg, startX, logoY + mTop, logoWidth, logoHeight);
    noTint();

    fill(255, opacity);
    noStroke();
    textAlign(LEFT, CENTER);
    text(textContent, startX + logoWidth + spacing, boxHeight / 2 + 5 + mTop);

  pop(); // Tüm stil ayarları burada biter ve global ortam etkilenmez.
}


function addBorder() {
  //addBox(0, MATCH_COMMENTARY_BOX_Y-MATCH_COMMENTARY_BOX_MARGIN_TOP, WIDTH, MATCH_COMMENTARY_BOX_MARGIN_TOP, BORDER_COLOR)
}

function addNotice() {
  if(MAC_INFO['isNumberingSquad']) {
    textSize(34);
    fill(255, 0, 0)
    textAlign(LEFT, CENTER);
    text('* Oyuncu forma numaraları temsilen belirtilmiştir.', 60, 1880)
  }
}

function resizeLogo(image) {
  let aspectRatio = image.width / image.height; // Orijinal en-boy oranı
  let newWidth = LOGO_IMAGE_HEIGHT * aspectRatio; // Yeni genişliği hesapla
  return { width: newWidth, height: LOGO_IMAGE_HEIGHT }; // Yeni boyutları döndür
}


function addAction() {
  let currentHomeY = MATCH_SQUAD_Y-5;
  let currentAwayY = MATCH_SQUAD_Y-5;

  const boxHeight = 60;
  const marginTop = 10;
  const halfWidth = HALF_X;

  // define your side‑specific margins here
  const margins = {
    home:   { left: 40, right: 15 },
    away:   { left: 15, right: 40 },
  };

  if (actions.length) {
    drawFooterBox();
  }

  for (let i = 0; i < actions.length; i++) {
    let horw = null
    const action = actions[i];
    const side    = action.w === 1 ? 'home' : 'away';
    const { left: sideLeft, right: sideRight } = margins[side];

    // compute x and width using those variables
    const currentX = (action.w === 1)
      ? sideLeft
      : halfWidth + sideLeft;

    const boxWidth = halfWidth - sideLeft - sideRight;
    const currentY = (action.w === 1)
      ? (currentHomeY += 0, currentHomeY)
      : (currentAwayY += 0, currentAwayY);

    if (action.w === 1) {
      currentHomeY += boxHeight + marginTop;
      horw = 1
    } else {
      currentAwayY += boxHeight + marginTop;
      horw = 2
    }

    const color = { r: 0, g: 0, b: 0, a: ACTION_ALPHA };
    const minute = action.minute;
    const name   = action.player;
    const name2  = action.player2;
    const score  = action.isScore ? `${action.homeScore}-${action.awayScore}` : null;

    addMatchAction(
      currentX, currentY,
      boxWidth, boxHeight,
      color, minute,
      name, action.type,
      score, name2, horw
    );
  }
}

function addMatchAction(x, y, width, height, color, minute, playerName, actionType, score, playerName2, horw) {
  addBox(x, y, width, height, color);
  
  if(horw == 1) {
    addBox(36, y,4, height, MATCH_COMMENTARY_HOME_COLOR);
    //addBox(x+width, y, 8, height, HOME_BOX_COLOR);
  } else {
    //addBox(x-8, y, 8, height, AWAY_BOX_COLOR);
    addBox(x+width, y, 4, height, MATCH_COMMENTARY_AWAY_COLOR);
  }
  let displayedName = playerName2 || playerName;
  let imageRightMargin = 10;
  let minuteLeftMargin = 10;
  let playerLeftMargin = 58;

  let imageSize = 38;
  let textSizeVal = 34;

  let textX = x + minuteLeftMargin;
  let textY = y + height / 2 - 2;

 

  fill(255);
  textSize(textSizeVal);
  textAlign(LEFT, CENTER);

  text(minute, textX, textY);

  textX += playerLeftMargin;
  let playerWidth = textWidth(displayedName);
  text(displayedName, textX, textY);

  const tintAlpha = 200;

  if (actionType == 'gol') {
    tint(255, 255, 255, 220);
    image(ballImage, x + width - imageSize - imageRightMargin, y + (height - imageSize) / 2 + 2, imageSize, imageSize);
  } else if (actionType == 'kacan_penalti') {
    tint(255, 255, 255, tintAlpha);
    image(missPenalty, x + width - imageSize - imageRightMargin, y + (height - imageSize) / 2, imageSize, imageSize);
  } else if (actionType == 'sarı') {
    tint(255, 255, 255, tintAlpha);
    image(yellowImage, x + width - imageSize - imageRightMargin, y + (height - imageSize) / 2, imageSize, imageSize);
  } else if (actionType == 'kırmızı') {
    tint(255, 255, 255, tintAlpha);
    image(redImage, x + width - imageSize - imageRightMargin, y + (height - imageSize) / 2, imageSize, imageSize);
  } else if (actionType == 'ikinci sarı kırmızı') {
    image(yellowRedImage, x + width - imageSize - imageRightMargin, y + (height - imageSize) / 2, imageSize, imageSize);
  } else if (actionType == 'oyuncu değişikliği') {
    image(exitImage, textX + playerWidth, y + (height - imageSize) / 2, imageSize, imageSize);
    image(enterImage, x + width - imageSize - imageRightMargin, y + (height - imageSize) / 2, imageSize, imageSize);

    textAlign(RIGHT, CENTER);
    text(playerName, x + width - imageSize - imageRightMargin - 5, textY);
  }

  noTint();

  if (score) {
    textAlign(RIGHT, CENTER);
    text(score, x + width - imageSize - imageRightMargin - 13, textY);
  }
}




function drawFooterBox() {
  addBox(0, ACTION_BOX_Y, WIDTH, HEIGTH - ACTION_BOX_Y, FOOTER_BG_COLOR)
}

function addSquadTeamName() {
  textSize(32);
  textAlign(CENTER, TOP);
  fill(255)

  text(MAC_INFO['info']['homeTeam'], HALF_X / 2, ACTION_BOX_Y + ACTION_TITLE_MARGIN_TOP)
  text(MAC_INFO['info']['awayTeam'], HALF_X + HALF_X / 2, ACTION_BOX_Y + ACTION_TITLE_MARGIN_TOP)
}

function addActionTitle(t) {
  textSize(32);
  textAlign(CENTER, TOP);
  fill(255)
  text(t, ACTION_BOX_X, ACTION_BOX_Y + ACTION_TITLE_MARGIN_TOP)
}


// Global settings for squad display
const SQUAD_HOME_MARGIN_LEFT    = 40;
const SQUAD_HOME_MARGIN_RIGHT   = 20;
const SQUAD_AWAY_MARGIN_LEFT    = 20;
const SQUAD_AWAY_MARGIN_RIGHT   = 40;

const SQUAD_VERTICAL_MARGIN     = 40;
const SQUAD_BOX_HEIGHT          = 48;
const SQUAD_ANIMATION_SPEED     = 15;
// Fixed gap between items
const SQUAD_ITEM_SPACING        = 10;

const NUMBER_BOX_WIDTH          = 80;
const NAME_BOX_WIDTH            = 395;

// Alpha values
let squadAlpha                = SQUAD_ALPHA;
let numberAlpha               = 255;
let nameAlpha                 = 255;

// Colors: [r, g, b]
let numberColor               = [255, 255, 255];
let nameColor                 = [255, 255, 255];
let subNumberColor            = [255, 255, 255];
let subNameColor              = [255, 255, 255];
let coachNumberColor          = [255, 215,   0];
let coachNameColor            = [255, 215,   0];

// Setter functions
function setSubNumberColor(r, g, b)   { subNumberColor   = [r, g, b]; }
function setSubNameColor(r, g, b)     { subNameColor     = [r, g, b]; }
function setCoachNumberColor(r, g, b) { coachNumberColor = [r, g, b]; }
function setCoachNameColor(r, g, b)   { coachNameColor   = [r, g, b]; }

// Animation state
let squadIndex     = 0;
let isHomeSquad    = true;
let displayedSquad = [];

function addSquad() {
  drawFooterBox();
  addNotice();

  // Build roster sections
  const homeSection = MAC_INFO.homePlayers
    .concat({ number: 'TD', name: MAC_INFO.info.homeCoach }, MAC_INFO.homeSubstitutes);
  const awaySection = MAC_INFO.awayPlayers
    .concat({ number: 'TD', name: MAC_INFO.info.awayCoach }, MAC_INFO.awaySubstitutes);
  const section = isHomeSquad ? homeSection : awaySection;
  const n = section.length;
  if (n === 0) return;

  // Determine horizontal start position
  const startX = isHomeSquad
    ? SQUAD_HOME_MARGIN_LEFT
    : HALF_X + SQUAD_AWAY_MARGIN_LEFT;

  textSize(34);

  // Animate entry appearance
  if (frameCount % SQUAD_ANIMATION_SPEED === 0) {
    if (squadIndex < n) {
      const offsetY = MATCH_SQUAD_Y + squadIndex * (SQUAD_BOX_HEIGHT + SQUAD_ITEM_SPACING);
      displayedSquad.push({
        number: section[squadIndex].number || '-',
        name:   section[squadIndex].name,
        x:      startX,
        y:      offsetY
      });
      squadIndex++;
    } else if (isHomeSquad) {
      isHomeSquad = false;
      squadIndex = 0;
    } else {
      isSquadAnimation = true;
    }
  }

  // Draw each squad item
  for (let item of displayedSquad) {
    const isSub   = MAC_INFO.homeSubstitutes.some(p => p.name === item.name)
                 || MAC_INFO.awaySubstitutes.some(p => p.name === item.name);
    const isCoach = item.number === 'TD';
    const numCol  = isCoach ? coachNumberColor : isSub ? subNumberColor : numberColor;
    const nameCol = isCoach ? coachNameColor   : isSub ? subNameColor   : nameColor;

    // Number box
    fill(0, 0, 0, squadAlpha);
    rect(item.x, item.y, NUMBER_BOX_WIDTH, SQUAD_BOX_HEIGHT);
    fill(...numCol, numberAlpha);
    textAlign(CENTER, CENTER);
    text(item.number, item.x + NUMBER_BOX_WIDTH / 2, item.y + SQUAD_BOX_HEIGHT / 2 - 3);

    // Name box
    fill(0, 0, 0, squadAlpha);
    rect(item.x + NUMBER_BOX_WIDTH + 5, item.y, NAME_BOX_WIDTH, SQUAD_BOX_HEIGHT);
    fill(...nameCol, nameAlpha);
    textAlign(LEFT, CENTER);
    text(item.name, item.x + NUMBER_BOX_WIDTH + 15, item.y + SQUAD_BOX_HEIGHT / 2 - 3);
  }
}



let isFirstSqauad = true
let firstStartTime = null
let is_pass = false

function MatchComentaryAnimation() {
  if (JSON_INDEX == null || (startTime + INITIAL_DELAY >= millis())) {
   
    if(JSON_INDEX == null) {
      JSON_INDEX = 0
    }

    if(!isDC) {
      startTime += MAC_INFO['aksiyonlar'][JSON_INDEX]['dc']
      isDC = true
    }
    

  
  
    if (MAC_INFO['aksiyonlar'][JSON_INDEX]['isScoreChange']) {
      homeScore = MAC_INFO['aksiyonlar'][JSON_INDEX]['homeScore'];
      awayScore = MAC_INFO['aksiyonlar'][JSON_INDEX]['awayScore'];
    }
  
    if (MAC_INFO['aksiyonlar'][JSON_INDEX]['isSquad']&&(firstStartTime == null|| firstStartTime+squadDelay>millis())&&!is_pass) {
     
      if(!isSquadAnimation) {
        startTime += 50000000 
    
        addSquad();
        
      } else {
        if (isFirstSqauad) {
          isFirstSqauad = false
          firstStartTime = millis()
          setTimeout(()=>{is_pass=true; startTime=0}, squadDelay)
        }

        
          drawFooterBox()  
          textSize(34);


          for (let item of displayedSquad) {
            const isSub   = MAC_INFO.homeSubstitutes.some(p => p.name === item.name)
                         || MAC_INFO.awaySubstitutes.some(p => p.name === item.name);
            const isCoach = item.number === 'TD';
            const numCol  = isCoach ? coachNumberColor : isSub ? subNumberColor : numberColor;
            const nameCol = isCoach ? coachNameColor   : isSub ? subNameColor   : nameColor;
        
            // Number box
            fill(0, 0, 0, squadAlpha);
            rect(item.x, item.y, NUMBER_BOX_WIDTH, SQUAD_BOX_HEIGHT);
            fill(...numCol, numberAlpha);
            textAlign(CENTER, CENTER);
            text(item.number, item.x + NUMBER_BOX_WIDTH / 2, item.y + SQUAD_BOX_HEIGHT / 2 - 3);
        
            // Name box
            fill(0, 0, 0, squadAlpha);
            rect(item.x + NUMBER_BOX_WIDTH + 5, item.y, NAME_BOX_WIDTH, SQUAD_BOX_HEIGHT);
            fill(...nameCol, nameAlpha);
            textAlign(LEFT, CENTER);
            text(item.name, item.x + NUMBER_BOX_WIDTH + 15, item.y + SQUAD_BOX_HEIGHT / 2 - 3);
          }

          addNotice()
        
       
          
        
      }
      
   
   
    } else {
      if ('action' in MAC_INFO['aksiyonlar'][JSON_INDEX] && MAC_INFO['aksiyonlar'][JSON_INDEX]['action'] && isAppendAction) {
        isAppendAction = false
        actions.push(MAC_INFO['aksiyonlar'][JSON_INDEX]);
        
      }
  
  }
 
} else {
  byPass = false
  isAppendAction = true
  isDC = false
  if (JSON_INDEX + 1 < MAC_INFO['aksiyonlar'].length) {
    JSON_INDEX++;
  }
  startTime = millis()

  
  
}



  addMatchCommentary();
}


function addIY(iy) {

  if(iy.ilk_yari_skor) {
    
    iy = `İY : ${iy.ilk_yari_skor[0]} - ${iy.ilk_yari_skor[1]}`
  } else {
   
    iy = MAC_INFO.info.matchTime
  }

  
  textAlign(CENTER, TOP);
  fill(255)
  textSize(36);
  
  text(iy, WIDTH / 2, LOGO_BOX_Y+40);

}

function addMinute(minute) {

  
  textAlign(CENTER, TOP);
  fill(255)
  textSize(36);
  text(minute, WIDTH / 2, LOGO_BOX_Y+320);

}

function formatMillis(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  const milliseconds = String(ms % 1000).padStart(3, '0');
  return `${minutes}:${seconds}.${milliseconds}`;
}


function addMatchCommentary() {
  
  let bgColor = MAC_INFO['aksiyonlar'][JSON_INDEX]['bgColor']
  let textColor = MAC_INFO['aksiyonlar'][JSON_INDEX]['color']
  let boxText = MAC_INFO['aksiyonlar'][JSON_INDEX]['text']
  
  if(!isRecord) {
     if (WHISTLE_MESSAGES.includes(boxText)) {
      if (whistleTimes.length === 0 || millis() - whistleTimes[whistleTimes.length - 1] > 4000) {
        whistleTimes.push(millis());
      }
    }

      if (boxText === 'GOOOLLLL!') {
      // Eğer aynı anda tekrar tekrar yazılmasın diye sonuncu entry'e benzemesin
      if (goalTimes.length === 0 || millis() - goalTimes[goalTimes.length - 1] > 4000) {
        goalTimes.push(millis());
      }
    }
  }

 

  // Metin kutusunu çiz
  fill(bgColor.r, bgColor.g, bgColor.b);
  rect(MATCH_COMMENTARY_BOX_X, MATCH_COMMENTARY_BOX_Y, MATCH_COMMENTARY_BOX_WIDTH, MATCH_COMMENTARY_BOX_HEIGHT);

  // Metni ayarla ve dikeyde ortala
  fill(textColor.r, textColor.g, textColor.b);
  textSize(MATCH_COMMENTARY_BOX_TEXT_SIZE);
  textAlign(CENTER, CENTER);

  // Dikey olarak tam ortala
  const centerY = MATCH_COMMENTARY_BOX_Y + MATCH_COMMENTARY_BOX_HEIGHT / 2;
  text(boxText, HALF_X, centerY-2.5);

 

  if (boxText == 'Maç Bitti!') {
    console.log(counter);
    console.log("Maçta atılan tüm goller:");
      goalTimes.forEach((t, i) => {
            console.log(`Gol ${i + 1}: ${formatMillis(t)} (${(t / 1000).toFixed(2)} saniye)`);

      });
      console.log("📋 Düdük anları:");
      whistleTimes.forEach((t, i) => {
        console.log(`Düdük ${i + 1}: ${formatMillis(t)} (${(t / 1000).toFixed(2)} saniye)`);
      });
    
      }
}



function getMatchCommentaryBoxColor() {
  let color = MATCH_COMMENTARY_BOX_COLOR
  if (MAC_INFO['aksiyonlar'][JSON_INDEX]['w'] == 1) {
    color = MATCH_COMMENTARY_HOME_COLOR 
  } else if (MAC_INFO['aksiyonlar'][JSON_INDEX]['w'] == 2) {
    color = MATCH_COMMENTARY_AWAY_COLOR 
  }
  return color
}

function getMatchCommentaryTextColor() {
  let color = { r: 0, g: 0, b: 0, a: 255 }
  if (MAC_INFO['aksiyonlar'][JSON_INDEX]['w'] == 1) {
    color = HOME_BOX_TEXT_COLOR
  } else if (MAC_INFO['aksiyonlar'][JSON_INDEX]['w'] == 2) {
    color = AWAY_BOX_TEXT_COLOR
  }
  return color
}

function addMatchCommentaryText(boxText, color) {
  if (!color) {
    color = getMatchCommentaryTextColor();
  }

  fill(color.r, color.g, color.b)
  textSize(MATCH_COMMENTARY_BOX_TEXT_SIZE);

  textAlign(CENTER, CENTER);
  text(boxText, HALF_X, MATCH_COMMENTARY_TEXT_Y )
}

function addTeamName(teamName, x, y, color) {
  fill(color.r, color.g, color.b, color.a); // Siyah renk
  textSize(TEAM_NAME_TEXT_SIZE);
  textAlign(CENTER, TOP);
  text(teamName, x, y); // Takım adını ekrana yazdır
}

function addTeamScore(score, x, y, color) {
  fill(color.r, color.g, color.b, color.a);
  textSize(SCORE_TEXT_SIZE);
  textAlign(CENTER, CENTER);
  text(score, x, y);
}

function addMatchDate(x, y, w, h, color) {
  addBox(x, y, w, h, color);
  fill(255, 255, 255);
  textSize(40);
  textAlign(CENTER, TOP);
  //let macInfo = `${MAC_INFO['info']['leagueName']} - ${MAC_INFO['info']['matchDate']} (${MAC_INFO['info']['week']}. Hafta, ${MAC_INFO['info']['season']})`
  let macInfo = `${MAC_INFO['info']['leagueName']} (${MAC_INFO['info']['season']} Sezonu)`
  text(macInfo, WIDTH/2, y+  MATCH_DATE_TEXT_FIRST_LINE_MARGIN_TOP);
  macInfo = `${MAC_INFO['info']['matchDate']} (${MAC_INFO['info']['week']}. Hafta)`
  if ('leg' in MAC_INFO['info']) {
    macInfo = `${MAC_INFO['info']['matchDate']} (${MAC_INFO['info']['leg']})`
  }
  text(macInfo, WIDTH/2, y+  MATCH_DATE_TEXT_SECOND_LINE_MARGIN_TOP);
}



function Settings() {
  MATCH_COMMENTARY_BOX_COLOR = 'matchCommentaryBoxColor' in MAC_INFO['settings'] ? MAC_INFO['settings']['matchCommentaryBoxColor'] : MATCH_COMMENTARY_BOX_COLOR
  HOME_BOX_COLOR = 'homeBoxColor' in MAC_INFO['settings'] ? MAC_INFO['settings']['homeBoxColor'] : HOME_BOX_COLOR;
  AWAY_BOX_COLOR = 'awayBoxColor' in MAC_INFO['settings'] ? MAC_INFO['settings']['awayBoxColor'] : AWAY_BOX_COLOR;
  HOME_BOX_TEXT_COLOR = 'homeBoxTextColor' in MAC_INFO['settings'] ? MAC_INFO['settings']['homeBoxTextColor'] : HOME_BOX_TEXT_COLOR;
  AWAY_BOX_TEXT_COLOR = 'awayBoxTextColor' in MAC_INFO['settings'] ? MAC_INFO['settings']['awayBoxTextColor'] : AWAY_BOX_TEXT_COLOR;
  HOME_NAME_COLOR = 'homeNameColor' in MAC_INFO['settings'] ? MAC_INFO['settings']['homeNameColor'] : HOME_NAME_COLOR;
  AWAY_NAME_COLOR = 'awayNameColor' in MAC_INFO['settings'] ? MAC_INFO['settings']['awayNameColor'] : AWAY_NAME_COLOR;
  SCORE_HOME_COLOR = 'homeScoreColor' in MAC_INFO['settings'] ? MAC_INFO['settings']['homeScorColor'] : SCORE_HOME_COLOR;
  SCORE_AWAY_COLOR = 'awayScoreColor' in MAC_INFO['settings'] ? MAC_INFO['settings']['homeScorColor'] : SCORE_AWAY_COLOR;
  MATCH_COMMENTARY_HOME_COLOR = MAC_INFO['settings']['matchCommentaryHomeColor'];
  MATCH_COMMENTARY_AWAY_COLOR = MAC_INFO['settings']['matchCommentaryAwayColor']
} 