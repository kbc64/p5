let MAC_INFO;
let colors;
let currenAnimsationIndex = 1;
let lastChangeTime = 0;
let interval = 75; // 100ms'de bir renk değiştir (Hızlı yanıp sönme efekti)
let animationDuration = 750; // Toplam 2 saniye boyunca devam edecek
let animationStartTime = null;
let animating = false;
let startTime = null
let byPass = false
let isAppendAction = true
let isSquadAnimation = false

let team1Logo, team2Logo;
let homeScore = 0
let awayScore = 0
let INITIAL_DELAY = 1000;
const squadDelay = 3000;
const goalAnimation = 1000;
let counter = 0;

let isDC = false

const actions = []

isRecord = true;
videoTime = 130



const remoteServer = 'http://127.0.0.1:8000';

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
    backgroundImage = loadImage(MAC_INFO['info']['bgImage']);
  });
  
  ballImage = loadImage("../images/assets/ball.png");
  yellowImage = loadImage("../images/assets/yellow.png");
  redImage = loadImage("../images/assets/red.png");
  yellowRedImage = loadImage("../images/assets/yellow_red.png");
  enterImage = loadImage("../images/assets/enter.png");
  exitImage = loadImage("../images/assets/exit.png");
  
  
 
  roboto = loadFont('fonts/Roboto-Regular.ttf');


}



const capturer = new CCapture({
  format: 'webm',
  framerate: 60,
  verbose: true,
  quality: 1
})

function setup() {

  let canvas = createCanvas(WIDTH, HEIGTH);
  canvas.elt.getContext('2d', { willReadFrequently: true });

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

 



  addBox(LOGO_HOME_BOX_X, LOGO_BOX_Y, LOGO_BOX_WIDTH, LOGO_BOX_HEIGHT, HOME_BOX_COLOR);
  addBox(LOGO_AWAY_BOX_X, LOGO_BOX_Y, LOGO_BOX_WIDTH, LOGO_BOX_HEIGHT, AWAY_BOX_COLOR);
  image(team1Logo, LOGO_HOME_IMAGE_X, LOGO_IMAGE_Y, LOGO_IMAGE_WIDTH, LOGO_IMAGE_HEIGHT);
  image(team2Logo, LOGO_AWAY_IMAGE_X, LOGO_IMAGE_Y, LOGO_IMAGE_WIDTH, LOGO_IMAGE_HEIGHT);
  addTeamName(MAC_INFO['info']['homeTeam'], HOME_NAME_X, TEAM_NAME_Y, HOME_NAME_COLOR);
  addTeamName(MAC_INFO['info']['awayTeam'], AWAY_NAME_X, TEAM_NAME_Y, AWAY_NAME_COLOR);
  addTeamScore(homeScore, SCORE_HOME_X, SCORE_TEAM_Y, SCORE_HOME_COLOR);
  addTeamScore(awayScore, SCORE_AWAY_X, SCORE_TEAM_Y, SCORE_AWAY_COLOR);
  addMatchDate(MATCH_DATE_BOX_X, MATCH_DATE_BOX_Y, MATCH_DATE_BOX_WIDTH, MATCH_DATE_BOX_HEIGHT, MATCH_DATE_BOX_COLOR);



  addAction()

  MatchComentaryAnimation()

  addBorder()

  if (frameCount < 60 * videoTime && isRecord) {

    capturer.capture(canvas)

  } else if (frameCount === 60 * videoTime && isRecord) {
    capturer.save()
    capturer.stop()

  }

 



}

function addBorder() {
  addBox(0, MATCH_COMMENTARY_BOX_Y-MATCH_COMMENTARY_BOX_MARGIN_TOP, WIDTH, MATCH_COMMENTARY_BOX_MARGIN_TOP, BORDER_COLOR)
}


