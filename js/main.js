
let MAC_INFO;


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
  animationStartTime = 1;

  JSON_INDEX++
}

let animationStartTime = -1;  
const animationDuration = 2000; 
const toggleInterval = 150;     


function addMatchCommentary() {
  let currentColor = getMatchCommentaryColor()
  const whiteColor = { r: 255, g: 255, b: 255, a: 255 };

  if (animationStartTime !== -1) {
    let elapsed = millis() - animationStartTime;
    if (elapsed < animationDuration) {
      let phase = floor(elapsed / toggleInterval);
      currentColor = (phase % 2 === 0) ? whiteColor : { r: 25, g: 25, b: 25, a: 255 };
    } else {
      animationStartTime = -1;
      currentColor = getMatchCommentaryColor();
    }
  }
  
  fill(currentColor.r, currentColor.g, currentColor.b, currentColor.a);
  rect(MATCH_COMMENTARY_BOX_X, MATCH_COMMENTARY_BOX_Y, MATCH_COMMENTARY_BOX_WIDTH, MATCH_COMMENTARY_BOX_HEIGHT);
  addMatchCommentaryText(MAC_INFO['aksiyonlar'][JSON_INDEX]['text'])
}

function getMatchCommentaryColor() {
  color = MATCH_COMMENTARY_BOX_COLOR
  if(MAC_INFO['aksiyonlar'][JSON_INDEX]['w'] == 1) {
    color = HOME_COLOR
  } else if(MAC_INFO['aksiyonlar'][JSON_INDEX]['w'] == 2) {
    color = AWAY_COLOR
  }
  return color
}

function addMatchCommentaryText(boxText, is_black=true) {
  if (is_black) {
    fill(0, 0, 0);
  } else {
    fill(255, 255, 255);
  }
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
  HOME_COLOR = 'homeColor' in MAC_INFO['settings'] ? MAC_INFO['settings']['homeColor'] : HOME_COLOR
}