var blocks = [];
var blocks2 = [];
var balls = [];
var balls2 = [];

var img = [];
var platform;

/* mode:0 = start画面  mode:1 = play画面　mode:2 = gameover画面　mode:3 = introduce画面　mode:4 = bgchange画面　mode:5 = howto1画面　mode:6 = howto2画面*/
let mode = 0;
let bg = Math.floor(Math.random() * 4); // 0から3までのランダムな整数を取得
let seconds = 5;
let ika_x = 200;
let ika_y = 20;
let score = 0;

let sence;
let k;
let p;
let r;
let i;

/*画像のpreload*/
function preload() {
  for (i=0; i<=23; i++) {
    img[i]=loadImage('images/'+i+'.png');
  }
}

function setup() {
  createCanvas(600, 600);

  noStroke();

  matter.init();
  
  platform = matter.makeBarrier(width/2, 500, 300, 30, {
  friction :
    5000
  });
}

function draw() {
  start();
}

// play画面 mode = 1
function start() {
  if (mode == 0) {
    drawStartScreen();
  } else if (mode == 3) {
    introduce();
  } else if (mode == 4) {
    bgchange();
  } else if (mode == 5) {
    howto1();
  } else if (mode == 6) {
    howto2();
  } else { //play画面の描写
    cursor();
    background(127);
    if (bg == 0) {
      image(img[4], 0, 0, 600, 600);
    } else if (bg == 1) {
      image(img[8], 0, 0, 600, 600);
    } else if (bg == 2) {
      image(img[10], 0, 0, 600, 600);
    } else {
      image(img[23], 0, 0, 600, 600);
    }

    image(img[1], 160, 520, 80, 80);   //左右ボタンの配置
    /* image(img[2], 260, 520, 80, 80); */
    image(img[3], 360, 520, 80, 80);

    //Score表示
    textSize(50);
    fill(255);
    stroke(0);
    strokeWeight(3);
    text("SCORE:"+score, 150, 50);

    fill(0, 0, 0, 200);
    noStroke();
    platform.show();

    fill(0, 0, 130, 100);

    timer();  //タイマー

    // イカを中央に描く
    image(img[0], ika_x, ika_y, 200, 200);

    stroke(255, 255, 255, 100);
    //四角の生成
    for (var i = blocks.length - 1; i >= 0; i--) {
      var b = blocks[i];
      fill(0, 0, 0, 50);
      b.show();
      image(img[14], b.getPositionX()-25, b.getPositionY()-30, 50, 50);
      if (b.isOffCanvas()) {
        mode = 2;
        matter.forget(b);
        blocks.splice(i, 1);
      }
    }

    stroke(255, 255, 255, 100);
    for (var o = blocks2.length - 1; o >= 0; o--) {
      var b2 = blocks2[o];
      fill(0, 0, 0, 50);
      b2.show();
      image(img[0], b2.getPositionX()-40, b2.getPositionY()-45, 80, 80);
      if (b2.isOffCanvas()) {
        mode = 2;
        matter.forget(b2);
        blocks2.splice(o, 1);
      }
    }

    stroke(255, 255, 255, 100);
    //丸の生成(富山県)
    for (var j = balls.length - 1; j >= 0; j--) {
      var ba = balls[j];
      fill(0, 0, 0, 50);
      ba.show();
      image(img[6], ba.getPositionX()-25, ba.getPositionY()-25, 50, 50);
      if (ba.isOffCanvas()) {
        mode = 2;
        matter.forget(ba);
        balls.splice(j, 1);
      }
    }

    stroke(255, 255, 255, 100);
    //丸の生成(ますずし)
    for (var g = balls2.length - 1; g >= 0; g--) {
      var ba2 = balls2[g];
      fill(0, 0, 0, 50);
      ba2.show();
      image(img[5], ba2.getPositionX()-20, ba2.getPositionY()-23, 40, 40);
      if (ba2.isOffCanvas()) {
        mode = 2;
        matter.forget(ba2);
        balls2.splice(g, 1);
      }
    }

    if (mode == 2) {
      sence = 1;
      drawGameoverScreen()
    }

    //ボタンクリックでイカ移動
    if ((keyIsPressed && keyCode == LEFT_ARROW) || mouseIsPressed && (240 > mouseX) &&
      (mouseX > 160) && (600 > mouseY) && (mouseY > 520)) {
      button1 = false;
      ika_x -= 10;
      if (ika_x < -50) {
        ika_x = -50;
      }
      button1 = 1;
    }

    if ((keyIsPressed && keyCode == RIGHT_ARROW) || mouseIsPressed && (440 > mouseX) &&
      (mouseX > 360) && (600 > mouseY) && (mouseY > 520)) {
      button3 = false;
      ika_x += 10;
      if (ika_x > 400) {
        ika_x = 400;
      }
      button3 = 1;
    }
  }
}


