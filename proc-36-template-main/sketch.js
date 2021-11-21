var dog,sadDog,happyDog, database;
var foodS,foodStock;
var addFood;
var foodObj;

var feed, lastFeed;


function preload(){
sadDog=loadImage("Dog.png");
happyDog=loadImage("happy dog.png");
}

function setup() {
  database = firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog = createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  feed = createButton("feed the dog");
  feed.position(900,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

}

function draw() {
  background(46,139,87);
  foodObj.display();

  fedTime = database.ref('fedTime');
  
  fedTime.on("value",function(data){
    lastFeed = data.val();
  })
  fill("Black");
  textSize(20);
  if(lastFeed >= 12) {
    text("Ultima Refeição:"+lastFeed%12+"Aa tarde/noite",200,20);
  }else if(lastFeed === 0){
    text("Ultima Refeição:12AM",200,20)
  }else{
    text("Ultima Refeição:"+lastFeed+"Da manhã",200,20)
  }
 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


function feedDog(){
  dog.addImage(happyDog);

  var foodStock = foodObj.getFoodStock();
  if(foodStock <= 0){
    foodObj.updateFoodStock(foodStock*0);
  }else{
    foodObj.updateFoodStock(foodStock-1);
  }
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    fedTime:hour()
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}
