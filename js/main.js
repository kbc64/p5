
let MAC_INFO;
let animationStartTime = -1;  
const animationDuration = 1200; 
const toggleInterval = 120;    

function preload() {
  MAC_INFO = loadJSON('./json/mac.json'); // JSON verisini yükle
}


function setup() {
  createCanvas(WIDTH, HEIGTH);
  background(220);
  Settings()
  
  setTimeout(MatchComentaryAnimation, ANIMATION_TIME)

}

function draw() {
  noStroke();
  addMatchCommentary()
  // Eğer animasyon eklemek istersen buraya kod yazabilirsin
}

function MatchComentaryAnimation() {
  setTimeout(MatchComentaryAnimation, MAC_INFO['aksiyonlar'][JSON_INDEX]['dc'] + ANIMATION_TIME)
  animationStartTime = millis()
  JSON_INDEX++
}

 


function addMatchCommentary() {
  let currentColor = getMatchCommentaryBoxColor()
  let textColor = getMatchCommentaryTextColor()
  if (animationStartTime !== -1) {
    let elapsed = millis() - animationStartTime;
    if (elapsed < animationDuration) {
      let phase = floor(elapsed / toggleInterval);
      currentColor = (phase % 2 === 0) ? getMatchCommentaryTextColor() : getMatchCommentaryBoxColor()
      textColor = (phase % 2 === 0) ? getMatchCommentaryBoxColor(): getMatchCommentaryTextColor()
    } else {
      animationStartTime = -1;
      currentColor = getMatchCommentaryBoxColor();
      textColor = getMatchCommentaryTextColor()
    }
  }
  
  fill(currentColor.r, currentColor.g, currentColor.b, currentColor.a);
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

function addMatchCommentaryText(boxText, color=false) {
  if(!color) {
    color = getMatchCommentaryTextColor();
  } else {
    color = color
  }
  
  fill(color.r, color.g, color.b, color.a)
  textSize(52);
  textFont('Futura');
  textAlign(CENTER, CENTER);
  text(boxText, HALF_X, MATCH_COMMENTARY_TEXT_Y);
}

function addBox(x, y, boxWidth, boxHeight, color) {
  fill(color.r, color.g, color.b, color.a);
  rect(x, y, boxWidth, boxHeight);
  
}

function Settings() {
  MATCH_COMMENTARY_BOX_COLOR = 'matchCommentaryBoxColor' in MAC_INFO['settings'] ? MAC_INFO['settings']['matchCommentaryBoxColor'] : MATCH_COMMENTARY_BOX_COLOR
  HOME_BOX_COLOR = 'homeBoxColor' in MAC_INFO['settings'] ? MAC_INFO['settings']['homeBoxColor'] : HOME_BOX_COLOR;
  AWAY_BOX_COLOR = 'awayBoxColor' in MAC_INFO['settings'] ? MAC_INFO['settings']['awayBoxColor'] : AWAY_BOX_COLOR;
  HOME_BOX_TEXT_COLOR = 'homeBoxTextColor' in MAC_INFO['settings'] ? MAC_INFO['settings']['homeBoxTextColor'] : HOME_BOX_TEXT_COLOR;
  AWAY_BOX_TEXT_COLOR = 'awayBoxTextColor' in MAC_INFO['settings'] ? MAC_INFO['settings']['awayBoxTextColor'] : AWAY_BOX_TEXT_COLOR;
}