//ENTERキーの入力で落下&タイマーを5秒にセット
function keyPressed() {
  p = random(0, 1);
  if ((seconds < 5) && (keyCode == ENTER)) {
    if (p < 0.35) {
      blocks.push(matter.makeBlock(ika_x + 100, 140, random(20, 80), random(20, 80)));
    } else if (0.35 < p && p < 0.7) {
      blocks2.push(matter.makeBlock(ika_x + 100, 140, random(20, 80), random(20, 80)));
    } else if (0.7 < p && p < 0.85) {
      balls2.push(matter.makeBall(ika_x + 100, 140, random(30, 60), random(30, 60), {
      friction:
        5000
      }
      ));
    } else {
      balls.push(matter.makeBall(ika_x + 100, 140, random(30, 50), random(30, 50), {
      friction :
        5000
      }
      ));
    }

    seconds = 5;
    if (sence != 1) {
      score ++;
    }
  }
}

//5秒後に落下&タイマーを5秒に再セット
function timer() {

  noStroke();
  textAlign(CENTER, 10);
  textSize(50);
  stroke(0);
  strokeWeight(3);
  fill(255);

  //タイム表示
  text('Time:'+seconds, 430, 50)

    if (frameCount % 60 == 0) {
    seconds--;
  }

  if (seconds == 0) {
    k = random(0, 1);
    if (k < 0.35) {
      blocks.push(matter.makeBlock(ika_x + 100, 140, random(20, 80), random(20, 80)));
    } else if (0.35 < k && k < 0.7) {
      blocks2.push(matter.makeBlock(ika_x + 100, 140, random(20, 80), random(20, 80)));
    } else if (0.7 < k && k < 0.85) {
      balls2.push(matter.makeBall(ika_x + 100, 140, random(30, 50), random(30, 50), {
      friction:
        5000
      }
      ));
    } else {
      balls.push(matter.makeBall(ika_x + 100, 140, random(30, 50), random(30, 50), {
      friction :
        5000
      }
      ));
    }

    seconds = 5;
    if (sence != 1) {
      score ++;
    }
  }
}

