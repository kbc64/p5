let MAC_INFO;
let animationStartTime = -1;  
let team1Logo, team2Logo;
let homeScore = 0
let awayScore = 0


isRecord = false;

const rosterLeftColor = { r: 0, g: 0, b: 0, a: 70 };
const rosterRightColor = { r: 0, g: 0, b: 0, a: 70 };
const rosterTextColor = { r: 255, g: 255, b: 255, a: 255 };
// Forma numarası (jersey) kutusu için renkler:
const jerseyBoxColor = { r: 80, g: 80, b: 80, a: 255 };
const jerseyTextColor = { r: 255, g: 255, b: 255, a: 255 };
const substituteJerseyTextColor = { r: 200, g: 200, b: 200, a: 255 }; // Yedek oyuncu numaraları için yeni renk
const substituteJerseyBoxColor = { r: 80, g: 80, b: 80, a: 255 }; // Yedek oyuncu kutusu için yeni renk


let homeFadeStartTime = null;
let awayFadeStartTime = null;

let homePlayers = null;
let awayPlayers = null;
let homeCoach = "";
let awayCoach = "";
let homeSubstitutes = [];
let awaySubstitutes = [];
let playerPositions = {};


function preload() {
  MAC_INFO = loadJSON('./json/mac.json');
  ballImage = loadImage("../images/ball_canva.png");
  yellowImage = loadImage("../images/yellow_canva.png");
  redImage = loadImage("../images/red_canva.png");
  yellowRedImage = loadImage("../images/yellow_red_canva.png");
  exitImage = loadImage("../images/exit.png");
  enterImage = loadImage("../images/enter.png");
  backgroundImage = loadImage("images/stadyum.png");
  team1Logo = loadImage("images/gs.png");  
  team2Logo = loadImage("images/fb.png");  
  roboto  = loadFont('fonts/Roboto-Regular.ttf'); 


}


function setup() {
  createCanvas(WIDTH, HEIGTH);
  homePlayers = MAC_INFO['homePlayers']
  awayPlayers = MAC_INFO['awayPlayers']
  homeCoach = MAC_INFO['info']['homeCoach'];
  awayCoach = MAC_INFO['info']['awayCoach'];
  homeSubstitutes = MAC_INFO['homeSubstitutes'];
  awaySubstitutes = MAC_INFO['awaySubstitutes'];
  Settings()

  textFont(roboto); // Varsayılan font olarak ayarla

 
  setTimeout(MatchComentaryAnimation, ANIMATION_TIME)



  capturer = new CCapture( {
    format: 'webm',
    framerate: 60,
    verbose: true,
    quality: 1
} );
}





function addBox(x, y, boxWidth, boxHeight, color) {
  fill(color.r, color.g, color.b, color.a);
  rect(x, y, boxWidth, boxHeight);
}



function draw() {
  if (frameCount === 1 && isRecord) {
    console.log('buaradayım')
    capturer.start()
}
  noStroke(); 
  background(backgroundImage);
  addMatchCommentary();
  addBox(LOGO_HOME_BOX_X, LOGO_BOX_Y, LOGO_BOX_WIDTH, LOGO_BOX_HEIGHT, HOME_BOX_COLOR);
  addBox(LOGO_AWAY_BOX_X, LOGO_BOX_Y, LOGO_BOX_WIDTH, LOGO_BOX_HEIGHT, AWAY_BOX_COLOR);
  image(team1Logo, LOGO_HOME_IMAGE_X, LOGO_IMAGE_Y, LOGO_IMAGE_WIDTH, LOGO_IMAGE_HEIGHT);  
  image(team2Logo, LOGO_AWAY_IMAGE_X, LOGO_IMAGE_Y, LOGO_IMAGE_WIDTH, LOGO_IMAGE_HEIGHT);
  addTeamName(MAC_INFO['info']['homeTeam'], HOME_NAME_X, TEAM_NAME_Y, HOME_NAME_COLOR);
  addTeamName(MAC_INFO['info']['awayTeam'], AWAY_NAME_X, TEAM_NAME_Y, AWAY_NAME_COLOR);
  addTeamScore(homeScore, SCORE_HOME_X, SCORE_TEAM_Y, SCORE_HOME_COLOR);
  addTeamScore(awayScore, SCORE_AWAY_X, SCORE_TEAM_Y, SCORE_AWAY_COLOR);
  addMatchDate(MATCH_DATE_BOX_X, MATCH_DATE_BOX_Y, MATCH_DATE_BOX_WIDTH, MATCH_DATE_BOX_HEIGHT, MATCH_DATE_BOX_COLOR);
  //addAction()
  addSquad()



  if (frameCount < 60 * 15 && isRecord) {
   
    capturer.capture(canvas)
    
} else if (frameCount === 60 * 15 && isRecord) {
    capturer.save()
    capturer.stop()
  
}
  


  
}

function addAction() {
  drawFooterBox()
  addActionTitle("ÖNEMLİ ANLAR")
}

function drawFooterBox() {
  addBox(0, ACTION_BOX_Y, WIDTH, HEIGTH - ACTION_BOX_Y,{r:0, g:0, b:0, a:100})
}

