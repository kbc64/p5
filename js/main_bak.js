
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

const playerFadeDelay = 200;    // Her oyuncu için gecikme (ms)
const playerFadeDuration = 500; // Her oyuncunun fade-in süresi (ms)
const headingFadeDuration = 500; // Bölüm başlığı fade-in süresi (ms)


let homeFadeStartTime = null;
let awayFadeStartTime = null;

let homePlayers = null;
let awayPlayers = null;

function preload() {
  MAC_INFO = loadJSON('./json/mac.json');
  ballImage = loadImage("../images/ball.png");
  backgroundImage = loadImage("images/stadyum.png");
  team1Logo = loadImage("images/gs.png");  
  team2Logo = loadImage("images/fb.png");  

}


function setup() {
  createCanvas(WIDTH, HEIGTH);
  homePlayers = MAC_INFO['homePlayers']
  awayPlayers = MAC_INFO['awayPlayers']
  Settings()
 
  setTimeout(MatchComentaryAnimation, ANIMATION_TIME)
  setTimeout(triggerSquad, 1000)
  

}

function draw() {
  noStroke(); 
  background(backgroundImage);
  addMatchCommentary()
  addBox(LOGO_HOME_BOX_X, LOGO_BOX_Y, LOGO_BOX_WIDTH, LOGO_BOX_HEIGHT, HOME_BOX_COLOR);
  addBox(LOGO_AWAY_BOX_X, LOGO_BOX_Y, LOGO_BOX_WIDTH, LOGO_BOX_HEIGHT, AWAY_BOX_COLOR);
  image(team1Logo, LOGO_HOME_IMAGE_X, LOGO_IMAGE_Y, LOGO_IMAGE_WIDTH, LOGO_IMAGE_HEIGHT);  
  image(team2Logo, LOGO_AWAY_IMAGE_X, LOGO_IMAGE_Y, LOGO_IMAGE_WIDTH, LOGO_IMAGE_HEIGHT);
  addTeamName(MAC_INFO['info']['homeTeam'], HOME_NAME_X, TEAM_NAME_Y, HOME_NAME_COLOR)
  addTeamName(MAC_INFO['info']['awayTeam'], AWAY_NAME_X, TEAM_NAME_Y, AWAY_NAME_COLOR)
  addTeamScore(homeScore, SCORE_HOME_X, SCORE_TEAM_Y, SCORE_HOME_COLOR)
  addTeamScore(awayScore, SCORE_AWAY_X, SCORE_TEAM_Y, SCORE_AWAY_COLOR)
  addMatchDate(MAC_INFO['info']['matchDate'], MATCH_DATE_BOX_X, MATCH_DATE_BOX_Y, MATCH_DATE_BOX_WIDTH, MATCH_DATE_BOX_HEIGHT, MATCH_DATE_BOX_COLOR);
  addSquad()

}

function triggerSquad() {
  if (homeFadeStartTime === null) {
    homeFadeStartTime = millis();
    awayFadeStartTime = homeFadeStartTime + homePlayers.length * playerFadeDelay + 2 * headingFadeDuration;
  } 
}

function addBox(x, y, boxWidth, boxHeight, color) {
  fill(color.r, color.g, color.b, color.a);
  rect(x, y, boxWidth, boxHeight);
}

function addSquad() {
  addBox(0, MATCH_SQUAD_Y, width, HEIGTH-MATCH_SQUAD_Y, rosterRightColor);

  if (homeFadeStartTime !== null) {
    leftLogoBoxX = 0;
    logoBoxWidth = 540
    rosterHeight=800
    rightLogoBoxX = 540
    renderTeamRoster(leftLogoBoxX, MATCH_SQUAD_Y, logoBoxWidth, rosterHeight, homePlayers, rosterTextColor, homeFadeStartTime);

    renderTeamRoster(rightLogoBoxX, MATCH_SQUAD_Y, logoBoxWidth, rosterHeight, awayPlayers, rosterTextColor, awayFadeStartTime);
  }
}

function renderTeamRoster(x, y, boxWidth, boxHeight, teamPlayers, textColor, fadeStartTime) {
  let starting11 = teamPlayers
  //let starting11 = teamPlayers.slice(0, 11);
  //let substitutes = teamPlayers.slice(11);
  
  let currentY = y;
  console.log(y)
  
  //"İlk 11" başlığını animasyonla çiz (fade başlangıcı: fadeStartTime)
 
 // currentY = renderAnimatedSectionHeading(x, currentY, "İlk 11", fadeStartTime);
  
  // İlk 11 oyuncuları; başlık animasyon süresini ekleyerek başlatıyoruz:
  let startingSectionFadeStartTime = fadeStartTime + headingFadeDuration;
  currentY = renderAnimatedRosterSection(x, currentY, boxWidth, starting11, textColor, startingSectionFadeStartTime);
  
  // Hesapla: İlk 11 bölümü tamamlandığında (son oyuncu başlangıcının zamanı + süresi)
  let starting11TotalDelay = startingSectionFadeStartTime + (starting11.length - 1) * playerFadeDelay + playerFadeDuration;
  
  // "Yedekler" başlığını animasyonla çiz (fade başlangıcı: starting11TotalDelay)
  //currentY = renderAnimatedSectionHeading(x, currentY, "Yedekler", starting11TotalDelay);
  
  // Yedek oyuncularını animasyonla çizleyelim:
  //let substitutesFadeStartTime = starting11TotalDelay + headingFadeDuration;
  //currentY = renderAnimatedRosterSection(x, currentY, boxWidth, substitutes, textColor, substitutesFadeStartTime);
  
  return currentY;
}

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
  textSize(36);
  textAlign(LEFT, CENTER);
  text(headingText, x + 20, y + headingHeight / 2);
  return y + headingHeight;
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