//スタート画面の表示 mode = 0
function drawStartScreen() {
  background(0);
  stroke(255, 255, 255, 100);
  strokeWeight(3);
  noCursor();

  if ((mode == 0) && ((mouseX > (width/2)-90) && (mouseX < (width/2)+90) && (mouseY >(height / 2)+40) && (mouseY < (height / 2)+80))) {
    fill(255);
    rect((width / 2)-80, (height / 2)+40, 160, 40);
    textSize(25);
    fill(129, 184, 255);
    text("クリック！", width / 2, (height / 2) + 60);
  } else {
    fill(50);
    rect((width / 2)-80, (height / 2)+40, 160, 40);
    textSize(25);
    fill(255);
    text("スタート！", width / 2, (height / 2) + 60);
  }

  fill(255);
  textAlign(CENTER, CENTER); // 横に中央揃え ＆ 縦にも中央揃え

  textSize(50);
  text("まうんてんとやま", width / 2, height / 2); // 画面中央にテキスト表示

  //introduce画面へのボタン mode=3
  if ((mode == 0) && ((mouseX > 40) && (mouseX < 160) && (mouseY > 80) && (mouseY < 120))) {
    fill(255);
    rect(40, 80, 120, 40);
    textSize(25);
    fill(129, 184, 255);
    text("紹介画面", 100, 100);
  } else {
    fill(50);
    rect(40, 80, 120, 40);
    textSize(25);
    fill(255);
    text("紹介画面", 100, 100);
  }

  if ((mode == 0) && ((mouseX > 440) && (mouseX < 560) && (mouseY > 80) && (mouseY < 120))) {
    fill(255);
    rect(440, 80, 120, 40);
    textSize(25);
    fill(129, 184, 255);
    text("背景選択", 500, 100);
  } else {
    fill(50);
    rect(440, 80, 120, 40);
    textSize(25);
    fill(255);
    text("背景選択", 500, 100);
  }

  // イカをカーソルの位置に描く
  image(img[0], mouseX-50, mouseY-20, 100, 100);

  if ((mode == 0) && (keyIsPressed && keyCode == ENTER || (mouseIsPressed && (mouseX > (width/2)-90) && (mouseX < (width/2)+90) && (mouseY >(height / 2)+40) && (mouseY < (height / 2)+80)))) {
    mode = 1;
  }
  if ((mode == 0) && (mouseIsPressed &&(mouseX > 40) && (mouseX < 160) && (mouseY > 80) && (mouseY < 120))) {
    mode = 3;
  }
  if ((mode == 0) && (mouseIsPressed &&(mouseX > 440) && (mouseX < 560) && (mouseY > 80) && (mouseY < 120))) {
    mode = 4;
  }
}

// ゲームオーバー画面 mode = 2
function drawGameoverScreen() {
  background(0);
  noCursor();

  //もう一度行う play画面への移動
  if ((mouseX > 210) && (mouseX < 390) && (mouseY > 440) && (mouseY < 480)) {
    fill(255);
    rect(220, 440, 160, 40);
    textSize(25);
    fill(129, 184, 255);
    text("最初に戻る", 300, 460);
  } else {
    fill(50);
    rect(220, 440, 160, 40);
    textSize(25);
    fill(255);
    text("最初に戻る", 300, 460);
  }


  fill(255);
  textSize(50);
  text("GAME OVER", width / 2, height / 2); // 画面中央にテキスト表示

  textSize(25);
  if (score == 1) {
    text("Scoreは0です", width / 2, (height/2)-60);
  } else {
    text("Scoreは"+ (score - 1)+"です", width / 2, (height/2)-60);
  }

  // イカをカーソルの位置に描く
  image(img[0], mouseX-50, mouseY-20, 100, 100);

  //「最初に戻る」を押したときの処理
  if ((keyIsPressed && keyCode == LEFT_ARROW)||(mouseIsPressed && ((mouseX > 210) && (mouseX < 390)) && ((mouseY > 440) && (mouseY < 480)))) {
    mode = 1;
    sence = 0;
    start();
    window.location.reload(); //初期化的な処理
  }
}