function addActionTitle(t) {
  textSize(32);
  textAlign(CENTER, TOP);
  fill(255)
  text(t, ACTION_BOX_X, ACTION_BOX_Y + ACTION_TITLE_MARGIN_TOP)
}

let homeIndex = 0;
let awayIndex = 0;
let stage = "homePlayers";
let animationSpeed = 30; // Tüm animasyonlar için aynı hız
let lastUpdateFrame = 0;
let homeCoachDisplayed = false;
let awayCoachDisplayed = false;
let homeRosterComplete = false;
let awayRosterComplete = false;
let spacingAfterCoach = 60; // Teknik direktörden sonra boşluk
let fadeAmount = 0; // Opaklık için değişken

function addSquad() {
  renderTeamRoster(0, MATCH_SQUAD_Y, 540, 800, homePlayers, rosterTextColor, homeCoach, homeSubstitutes);
  renderTeamRoster(540, MATCH_SQUAD_Y, 540, 800, awayPlayers, rosterTextColor, awayCoach, awaySubstitutes);
}

function renderTeamRoster(x, y, boxWidth, boxHeight, teamPlayers, textColor, coach, substitutes) {
  let rowHeight = 60;
  let padding = 10;
  let jerseyBoxWidth = 50;

  let currentY = y + padding + rowHeight / 2;

  for (let i = 0; i < teamPlayers.length; i++) {
    let player = teamPlayers[i];
    let jerseyX = x + padding;
    let jerseyY = currentY - rowHeight / 2;

    fill(jerseyBoxColor.r, jerseyBoxColor.g, jerseyBoxColor.b, 255);
    rect(jerseyX, jerseyY, jerseyBoxWidth, rowHeight);
    
    push();
    textAlign(CENTER, CENTER);
    fill(jerseyTextColor.r, jerseyTextColor.g, jerseyTextColor.b, 255);
    text(player.number, jerseyX + jerseyBoxWidth / 2, jerseyY + rowHeight / 2);
    pop();
    
    fill(textColor.r, textColor.g, textColor.b, 255);
    textAlign(LEFT, CENTER);
    let nameX = jerseyX + jerseyBoxWidth + 10;
    text(player.name, nameX, currentY);
    
    currentY += rowHeight;
  }
  
  // Teknik direktörü ekle
  fill(textColor.r, textColor.g, textColor.b, 255);
  textAlign(LEFT, CENTER);
  textSize(32);
  text(`Teknik Direktör: ${coach}`, x + padding, currentY + 10);
  currentY += rowHeight;

  currentY +=10
  
  // Yedek oyuncuları aynı formatta ekle
  for (let i = 0; i < substitutes.length; i++) {
    let player = substitutes[i];
    let jerseyX = x + padding;
    let jerseyY = currentY - rowHeight / 2;
    fill(substituteJerseyBoxColor.r, substituteJerseyBoxColor.g, substituteJerseyBoxColor.b, 255);
    rect(jerseyX, jerseyY, jerseyBoxWidth, rowHeight);
    
    push();
    textAlign(CENTER, CENTER);
    fill(jerseyTextColor.r, jerseyTextColor.g, jerseyTextColor.b, 255);
    textSize(32); // İlk 11 ile aynı font boyutu
    text(player.number, jerseyX + jerseyBoxWidth / 2, jerseyY + rowHeight / 2);
    pop();
    
    fill(textColor.r, textColor.g, textColor.b, 255);
    textAlign(LEFT, CENTER);
    textSize(32); // İlk 11 ile aynı font boyutu
    let nameX = jerseyX + jerseyBoxWidth + 10;
    text(player.name, nameX, currentY);
    
    currentY += rowHeight;
  }
}


function renderTeamRoster(x, y, boxWidth, boxHeight, teamPlayers, textColor, coach, substitutes, showCoach, opacity = 255) {
  let rowHeight = 60;
  let padding = 20;
  let padding_x = 20;
  let jerseyBoxWidth = 50;
  let currentY = y + padding + rowHeight / 2;

  for (let i = 0; i < teamPlayers.length; i++) {
    let player = teamPlayers[i];
    let jerseyX = x + padding_x;
    let jerseyY = currentY - rowHeight / 2;
    fill(200, 200, 200, opacity);
    rect(jerseyX, jerseyY, jerseyBoxWidth, rowHeight);
    push();
    textAlign(CENTER, CENTER);
    fill(0, opacity);
    text(player.number, jerseyX + jerseyBoxWidth / 2, jerseyY + rowHeight / 2);
    pop();
    fill(textColor.r, textColor.g, textColor.b, opacity);
    textAlign(LEFT, CENTER);
    let nameX = jerseyX + jerseyBoxWidth + 10;
    text(player.name, nameX, currentY);
    currentY += rowHeight;
  }
  
  if (showCoach && coach) {
    fill(textColor.r, textColor.g, textColor.b, opacity);
    textAlign(LEFT, CENTER);
    textSize(32);
    text(`Teknik Direktör: ${coach}`, x + padding_x, currentY + 10);
    currentY += rowHeight;
  }
  
  for (let i = 0; i < substitutes.length; i++) {
    let player = substitutes[i];
    let jerseyX = x + padding_x;
    let jerseyY = currentY - rowHeight / 2;
    fill(150, 150, 150, opacity);
    rect(jerseyX, jerseyY, jerseyBoxWidth, rowHeight);
    push();
    textAlign(CENTER, CENTER);
    fill(0, opacity);
    text(player.number, jerseyX + jerseyBoxWidth / 2, jerseyY + rowHeight / 2);
    pop();
    fill(textColor.r, textColor.g, textColor.b, opacity);
    textAlign(LEFT, CENTER);
    let nameX = jerseyX + jerseyBoxWidth + 10;
    text(player.name, nameX, currentY);
    currentY += rowHeight;
  }
}