function addAction() {
 
  let currentHomeY = null
  let currentAwayY = null

  const boxHeight = 60
  const marginTop = 10

  if(actions.length) {
    drawFooterBox()
  }

  for (let i = 0; i < actions.length; i++) {
    let currentX = null
    let currentY = null
    let padding = 20
    const action = actions[i]
    const alpha = ACTION_ALPHA
    let color = { r: 0, g: 0, b: 0, a: alpha }
    const minute = action.minute
    const name = action.player
    const name2 = action.player2
    let score = action.isScore ? `${action.homeScore}-${action.awayScore}` : action.isScore
    

    if (action.w == 1) {
      currentX = 10
      currentHomeY = currentHomeY == null ? MATCH_SQUAD_Y : currentHomeY + boxHeight + marginTop
      currentY = currentHomeY

      //color = {r: HOME_BOX_COLOR.r, g: HOME_BOX_COLOR.g, b: HOME_BOX_COLOR.b, a: alpha}

    }
    if (action.w == 2) {
      currentX = currentX + HALF_X
      currentAwayY = currentAwayY == null ? MATCH_SQUAD_Y : currentAwayY + boxHeight + marginTop
      currentY = currentAwayY
      //color = {r: AWAY_BOX_COLOR.r, g: AWAY_BOX_COLOR.g, b: AWAY_BOX_COLOR.b, a: alpha}
    }


    addMatchAction(currentX + padding, currentY, HALF_X - (padding * 2), boxHeight, color, minute, name, action.type, score, name2);

  }


}