//introduce画面の表示 mode = 3
function introduce() {
  background(0);
  noCursor();
  stroke(255, 255, 255, 100);

  textSize(30);
  text("紹介画面", 310, 30);

  fill(255, 255, 255, 100);
  rect(150, 60, 150, 150);
  rect(150, 240, 150, 150);
  rect(150, 420, 150, 150);
  rect(320, 60, 150, 150);
  rect(320, 240, 150, 150);
  rect(320, 420, 150, 150);

  image(img[9], 150, 60, 150, 150);
  image(img[5], 150, 240, 150, 150);
  image(img[4], 150, 420, 150, 150);
  image(img[8], 320, 60, 150, 150);
  image(img[0], 290, 220, 200, 200);
  image(img[10], 320, 420, 150, 150);

  if ((mode == 3) && !((mouseX > 150) && (mouseX < 300) && (mouseY > 60) && (mouseY < 210))) {
    fill(0, 0, 0, 100);
    rect(150, 60, 150, 150);
  }
  if ((mode == 3) && !((mouseX > 150) && (mouseX < 300) && (mouseY > 240) && (mouseY < 390))) {
    fill(0, 0, 0, 100);
    rect(150, 240, 150, 150);
  }
  if ((mode == 3) && !((mouseX > 150) && (mouseX < 300) && (mouseY > 420) && (mouseY < 570))) {
    fill(0, 0, 0, 100);
    rect(150, 420, 150, 150);
  }
  if ((mode == 3) && !((mouseX > 320) && (mouseX < 470) && (mouseY > 60) && (mouseY < 210))) {
    fill(0, 0, 0, 100);
    rect(320, 60, 150, 150);
  }
  if ((mode == 3) && !((mouseX > 320) && (mouseX < 470) && (mouseY > 240) && (mouseY < 390))) {
    fill(0, 0, 0, 100);
    rect(320, 240, 150, 150);
  }
  if ((mode == 3) && !((mouseX > 320) && (mouseX < 470) && (mouseY > 420) && (mouseY < 570))) {
    fill(0, 0, 0, 100);
    rect(320, 420, 150, 150);
  }

  noStroke();
  image(img[12], 530, 530, 50, 50);
  if ((mode == 3) && (mouseX > 530) && (mouseX < 580) && (mouseY > 530) && (mouseY < 580)) {
    textSize(12);
    fill(255);
    text("未完成の\n部分があります…", 540, 500);
    fill(0);
    rect(530, 530, 50, 50);
    image(img[12], 525, 525, 60, 60);
  }



  //高岡大仏の紹介
  if ((mode == 3) && (((keyIsPressed &&keyCode == ENTER) || mouseIsPressed) && (mouseX > 150) && (mouseX < 300) && (mouseY > 60) && (mouseY < 210))) {
    image(img[13], 0, 50, 600, 550);
  }
  if ((mode == 3) && ((keyIsPressed &&keyCode == ENTER) || mouseIsPressed)&&((mouseX > 150) && (mouseX < 300) && (mouseY > 240) && (mouseY < 390))) {
    image(img[16], 0, 50, 600, 550);
  }
  if ((mode == 3) && ((keyIsPressed &&keyCode == ENTER) || mouseIsPressed)&&((mouseX > 150) && (mouseX < 300) && (mouseY > 420) && (mouseY < 570))) {
    image(img[19], 0, 50, 600, 550);
  }
  if ((mode == 3) && ((keyIsPressed &&keyCode == ENTER) || mouseIsPressed)&&((mouseX > 320) && (mouseX < 470) && (mouseY > 60) && (mouseY < 210))) {
    image(img[15], 0, 50, 600, 550);
  }
  if ((mode == 3) && ((keyIsPressed &&keyCode == ENTER) || mouseIsPressed)&&((mouseX > 320) && (mouseX < 470) && (mouseY > 240) && (mouseY < 390))) {
    image(img[18], 0, 50, 600, 550);
  }
  if ((mode == 3) && ((keyIsPressed &&keyCode == ENTER) || mouseIsPressed)&&((mouseX > 320) && (mouseX < 470) && (mouseY > 420) && (mouseY < 570))) {
    image(img[17], 0, 50, 600, 550);
  }

  if ((mode == 3) && ((mouseX > 440) && (mouseX < 560) && (mouseY > 10) && (mouseY < 50))) {
    fill(255);
    rect(440, 10, 120, 40);
    textSize(25);
    fill(129, 184, 255);
    text("操作方法", 500, 30);
  } else {
    fill(50);
    rect(440, 10, 120, 40);
    textSize(25);
    fill(255);
    text("操作方法", 500, 30);
  }

  if ((mode == 3) && ((keyIsPressed &&keyCode == ENTER) || mouseIsPressed)&&((mouseX > 440) && (mouseX < 560) && (mouseY > 10) && (mouseY < 50))) {
    mode = 5;
  }


  fill(255);
  textAlign(CENTER, CENTER); // 横に中央揃え ＆ 縦にも中央揃え

  if ((mode == 3) && (mouseX > 10) && (mouseX < 50) && (mouseY > 10) && (mouseY < 50)) {
    image(img[7], 10, 10, 40, 40);
  } else {
    image(img[1], 10, 10, 40, 40);
  }

  // イカをカーソルの位置に描く
  image(img[0], mouseX-50, mouseY-20, 100, 100);

  if ((mode == 3) && (keyIsPressed && keyCode ==  LEFT_ARROW || (mouseIsPressed && (mouseX > 10) && (mouseX < 50) && (mouseY > 10) && (mouseY < 50)))) {
    mode = 0;
  }
}

