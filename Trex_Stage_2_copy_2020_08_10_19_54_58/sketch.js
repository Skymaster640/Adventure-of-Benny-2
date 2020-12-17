var trex, trex_running, trex_collided, Benny_Jump;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var count;

var play=1;
var end=0;
var gameState=play;

var gameOver,restart;
var gameOver_image,restart_image;


function preload(){
  trex_running = loadAnimation("Benny0.png","Benny1.png");
  trex_collided = loadImage("Benny_Down0.png");
  Benny_Jump = loadAnimation("Benny_Jump0.png");
  
  groundImage = loadImage("Background0.png");
  
  cloudImage = loadImage("Torch0.png");
  
  obstacle1 = loadImage("Ghost1.png");
  obstacle2 = loadImage("Ghost0.png");
  obstacle3 = loadImage("Hand0.png");
  obstacle4 = loadImage("Blob0.png");
  obstacle5 = loadImage("Eyeman0.png");
  obstacle6 = loadImage("Skeleton0.png");
  
  gameOver_image=loadImage("GAME OVER0.png");
  restart_image=loadImage("Try Again0.png");
}


function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(700,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided",trex_collided);
  trex.scale = 0.5;
  
  ground = createSprite(-50,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.scale=0.8;
  
  invisibleGround = createSprite(trex.x,190,900,10);
  invisibleGround.visible = true;
  
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  count = 0;
  
  gameOver=createSprite(trex.x,50,10,10);
  
  restart=createSprite(trex.x,140,10,10);
  
  gameOver.addImage("gameOver",gameOver_image);
  restart.addImage("res_button",restart_image);
  gameOver.scale=2;
  //restart.scale=0.5;
  gameOver.visible=false;
  restart.visible=false;
}

function draw() {
  background(180);
  
  trex.collide(invisibleGround);
  
  

  camera.position.x=trex.position.x;

  console.log(trex.position.x);

  
  if(gameState === play){
    //move the ground
    //ground.velocityX = -(4 + 3*count/100);
    //scoring
    count = count + Math.round(World.frameRate/60);
    trex.velocityX=3;
    invisibleGround.velocityX=3;
    gameOver.velocityX=3;
    restart.velocityX=3;
    
    /*if (ground.x < 0){
      ground.x = ground.width/2;
    }
    */
    
     //jump when the space key is pressed
    if(keyDown("space") && trex.y >= 159){
      trex.velocityY = -12 ;
      trex.addAnimation("jump",Benny_Jump);
    }
  
    //add gravity
    trex.velocityY = trex.velocityY + 0.8;
    
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles
    spawnObstacles();
    
    //End the game when trex is touching the obstacle
    if(obstaclesGroup.isTouching(trex)){
      gameState = end;
    }
  }
  
  else if(gameState === end) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    trex.position.Y=180;
    trex.velocityX=0;
    invisibleGround.velocityX=0;
    gameOver.velocityX=0;
    restart.velocityX=0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    
  }
  
  if(mousePressedOver(restart)) {
    reset();
  }
  
  drawSprites();
  fill("Green");
  text("Score: "+ count, trex.position.x + 200,50);
}


function reset(){
  gameState = play;
  
  gameOver.visible = false;
  restart.visible = false;
  trex.x=700;
  invisibleGround.x=700;
  gameOver.x=700;
  restart.x=700;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  count = 0;
  
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(trex.x + 400,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
   // cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(trex.x + 400,165,10,40);
    //obstacle.velocityX = -(4+count/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}