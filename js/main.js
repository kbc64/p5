
let MAC_INFO;
let animationStartTime = -1;  
let team1Logo, team2Logo;
let homeScore = 0
let awayScore = 0


// Roster alanları için siyah tonlarında arka plan (alfa 150) ve beyaz yazı:
const rosterLeftColor = { r: 0, g: 0, b: 0, a: 70 };
const rosterRightColor = { r: 0, g: 0, b: 0, a: 70 };
const rosterTextColor = { r: 255, g: 255, b: 255, a: 255 };
// Forma numarası (jersey) kutusu için renkler:
const jerseyBoxColor = { r: 80, g: 80, b: 80, a: 255 };
const jerseyTextColor = { r: 255, g: 255, b: 255, a: 255 };
const substituteJerseyTextColor = { r: 200, g: 200, b: 200, a: 255 }; // Yedek oyuncu numaraları için yeni renk
const substituteJerseyBoxColor = { r: 80, g: 80, b: 80, a: 255 }; // Yedek oyuncu kutusu için yeni renk

const playerFadeDelay = 200;    // Her oyuncu için gecikme (ms)
const playerFadeDuration = 500; // Her oyuncunun fade-in süresi (ms)
const headingFadeDuration = 500; // Bölüm başlığı fade-in süresi (ms)


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
  ballImage = loadImage("../images/ball.png");
  yellowImage = loadImage("../images/yellow.png");
  redImage = loadImage("../images/red.png");
  backgroundImage = loadImage("images/stadyum.png");
  team1Logo = loadImage("images/gs.png");  
  team2Logo = loadImage("images/fb.png");  

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
 
  setTimeout(MatchComentaryAnimation, ANIMATION_TIME)
  setTimeout(triggerSquad, 1000)
  getPlayersPositions()
}


function getPlayersPositions() {
  let currentY = MATCH_SQUAD_Y + MATCH_SQUAD_PADDING
  for(i=0; i<MAC_INFO['homePlayers'].length; i++) {
    playerPositions[MAC_INFO['homePlayers'][i]['id']] = currentY
    currentY +=  MATCH_SQUAD_ROW_HEIGHT
  }

  currentY += MATCH_SQUAD_ROW_HEIGHT + MATCH_SQUAD_PADDING;
  for(i=0; i<MAC_INFO['homeSubstitutes'].length; i++) {
    playerPositions[MAC_INFO['homeSubstitutes'][i]['id']] = currentY
    currentY +=  MATCH_SQUAD_ROW_HEIGHT
  }


  currentY = MATCH_SQUAD_Y + MATCH_SQUAD_PADDING
  for(i=0; i<MAC_INFO['awayPlayers'].length; i++) {
    playerPositions[MAC_INFO['awayPlayers'][i]['id']] = currentY
    currentY +=  MATCH_SQUAD_ROW_HEIGHT
  }

  currentY += MATCH_SQUAD_ROW_HEIGHT + MATCH_SQUAD_PADDING;
  for(i=0; i<MAC_INFO['awaySubstitutes'].length; i++) {
    playerPositions[MAC_INFO['awaySubstitutes'][i]['id']] = currentY
    currentY +=  MATCH_SQUAD_ROW_HEIGHT
  }





  console.log(playerPositions)
  
}


function addBox(x, y, boxWidth, boxHeight, color) {
  fill(color.r, color.g, color.b, color.a);
  rect(x, y, boxWidth, boxHeight);
}

function triggerSquad() {
  if (homeFadeStartTime === null) {
    homeFadeStartTime = millis();
    awayFadeStartTime = homeFadeStartTime + homePlayers.length * playerFadeDelay + 2 * headingFadeDuration;
  } 
}

function draw() {
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
  addMatchDate(MAC_INFO['info']['matchDate'], MATCH_DATE_BOX_X, MATCH_DATE_BOX_Y, MATCH_DATE_BOX_WIDTH, MATCH_DATE_BOX_HEIGHT, MATCH_DATE_BOX_COLOR);
  addSquad();
  addActions(120, 750, "sarı");
  addActions(180, 750, "kırmızı");
  addActions(220, 750, "gol");



  


  
}


function addActions(x, y, action) {
  currentX = x;
  currentY = y;
  currentY += (MATCH_SQUAD_ROW_HEIGHT - MATCH_ACTION_BOX_HEIGHT) / 2;
  addBox(currentX, currentY, MATCH_ACTION_BOX_WIDTH, MATCH_ACTION_BOX_HEIGHT, { r: 0, g: 0, b: 0, a: 0 });

  fill(255, 255, 255);
  textAlign(CENTER, TOP);
  textSize(16);
  text("35'", currentX + MATCH_ACTION_BOX_WIDTH / 2, currentY);
  let ballSize = 14;
  if (action == "sarı") {
    
    image(yellowImage, currentX + MATCH_ACTION_BOX_WIDTH / 2 - ballSize / 2, currentY+15, ballSize, ballSize);
  
  } else if (action == "gol") {
    
    image(ballImage, currentX + MATCH_ACTION_BOX_WIDTH / 2 - ballSize / 2, currentY+15, ballSize, ballSize);
  }
 else if (action == "kırmızı") {
    
    image(redImage, currentX + MATCH_ACTION_BOX_WIDTH / 2 - ballSize / 2, currentY+15, ballSize, ballSize);
  }
}




function addSquad() {
  addBox(0, MATCH_SQUAD_Y, width, HEIGTH - MATCH_SQUAD_Y, { r: 0, g: 0, b: 0, a: 70 });
  renderTeamRoster(0, MATCH_SQUAD_Y, 540, 800, homePlayers, rosterTextColor, homeCoach, homeSubstitutes);
  renderTeamRoster(540, MATCH_SQUAD_Y, 540, 800, awayPlayers, rosterTextColor, awayCoach, awaySubstitutes);
}

function renderTeamRoster(x, y, boxWidth, boxHeight, teamPlayers, textColor, coach, substitutes) {
  let rowHeight = 60;
  let padding = 10;
  let jerseyBoxWidth = 50;

  textFont('futura');
  textSize(32);

  let currentY = y + padding + rowHeight / 2;
  //console.log(currentY)
  for (let i = 0; i < teamPlayers.length; i++) {
    let player = teamPlayers[i];
    let jerseyX = x + padding;
    let jerseyY = currentY - rowHeight / 2;
    //console.log(jerseyY)
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
  textFont('Futura');
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

function addMatchDate(t, x, y, w, h, color) {
    addBox(x, y, w, h, color);
    fill(255);
    textSize(32); // Küçük font boyutu
    textAlign(CENTER, CENTER);
    text(t, x + w / 2, y + h / 2 + textAscent() / 2-10);
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