//背景選択画面　mode = 4
function bgchange() {
  background(0);
  noCursor();

  textSize(30);
  text("背景選択", 310, 30);

  fill(255, 255, 255, 100);
  rect(80, 100, 200, 200);
  rect(320, 100, 200, 200);
  rect(80, 340, 200, 200);
  rect(320, 340, 200, 200);

  image(img[4], 80, 100, 200, 200);
  image(img[8], 320, 100, 200, 200);
  image(img[10], 80, 340, 200, 200);
  image(img[23], 320, 340, 200, 200);

  //背景の変更
  if ((mode == 4) && (((keyIsPressed &&keyCode == ENTER) || mouseIsPressed) && (mouseX > 80) && (mouseX < 280) && (mouseY > 100) && (mouseY < 300))) {
    bg = 0;
  }
  if ((mode == 4) && ((keyIsPressed &&keyCode == ENTER) || mouseIsPressed)&&((mouseX > 320) && (mouseX < 520) && (mouseY > 100) && (mouseY < 300))) {
    bg = 1;
  }
  if ((mode == 4) && ((keyIsPressed &&keyCode == ENTER) || mouseIsPressed)&&((mouseX > 80) && (mouseX < 280) && (mouseY > 340) && (mouseY < 540))) {
    bg = 2;
  }
  if ((mode == 4) && ((keyIsPressed &&keyCode == ENTER) || mouseIsPressed)&&((mouseX > 320) && (mouseX < 520) && (mouseY > 340) && (mouseY < 540))) {
    bg = 3;
  }

  if ((mode == 4) && bg == 0) {
    fill(0, 0, 0, 100);
    rect(320, 100, 200, 200);
    rect(80, 340, 200, 200);
    rect(320, 340, 200, 200);
  }
  if ((mode == 4) && bg == 1) {
    fill(0, 0, 0, 100);
    rect(80, 100, 200, 200);
    rect(80, 340, 200, 200);
    rect(320, 340, 200, 200);
  }
  if ((mode == 4) && bg == 2) {
    fill(0, 0, 0, 100);
    rect(80, 100, 200, 200);
    rect(320, 100, 200, 200);
    rect(320, 340, 200, 200);
  }
  if ((mode == 4) && bg == 3) {
    fill(0, 0, 0, 100);
    rect(80, 100, 200, 200);
    rect(80, 340, 200, 200);
    rect(320, 100, 200, 200);
  }

  fill(255);
  textAlign(CENTER, CENTER); // 横に中央揃え ＆ 縦にも中央揃え

  if ((mode == 4) && (mouseX > 10) && (mouseX < 50) && (mouseY > 10) && (mouseY < 50)) {
    image(img[7], 10, 10, 40, 40);
  } else {
    image(img[1], 10, 10, 40, 40);
  }

  // イカをカーソルの位置に描く
  image(img[0], mouseX-50, mouseY-20, 100, 100);

  if ((mode == 4) && (keyIsPressed && keyCode ==  LEFT_ARROW || (mouseIsPressed && (mouseX > 10) && (mouseX < 50) && (mouseY > 10) && (mouseY < 50)))) {
    mode = 0;
  }
}