function addMatchAction(x, y, width, height, color, minute, playerName, actionType, score, playerName2) {

  addBox(x, y, width, height, color);

  let name = (playerName2) ? playerName2 : playerName
  let imageRightMargin = 10;
  let minuteLeftMargin = 10;
  let playerLeftMargin = 55;


  let imageSize = 38
  let textSizeVal = 32

  let textX = x
  let textY = y + height / 2;

  fill(255);
  textSize(textSizeVal);
  textAlign(LEFT, CENTER);



  textX += minuteLeftMargin
  let minuteWidth = textWidth(playerName)
  text(minute, textX, textY);


  textX += playerLeftMargin
  let playerWidth = textWidth(name)
  text(name, textX, textY);

  tintAlpha = 200

  if (actionType == 'gol') {
    tint(255, 255, 255, 220); // %50 şeffaflık
    imageSize = 38
    image(ballImage, x + width - imageSize - imageRightMargin, y + (height - imageSize) / 2 +3, imageSize, imageSize);
  } else if (actionType == 'sarı') {
    int(255, 255, 255, tintAlpha)
    image(yellowImage, x + width - imageSize - imageRightMargin, y + (height - imageSize) / 2, imageSize, imageSize);
  } else if (actionType == 'kırmızı') {
    tint(255, 255, 255, tintAlpha); // %50 şeffaflık
    image(redImage, x + width - imageSize - imageRightMargin, y + (height - imageSize) / 2, imageSize, imageSize);
  } else if (actionType == 'ikinci sarı kırmızı') {
    //tint(255, 255, 255, 240); // %50 şeffaflık
    image(yellowRedImage, x + width - imageSize - imageRightMargin, y + (height - imageSize) / 2, imageSize, imageSize);
  } else if (actionType == 'oyuncu değişikliği') {
    //tint(255, 255, 255, 240); // %50 şeffaflık
   
    image(exitImage, textX+playerWidth, y + (height - imageSize) / 2, imageSize, imageSize);
    image(enterImage, x + 5 + width - imageSize - imageRightMargin, y + (height - imageSize) / 2, imageSize, imageSize);
    textAlign(RIGHT, CENTER);
    text(playerName, x + 5 +  width - imageSize - imageRightMargin, textY);
  }
  noTint();







  
    if(score) {
      textAlign(LEFT, CENTER);
      text(score, x + width - imageSize - imageRightMargin-60, textY);
    
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



// p5.js'de her draw() çağrısında çalışan addSquad
let squadIndex = 0;
let isHomeSquad = true;
let displayedSquad = [];
let squadAlpha = SQUAD_ALPHA;
let squadBoxHeight = 48;
let squadAnimationSpeed = 15;
let squadPadding = 40;
let numberAlpha = 255;
let nameAlpha = 255;
let numberBoxWidth = 60;
let nameBoxWidth = 400;
let numberColor = [255, 255, 255];
let nameColor = [255, 255, 255];
let subNumberColor = [255, 255, 255]; // Yedek oyuncu numara rengi
let subNameColor = [255, 255, 255];   // Yedek oyuncu isim rengi
let coachNumberColor = [255, 215, 0]; // Teknik direktör numara rengi
let coachNameColor = [255, 215, 0];   // Teknik direktör isim rengi

function setSubNumberColor(r, g, b) {
  subNumberColor = [r, g, b];
}

function setSubNameColor(r, g, b) {
  subNameColor = [r, g, b];
}

function setCoachNumberColor(r, g, b) {
  coachNumberColor = [r, g, b];
}

function setCoachNameColor(r, g, b) {
  coachNameColor = [r, g, b];
}

// Mevcut set fonksiyonları aynı kalıyor...
let squadTime = 0
function addSquad() {
  drawFooterBox()
  const homeSection = MAC_INFO.homePlayers.concat({ number: 'TD', name: `${MAC_INFO.info.homeCoach}` }, MAC_INFO.homeSubstitutes);
  const awaySection = MAC_INFO.awayPlayers.concat({ number: 'TD', name: `${MAC_INFO.info.awayCoach}` }, MAC_INFO.awaySubstitutes);

  textSize(32);

  let section = isHomeSquad ? homeSection : awaySection;
  let startX = isHomeSquad ? 0 : HALF_X;

  if (frameCount % squadAnimationSpeed === 0) {
    if (squadIndex < section.length) {
      displayedSquad.push({ number: section[squadIndex].number || '', name: section[squadIndex].name, x: startX, y: MATCH_SQUAD_Y + squadIndex * (squadBoxHeight + 10)+SQUAD_PADDING_TOP});
      squadIndex++;
    } else if (isHomeSquad) {
      isHomeSquad = false;
      squadIndex = 0;
    } else {
      
        if(!isSquadAnimation) {
          isSquadAnimation = true
        }
          
        
    }
  
    
  }


  for (let item of displayedSquad) {
    let isSub = MAC_INFO.homeSubstitutes.some(p => p.name === item.name) || MAC_INFO.awaySubstitutes.some(p => p.name === item.name);
    let isCoach = item.number === 'TD';

    fill(0, 0, 0, squadAlpha);
    rect(item.x + squadPadding, item.y, numberBoxWidth, squadBoxHeight);
    fill(isCoach ? coachNumberColor[0] : isSub ? subNumberColor[0] : numberColor[0],
         isCoach ? coachNumberColor[1] : isSub ? subNumberColor[1] : numberColor[1],
         isCoach ? coachNumberColor[2] : isSub ? subNumberColor[2] : numberColor[2], numberAlpha);
    textAlign(CENTER, CENTER);
    text(item.number, item.x + squadPadding + numberBoxWidth / 2, item.y + squadBoxHeight / 2 -3);

    fill(0, 0, 0, squadAlpha);
    rect(item.x + squadPadding + numberBoxWidth + 5, item.y, nameBoxWidth, squadBoxHeight);
    fill(isCoach ? coachNameColor[0] : isSub ? subNameColor[0] : nameColor[0],
         isCoach ? coachNameColor[1] : isSub ? subNameColor[1] : nameColor[1],
         isCoach ? coachNameColor[2] : isSub ? subNameColor[2] : nameColor[2], nameAlpha);
    textAlign(LEFT, CENTER);
    text(item.name, item.x + squadPadding + numberBoxWidth + 15, item.y + squadBoxHeight / 2-3);
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
    

    if (MAC_INFO['aksiyonlar'][JSON_INDEX]['isAnimation']) {
      
      if (!animating && !byPass) {
        animating = true;
        animationStartTime = millis(); // **Yeni başlangıç zamanı**
        currenAnimsationIndex = 0; // **İlk renk (kırmızı) ile başlasın**
        lastChangeTime = millis(); // **Son değişim zamanını sıfırla**
      }
        
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
          for (let item of displayedSquad) {
            let isSub = MAC_INFO.homeSubstitutes.some(p => p.name === item.name) || MAC_INFO.awaySubstitutes.some(p => p.name === item.name);
            let isCoach = item.number === 'TD';
        
            fill(0, 0, 0, squadAlpha);
            rect(item.x + squadPadding, item.y, numberBoxWidth, squadBoxHeight);
            fill(isCoach ? coachNumberColor[0] : isSub ? subNumberColor[0] : numberColor[0],
                 isCoach ? coachNumberColor[1] : isSub ? subNumberColor[1] : numberColor[1],
                 isCoach ? coachNumberColor[2] : isSub ? subNumberColor[2] : numberColor[2], numberAlpha);
            textAlign(CENTER, CENTER);
            text(item.number, item.x + squadPadding + numberBoxWidth / 2, item.y + squadBoxHeight / 2 -3);
        
            fill(0, 0, 0, squadAlpha);
            rect(item.x + squadPadding + numberBoxWidth + 5, item.y, nameBoxWidth, squadBoxHeight);
            fill(isCoach ? coachNameColor[0] : isSub ? subNameColor[0] : nameColor[0],
                 isCoach ? coachNameColor[1] : isSub ? subNameColor[1] : nameColor[1],
                 isCoach ? coachNameColor[2] : isSub ? subNameColor[2] : nameColor[2], nameAlpha);
            textAlign(LEFT, CENTER);
            text(item.name, item.x + squadPadding + numberBoxWidth + 15, item.y + squadBoxHeight / 2-3);
          
        }
        
       
          
        
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



function addMinute(minute) {

  //addBox(WIDTH/2, LOGO_BOX_Y + LOGO_BOX_HEIGHT, 80, 40, {r:0, g:0, b:0, a:100})
  textAlign(CENTER, TOP);
  fill(255)
  textSize(32);
  //text(minute, WIDTH / 2, ACTION_BOX_Y-75);

}




function addMatchCommentary() {
  let textColor = getMatchCommentaryTextColor();
  let boxColor = getMatchCommentaryBoxColor();
  let colors = [
    color(textColor.r, textColor.g, textColor.b),
    color(boxColor.r, boxColor.g, boxColor.b)
  ];

  let textColors = [
    boxColor,
    textColor


  ];




  if (animating) {
    let elapsedTime = millis() - animationStartTime;

    if (elapsedTime < animationDuration) {
      if (millis() - lastChangeTime > interval) {
        currenAnimsationIndex = (currenAnimsationIndex + 1) % colors.length;
        lastChangeTime = millis();
      }
    } else {
      

      animationStartTime  = 0
      animating = false; // Animasyonu durdur
    currenAnimsationIndex = 1; // Beyazda kalsın
    //JSON_INDEX++; // JSON_INDEX'i artır
    byPass = true
    
    startTime -= (INITIAL_DELAY - ANIMATION_DURATION) - goalAnimation; // Yeni animasyon için zamanı sıfırla
    

      
    }
  }

  fill(colors[currenAnimsationIndex]);
  rect(MATCH_COMMENTARY_BOX_X, MATCH_COMMENTARY_BOX_Y, MATCH_COMMENTARY_BOX_WIDTH, MATCH_COMMENTARY_BOX_HEIGHT);

  // MAC_INFO ve JSON_INDEX'in doğru olup olmadığını kontrol et
  if (MAC_INFO && MAC_INFO['aksiyonlar'] && MAC_INFO['aksiyonlar'][JSON_INDEX]) {

    addMatchCommentaryText(MAC_INFO['aksiyonlar'][JSON_INDEX]['text'], textColors[currenAnimsationIndex]);

    if ('minute' in MAC_INFO['aksiyonlar'][JSON_INDEX]) {
      addMinute(MAC_INFO['aksiyonlar'][JSON_INDEX]['minute']);
    }
  }
}

function getMatchCommentaryBoxColor() {
  let color = MATCH_COMMENTARY_BOX_COLOR
  if (MAC_INFO['aksiyonlar'][JSON_INDEX]['w'] == 1) {
    color = HOME_BOX_COLOR
  } else if (MAC_INFO['aksiyonlar'][JSON_INDEX]['w'] == 2) {
    color = AWAY_BOX_COLOR
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
  text(boxText, HALF_X, MATCH_COMMENTARY_TEXT_Y)
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
  textSize(32);
  textAlign(CENTER, TOP);
  //let macInfo = `${MAC_INFO['info']['leagueName']} - ${MAC_INFO['info']['matchDate']} (${MAC_INFO['info']['week']}. Hafta, ${MAC_INFO['info']['season']})`
  let macInfo = `${MAC_INFO['info']['leagueName']} (${MAC_INFO['info']['season']} Sezonu)`
  text(macInfo, WIDTH/2, y+  MATCH_DATE_TEXT_FIRST_LINE_MARGIN_TOP);
  macInfo = `${MAC_INFO['info']['matchDate']} (${MAC_INFO['info']['week']}. Hafta)`
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
} 