function MatchComentaryAnimation() {
  JSON_INDEX++
  let time = MAC_INFO['aksiyonlar'][JSON_INDEX]['dc'] + ANIMATION_TIME
  if(MAC_INFO['aksiyonlar'][JSON_INDEX]['isAnimation']) {
    animationStartTime = millis()
    time = ANIMATION_DURATION + 2000
  }
  if(MAC_INFO['aksiyonlar'][JSON_INDEX]['isScoreChange']) {
    homeScore = MAC_INFO['aksiyonlar'][JSON_INDEX]['homeScore']
    awayScore = MAC_INFO['aksiyonlar'][JSON_INDEX]['awayScore']
  }

  setTimeout(MatchComentaryAnimation, time)
}


 


function addMatchCommentary() {
  let currentColor = getMatchCommentaryBoxColor()
  let textColor = getMatchCommentaryTextColor()
  if (animationStartTime !== -1) {
    let elapsed = millis() - animationStartTime;
    if (elapsed < ANIMATION_DURATION) {
      let phase = floor(elapsed / TOGGLE_INTERVAL);
      currentColor = (phase % 2 === 0) ? getMatchCommentaryTextColor() : getMatchCommentaryBoxColor()
      textColor = (phase % 2 === 0) ? getMatchCommentaryBoxColor(): getMatchCommentaryTextColor()
    } else {
      animationStartTime = -1;
      currentColor = getMatchCommentaryBoxColor();
      textColor = getMatchCommentaryTextColor()
    }
  }
  
  fill(currentColor.r, currentColor.g, currentColor.b);
  rect(MATCH_COMMENTARY_BOX_X, MATCH_COMMENTARY_BOX_Y, MATCH_COMMENTARY_BOX_WIDTH, MATCH_COMMENTARY_BOX_HEIGHT);
  addMatchCommentaryText(MAC_INFO['aksiyonlar'][JSON_INDEX]['text'], textColor)
}

function getMatchCommentaryBoxColor() {
  let color = MATCH_COMMENTARY_BOX_COLOR
  if(MAC_INFO['aksiyonlar'][JSON_INDEX]['w'] == 1) {
    color = HOME_BOX_COLOR
  } else if(MAC_INFO['aksiyonlar'][JSON_INDEX]['w'] == 2) {
    color = AWAY_BOX_COLOR
  } 
  return color
}

function getMatchCommentaryTextColor() {
  let color = {r:0, g:0, b:0, a: 255}
  if(MAC_INFO['aksiyonlar'][JSON_INDEX]['w'] == 1) {
    color = HOME_BOX_TEXT_COLOR
  } else if(MAC_INFO['aksiyonlar'][JSON_INDEX]['w'] == 2) {
    color = AWAY_BOX_TEXT_COLOR
  }
  return color
}

function addMatchCommentaryText(boxText, color) {
  if (!color) {
    color = getMatchCommentaryTextColor();
  }
  
  fill(color.r, color.g, color.b)
  textSize(52);
  
  textAlign(CENTER, CENTER);
  text(boxText, HALF_X, MATCH_COMMENTARY_TEXT_Y)
}

function addTeamName(teamName, x, y, color) {
  fill(color.r, color.g, color.b, color.a); // Siyah renk
  textSize(44);
  textAlign(CENTER, CENTER);
  text(teamName, x, y); // Takım adını ekrana yazdır
}

function addTeamScore(score, x, y, color) {
  fill(color.r, color.g, color.b, color.a);
  textSize(72);
  textAlign(CENTER, CENTER);
  text(score, x, y);
}

function addMatchDate(x, y, w, h, color) {
  addBox(x, y, w, h, color);
  fill(255);
  textSize(32); 
  textAlign(CENTER, TOP);
  let macInfo =  `${MAC_INFO['info']['leagueName']}, ${MAC_INFO['info']['season']} Sezonu, ${MAC_INFO['info']['week']}. Hafta`
  text(macInfo, x + w / 2, y + MATCH_DATE_TEXT_FIRST_LINE_MARGIN_TOP);
  macInfo =  `${MAC_INFO['info']['matchDate']}, ${MAC_INFO['info']['stadium']}`
  text(macInfo, x + w / 2, y + MATCH_DATE_TEXT_SECOND_LINE_MARGIN_TOP);
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