// howto1 mode = 5
function howto1() {
  background(0);
  noCursor();

  image(img[20], 0, 20, 600, 550);

  textSize(20);

  if ((mode == 5) && (mouseX > 10) && (mouseX < 180) && (mouseY > 45) && (mouseY < 65)) {
    fill(129, 184, 255);
    text("< 紹介画面に戻る", 100, 55);
    fill(255);
    text("1", 300, 570);
    fill(129, 184, 255);
    text("—", 300, 580);
    fill(255);
    text("2", 350, 570);
  } else if ((mode == 5) && (mouseX > 340) && (mouseX < 360) && (mouseY > 560) && (mouseY < 580)) {
    fill(255);
    text("< 紹介画面に戻る", 100, 55);
    text("1", 300, 570);
    fill(129, 184, 255);
    text("—", 300, 580);
    fill(129, 184, 255);
    text("2", 350, 570);
    fill(255);
    textSize(12);
    text("2へ移動", 350, 550);
  } else {
    fill(255);
    text("< 紹介画面に戻る", 100, 55);
    text("1", 300, 570);
    fill(129, 184, 255);
    text("—", 300, 580);
    fill(255);
    text("2", 350, 570);
  }

  // イカをカーソルの位置に描く
  image(img[0], mouseX-50, mouseY-20, 100, 100);

  if ((mode == 5) && (keyIsPressed && keyCode ==  LEFT_ARROW || (mouseIsPressed && (mouseX > 30) && (mouseX < 180) && (mouseY > 45) && (mouseY < 65)))) {
    mode = 3;
  }
  if ((mode == 5) && (keyIsPressed && keyCode ==  RIGHT_ARROW || (mouseIsPressed && (mouseX > 290) && (mouseX < 310) && (mouseY > 560) && (mouseY < 580)))) {
    mode = 5;
  }
  if ((mode == 5) && (keyIsPressed && keyCode ==  RIGHT_ARROW || (mouseIsPressed && (mouseX > 340) && (mouseX < 360) && (mouseY > 560) && (mouseY < 580)))) {
    mode = 6;
  }
}

// howto2 mode = 6
function howto2() {
  background(0);
  noCursor();

  image(img[21], 0, 20, 600, 550);

  textSize(20);

  if ((mode == 6) && (mouseX > 10) && (mouseX < 180) && (mouseY > 45) && (mouseY < 65)) {
    fill(129, 184, 255);
    text("< 紹介画面に戻る", 100, 55);
    fill(255);
    text("1", 300, 570);
    text("2", 350, 570);
    fill(129, 184, 255);
    text("—", 350, 580);
  } else if ((mode == 6) && (mouseX > 290) && (mouseX < 310) && (mouseY > 560) && (mouseY < 580)) {
    fill(255);
    text("< 紹介画面に戻る", 100, 55);
    fill(129, 184, 255);
    text("1", 300, 570);
    fill(255);
    textSize(12);
    text("1へ移動", 300, 550);
    fill(255);
    textSize(20);
    text("2", 350, 570);
    fill(129, 184, 255);
    text("—", 350, 580);
  } else {
    fill(255);
    text("< 紹介画面に戻る", 100, 55);
    text("1", 300, 570);
    text("2", 350, 570);
    fill(129, 184, 255);
    text("—", 350, 580);
  }

  // イカをカーソルの位置に描く
  image(img[0], mouseX-50, mouseY-20, 100, 100);

  if ((mode == 6) && (keyIsPressed && keyCode ==  LEFT_ARROW || (mouseIsPressed && (mouseX > 30) && (mouseX < 180) && (mouseY > 45) && (mouseY < 65)))) {
    mode = 3;
  }
  if ((mode == 6) && (keyIsPressed && keyCode ==  RIGHT_ARROW || (mouseIsPressed && (mouseX > 290) && (mouseX < 310) && (mouseY > 560) && (mouseY < 580)))) {
    mode = 5;
  }
  if ((mode == 6) && (keyIsPressed && keyCode ==  RIGHT_ARROW || (mouseIsPressed && (mouseX > 340) && (mouseX < 360) && (mouseY > 560) && (mouseY < 580)))) {
    mode = 6;
  }
}
