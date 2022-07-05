import * as document from "document";
import * as messaging from "messaging";
import { me as device } from "device";
import clock from "clock";
import { memory } from "system";
import { battery } from "power";
import * as util from "../common/utils";


battery.onchange = (charger, evt) => {
  console.log(Math.floor(battery.chargeLevel) + "%");
}


/*
        VARIABLES
        
*/

var enemy = -1;
var gameNamePriv = -1;
var locationPriv = -1;
var gameNamePub = -1;
var locationPub = -1;
var idPub = -1;
//device dimensions used for conversion
var MAP_HEIGHT;
var MAP_WIDTH;

//measure time spent in app
var start_time;
var end_time;
var flag = 0;

let bodyShootout = {
  1: "head",
  2: "body",
  3: "left arm",
  4: "right arm",
  5: "left leg",
  6: "right leg"
}

let damageRecord = [];
let damageRecordP = [];

var attempts;
var alreadyTimeout;

/*

         GET OBJECTS

*/
let bg = document.getElementById("background1");
let map = document.getElementById("background2");
let env = document.getElementById("background3");


let buttonStart = document.getElementById("button1");
let buttonCancel = document.getElementById("button2");

let list = document.getElementById("myList");

let txt1 = document.getElementById("text1");
let txt2 = document.getElementById("text2");
let txt3 = document.getElementById("text3");
let txt4 = document.getElementById("text4");
let txt5 = document.getElementById("text5");


let botEnemy1 = document.getElementById("bot1");
let botEnemy2 = document.getElementById("bot2");
let botTeam1 = document.getElementById("bot3");
let botTeam2 = document.getElementById("bot4");

let target = document.getElementById("target");
let listGames = document.getElementById("myListGames");

const clockLabel = document.getElementById("clock-label");

var demoinstance = document.getElementById("demoinstance");
var demogroup = demoinstance.getElementById("demogroup");

let character = demogroup.getElementById("character");

let bullet = document.getElementById("bullet")
let bullet1 = document.getElementById("bullet1")
let bullet2 = document.getElementById("bullet2")
let bullet3 = document.getElementById("bullet3")
let bullet4 = document.getElementById("bullet4")
let bullet5 = document.getElementById("bullet5")
let bullet6 = document.getElementById("bullet6")
let bullet7 = document.getElementById("bullet7")
let bullet8 = document.getElementById("bullet8")
let bullet9 = document.getElementById("bullet9")

/* every player has maximum 10 bullets */
let bullets = [bullet, bullet1, bullet2, bullet3, bullet4, bullet5, bullet6, bullet7, bullet8, bullet9]

/* elements used for alert animation */
let box = document.getElementById("roomBox");
let textBox = document.getElementById("txt4");
let grp = document.getElementById("grp");



clock.granularity = "seconds"; // seconds, minutes, hours

clockLabel.style.display = "none";

clock.addEventListener("tick", (evt) => {
  if (flag == 0) {
    start_time = evt.date.toTimeString().slice(0, -4);
    flag = 1;
  }
  if (flag == 4) {
    end_time = evt.date.toTimeString().slice(0, -4);
    flag = 3;
  }
  clockLabel.text = evt.date.toTimeString().slice(0, -4);
});



if (!device.screen) device.screen = { width: 348, height: 250 };

MAP_HEIGHT = device.screen.height;
MAP_WIDTH = device.screen.width;



/*
         HANDLE EVENTS
    If you have problems with event listeners(receiving more data than usual ) just add
    a removeEventListener before addEventListener.

*/

function handleEvent(evt) {
  var b = evt.data["pass"]
  var a = [...evt.data["list"]]
  JoinPrivateGame(a, b)
}
function handleEvent2(evt) {
  var b = evt.data["pass"]
  var a = [...evt.data["list"]]
  console.log(b);
  JoinOnlineGamePAux(a, b)
}
function handleEvent3(evt) {
  var b = evt.data["idr"]
  var a = [...evt.data["list1"]]
  console.log(b);
  JoinOnlineGamePAux(a, b)
}

function handleEvent4(evt) {
  var win1 = evt.data.win1;
  var win2 = evt.data.win2;

  var flagEnd = -1;
  var flagLost = -1;
  console.log(ch);
  if (win1 !== undefined && win2 !== undefined) {
    if (enemy == 2) {
      if (win1 == 0 && win2 == 1) {
        console.log("Player 1 lost");
        hideElements();
        txt4.style.display = "inline";
        txt4.text = "Team 1 lost";
        flagLost = 1;
      }
      else if (win1 == 1 && win2 == 0) {
        console.log("Player 1 won");
        hideElements();
        txt4.style.display = "inline";
        flagEnd = 1;
      }
    }
    else {
      if (win1 == 1 && win2 == 0) {
        console.log("Player 2 lost");
        hideElements();
        txt5.style.display = "inline";
        txt5.text = "Team 2 lost";
        flagLost = 1;
      }
      else if (win1 == 0 && win2 == 1) {
        console.log("Player 2 won");
        hideElements();
        txt5.style.display = "inline";
        flagEnd = 1;
      }
      console.log("end is : " + flagEnd);
      console.log("lost is : " + flagLost);
    }
    if (flagLost == 1) {
      var winner = 0;
      if (enemy == 1) {
        winner = 1;
      }
      else {
        winner = 2;
      }
      sleep(5000).then(() => {
        if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
          messaging.peerSocket.send({
            command: util.COMMAND_GAME_OVER,
            gameName: gameNamePriv,
            location: locationPriv,
            winner: winner,
            enemy: enemy
          });

        }
        hideElements();
        list.style.display = "inline";
      });
    }
    else if (flagEnd == 1) {
      var winner = 0
      if (enemy == 1) {
        winner = 2;
      }
      else {
        winner = 1;
      }
      sleep(5000).then(() => {
        if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
          messaging.peerSocket.send({
            command: util.COMMAND_GAME_OVER,
            gameName: gameNamePriv,
            location: locationPriv,
            winner: winner,
            enemy: enemy
          });

        }
        hideElements();
        list.style.display = "inline";

      });
    }


  }
}
function handleEvent5(evt) {
  var win1 = evt.data.win1P;
  var win2 = evt.data.win2P;
  var flagEnd = -1;
  var flagLost = -1;
  if (win1 !== undefined && win2 !== undefined) {

    if (enemy == 2) {
      if (win1 == 0 && win2 == 1) {
        console.log("Player 1 lost");
        hideElements();
        txt4.style.display = "inline";
        txt4.text = "Team 1 lost";
        flagLost = 1;
      }
      else if (win1 == 1 && win2 == 0) {
        console.log("Player 1 won");
        hideElements();
        txt4.style.display = "inline";
        flagEnd = 1;
      }
    }
    else {
      if (win1 == 1 && win2 == 0) {
        console.log("Player 2 lost");
        hideElements();
        txt5.style.display = "inline";
        txt5.text = "Team 2 lost";
        flagLost = 1;
      }
      else if (win1 == 0 && win2 == 1) {
        console.log("Player 2 won");
        hideElements();
        txt5.style.display = "inline";
        flagEnd = 1;
      }
      console.log("end is : " + flagEnd);
      console.log("lost is : " + flagLost);
    }
    if (flagLost == 1) {
      var winner = 0;
      if (enemy == 1) {
        winner = 1;
      }
      else {
        winner = 2;
      }
      sleep(5000).then(() => {
        if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
          messaging.peerSocket.send({
            command: util.COMMAND_GAME_OVER,
            gameName: gameNamePub,
            location: locationPub,
            winner: winner,
            enemy: enemy,
            id: idPub
          });

        }
        hideElements();
        list.style.display = "inline";


      });
    }
    else if (flagEnd == 1) {
      var winner = 0
      if (enemy == 1) {
        winner = 2;
      }
      else {
        winner = 1;
      }
      sleep(5000).then(() => {
        if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
          messaging.peerSocket.send({
            command: util.COMMAND_GAME_OVER,
            gameName: gameNamePub,
            location: locationPub,
            winner: winner,
            enemy: enemy,
            id: idPub
          });

        }
        hideElements();
        list.style.display = "inline";


      });
    }

  }
}


/*


         FUNCTIONS

*/




/* Conversion from (lat,lon) to (x,y) */
function convertLL(lat, lon) {
  var y = ((-1 * lat) + 90) * (MAP_HEIGHT / 180);
  var x = (lon + 180) * (MAP_WIDTH / 360);
  if (y < 0) {
    y = 0;
  }
  if (x < 0) {
    x = 0;
  }
  return { x: x, y: y };
}

/* set enemy based on current player */
function setEnemy(id) {
  if (id == 1) {
    enemy = 2;
  }
  else if (id == 2) {
    enemy = 1;
  }
}

/* damage based on bullet coordinates */
function damageControl(x, y, i, game, location = -1, randPart = -1) {

  var hs = 0;
  var damage;
  var guessed = 0;
  console.log("X is " + x);
  console.log("Y is " + y);

  var guess = bodyShootout[randPart];
  console.log(guess);
  if ((x >= 153 && x <= 182) && (y >= 109 && y <= 138) && guess == "head") {


    damage = 60;
    hs = 1;
    guessed = 1;
  }
  else if ((x >= 158 && x <= 179) && (y >= 146 && y <= 182) && guess == "body") {

    guessed = 1;
    damage = 30;
  }
  else if ((x >= 183 && x <= 192) && (y >= 144 && y <= 195) && guess == "right arm") {


    guessed = 1;
    damage = 10;
  }
  else if ((x >= 131 && x <= 151) && (y >= 143 && y <= 161) && guess == "left arm") {


    guessed = 1;
    damage = 10;
  }
  else if ((x >= 154 && x <= 167) && (y >= 185 && y <= 247) && guess == "left leg") {

    damage = 15;
    guessed = 1;

  }
  else if ((x >= 167 && x <= 184) && (y >= 185 && y <= 247) && guess == "right leg") {

    damage = 15;
    guessed = 1;

  }

  var number = 10 - i - 1;
  txt3.text = number.toString();
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send({
      command: util.COMMAND_SHOT,
      gameName: game,
      dmg: damage,
      enemy: enemy,
      guessed: guessed,
      location: location
    });

  }
  if (guessed == 1) {
    damageRecord.push(damage);

    bullets[i].x = x - 65;
    bullets[i].y = y - 5;
    bullets[i].style.display = "inline";
    console.log("JS memory: " + memory.js.used + "/" + memory.js.total);
    gameNamePriv = game;
    locationPriv = location;
    messaging.peerSocket.removeEventListener("message", handleEvent4);
    messaging.peerSocket.addEventListener("message", handleEvent4);
  }
  return i;
}
/* ammo added to the player if the damage he accomplished
is not enough to win the game */
function reload(damageRecord) {
  var sum = 0;
  for (let i = 0; i < damageRecord.length; i++) {
    sum += damageRecord[i];
  }
  if (sum < 100) {
    return 1
  }
  return 0
}


/* damage based on bullet coordinates */
function damageControlPublic(x, y, i, game, location = -1, randPart = -1, idGame = -1) {

  var hs = 0;
  var damage;
  var guessed = 0;
  console.log("X is " + x);
  console.log("Y is " + y);

  var guess = bodyShootout[randPart];
  console.log(guess);
  if ((x >= 153 && x <= 182) && (y >= 109 && y <= 138) && guess == "head") {


    damage = 60;
    hs = 1;
    guessed = 1;
  }
  else if ((x >= 158 && x <= 179) && (y >= 146 && y <= 182) && guess == "body") {

    guessed = 1;
    damage = 30;
  }
  else if ((x >= 183 && x <= 192) && (y >= 144 && y <= 195) && guess == "right arm") {


    guessed = 1;
    damage = 10;
  }
  else if ((x >= 131 && x <= 151) && (y >= 143 && y <= 161) && guess == "left arm") {


    guessed = 1;
    damage = 10;
  }
  else if ((x >= 154 && x <= 167) && (y >= 185 && y <= 247) && guess == "left leg") {

    damage = 15;
    guessed = 1;

  }
  else if ((x >= 167 && x <= 184) && (y >= 185 && y <= 247) && guess == "right leg") {

    damage = 15;
    guessed = 1;

  }

  var number = 10 - i - 1;
  txt3.text = number.toString();

  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send({
      command: util.COMMAND_SHOT,
      gameName: game,
      dmg: damage,
      enemy: enemy,
      id: idGame,
      guessed: guessed,
      location: location
    });

  }
  if (guessed == 1) {
    damageRecordP.push(damage);

    bullets[i].x = x - 65;
    bullets[i].y = y - 5;
    bullets[i].style.display = "inline";
    console.log("JS memory: " + memory.js.used + "/" + memory.js.total);
    gameNamePub = game;
    locationPub = location;
    idPub = idGame;
    messaging.peerSocket.removeEventListener("message", handleEvent5);
    messaging.peerSocket.addEventListener("message", handleEvent5);

  }

  return i;
}
/* ammo added to the player if the damage he accomplished
is not enough to win the game */
function reloadP(damageRecordP) {
  var sum = 0;
  for (let i = 0; i < damageRecordP.length; i++) {
    sum += damageRecordP[i]
  }
  if (sum < 100) {
    return 1
  }
  return 0
}




/* hide all objects needed for future screens */
function hideElements() {
  bg.style.display = "none";
  map.style.display = "none";
  env.style.display = "none";
  buttonStart.style.display = "none";
  list.style.display = "none";
  buttonCancel.style.display = "none";
  txt1.style.display = "none";
  txt2.style.display = "none";
  txt3.style.display = "none";
  txt4.style.display = "none";
  txt5.style.display = "none";
  botEnemy1.style.display = "none";
  botEnemy2.style.display = "none";
  botTeam1.style.display = "none";
  botTeam2.style.display = "none";
  target.style.display = "none";
  listGames.style.display = "none";
  character.style.display = "none";
  box.style.display = "none";
  textBox.style.display = "none";
  for (let i = 0; i < bullets.length; i++) {
    bullets[i].width = 100;
    bullets[i].width = 100;
    bullets[i].style.display = "none";
  }
}



/*function to render the gameplay */
function Gameplay(game, location, id = -1) {
  hideElements();

  env.style.display = "inline";
  env.width = 300;
  env.height = 300;
  env.x = 12;
  txt3.style.display = "inline";
  txt3.text = "10";

  character.style.display = "inline";
  console.log("JS memory: " + memory.js.used + "/" + memory.js.total);
  var i = 0;
  character.onclick = function (evt) {

    var flag1;
    var guessPart = util.randNum(6);
    console.log(guessPart);
    if (location == 2)
      flag1 = damageControl(evt.screenX, evt.screenY, i, game, location, guessPart)
    else
      flag1 = damageControlPublic(evt.screenX, evt.screenY, i, game, location, guessPart, id)
    if (flag1 < 9) {
      i = i + 1;
    }
    else if (reload(damageRecord) == 1 || reload(damageRecordP)) {
      i = 0;
      txt3.text = "10";
      for (let i = 0; i < bullets.length; i++) {
        bullets[i].style.display = "none";
      }
    }

  }



}


function JoinOnlineGameAux(typeGame, gameName = -1, flagGame = -1, id = -1) {

  if (typeGame == 2) {
    if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
      messaging.peerSocket.send({
        command: util.COMMAND_JOIN_PRIV,
        gameName: gameName
      });

    }
  }
  else if (typeGame == 3) {
    if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
      messaging.peerSocket.send({
        command: util.COMMAND_JOIN_PUB,
        gameName: gameName,
        idGame: id
      });
    }



  }


  if (flagGame == -1) {
    JoinRealGame(gameName, typeGame, id);
  }

}

function JoinRealGame(gameName, typeGame, id = -1) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send({
      command: util.COMMAND_GAME_POSITION
    });
  }
  /* for every screen I send a message so I can check out on the companion what should I do */
  messaging.peerSocket.addEventListener("message", (evt) => {
    var obj = convertLL(evt.data["latitude"], evt.data["longitude"])
    JoinOnlineGame(obj.x, obj.y, -1, -1, -1);


  });
  sleep(3000).then(() => {
    if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
      messaging.peerSocket.send({
        command: util.COMMAND_ATTACK_CHOICE
      });
    }
    messaging.peerSocket.addEventListener("message", (evt) => {
      JoinOnlineGame(0, 0, evt.data["index"], gameName, typeGame, id);
    });
  });

}

/* sleep function needed for loading screen */
function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

/* Join Online Game menu where we set the map and we wait for
the companion to choose spawn point */

function JoinOnlineGame(x, y, z = -1, game = -1, typeGame = -1, id = -1) {
  var i;
  if (z == -1) {
    hideElements();
    txt2.text = "Wait for teammate to choose";
    map.style.display = "inline";
    txt2.style.display = "inline";
    map.width = 300;
    map.height = 300;
    map.x = 12;
    botEnemy1.style.display = "inline";
    botEnemy2.style.display = "inline";
    botTeam1.style.display = "inline";
    botTeam2.style.display = "inline";
    botTeam1.cx = 50;
    botTeam1.cy = 50;
    botTeam2.cx = 70;
    botTeam2.cy = 70;
  }
  else {
    console.log("z: " + z);
    txt2.text = "Loading";
    buttonCancel.style.display = "none";
    botEnemy1.style.display = "inline";
    botEnemy2.style.display = "inline";
    botTeam1.style.display = "inline";
    botTeam2.style.display = "inline";
    target.style.display = "inline";
    if (z <= 2 && z != 0) {
      if (z == 1) {
        target.cx = botTeam1.cx;
        target.cy = botTeam1.cy;
      }
      else if (z == 2) {
        target.cx = botTeam2.cx;
        target.cy = botTeam2.cy;
      }
      sleep(3000).then(() => {
        Gameplay(game, typeGame, id);
      })

    }

  }


}
/* Create Private Game menu where we write into the Firebase Database
username and password of the newly created game */
function CreatePrivateGame() {
  buttonCancel.addEventListener("click", (evt) => {
    hideElements();
    list.style.display = "inline";
  });
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send({
      command: util.COMMAND_CREATE_PRIVATE_GAME
    });
  }

}




/* Auxiliary function to gather the password for the specific game and
the list of all games created to send it to the main stage */
function JoinPrivateGameAux() {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send({
      command: util.COMMAND_JOIN_ONLINE_GAME,
      location: 2
    });
  }
  messaging.peerSocket.removeEventListener("message", handleEvent);
  messaging.peerSocket.addEventListener("message", handleEvent);
}

function JoinOnlineGameLobbyAux() {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send({
      command: util.COMMAND_JOIN_ONLINE_GAME,
      location: 3
    });
  }
  messaging.peerSocket.removeEventListener("message", handleEvent2);
  messaging.peerSocket.addEventListener("message", handleEvent2);
}

function JoinOnlineGamePAux(games, id) {
  if (attempts < 0) {
    hideElements();
    list.style.display = "inline";
    if (alreadyTimeout == 0) {
      console.log("JS memory: " + memory.js.used + "/" + memory.js.total);
      if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
        messaging.peerSocket.send({
          command: util.COMMAND_GAME_TIMEOUT,
          idGame: id
        });
      }
      alreadyTimeout = 1;

      main();
    }
  }
  else {
    var flagJoin;
    for (let i = 0; i < games.length; i++) {

      if (id == games[i][1]["id"]) {
        if (games[i][1]["nr_players"] == undefined && games[i][1]["flag"] == undefined) {
          flagJoin = 1;
          setEnemy(1);
          if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
            messaging.peerSocket.send({
              command: "flag",
              flagId: flagJoin,
              gameName: games[i][0],
              location: 3,
              idGame: id
            });
          }
          waitingP(games[i][0], flagJoin, 6, id, games);
        }
        else if (games[i][1]["nr_players"] == undefined && enemy == 2) {
          console.log("attempts left:" + attempts);
          attempts--;
          flagJoin = 1;
          waitingP(games[i][0], flagJoin, -1, id, games);
        }
        else if (games[i][1]["nr_players"] && enemy == 2) {
          JoinOnlineGameAux(-1, games[i][0], -1, id);
        }
        else if (games[i][1]["nr_players"] == undefined && games[i][1]["flag"]) {
          setEnemy(2);
          flagJoin = 2;
          waitingP(games[i][0], -1, flagJoin, id, games);

        }

      }
    }
  }
}

function waitingP(gameName, flag1, flag2 = -1, id = -1, games = -1) {

  if (flag1 == 1) {
    hideElements();
    txt2.style.display = "inline";
    txt2.text = "Waiting for player";
    if (flag2 == 6) {
      JoinOnlineGameAux(3, gameName, 2, id);
    }
    sleep(5000).then(() => {
      if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
        messaging.peerSocket.send({
          command: util.COMMAND_GAME_CHECK,
          idGame: id
        });
      }
      messaging.peerSocket.removeEventListener("message", handleEvent3);
      messaging.peerSocket.addEventListener("message", handleEvent3);
    });
  }
  if (flag2 == 2) {

    JoinOnlineGameAux(3, gameName, -1, id);

  }
}

/*Join Private Game where we have a list of all games and we need to choose
only the one with the right password given */
function JoinPrivateGame(games, password) {
  let NUM_ELEMS = 100;
  hideElements();
  listGames.style.display = "inline";
  console.log("JS memory: " + memory.js.used + "/" + memory.js.total);
  listGames.delegate = {
    getTileInfo: (index) => {
      if (index == 0)
        return {
          type: "my-pool",
          value: "Return",
          index: index
        };
      else if (index <= games.length)
        return {
          type: "my-pool",
          value: games[index - 1][1]["name"],
          index: index
        };
      else
        return {

          type: "my-pool",
          value: "Item",
          index: index
        };
    },
    configureTile: (tile, info) => {
      tile.getElementById("text").text = `${info.value} ${info.index}`;
      let touch = tile.getElementById("touch");
      var flagJoin;
      touch.onclick = function (evt) {
        if (info.value != "Item") {
          if (info.value == "Return") {
            hideElements();
            list.style.display = "inline";
          }
          else {


            if (password == games[info.index - 1][1]["pass"]) {
              console.log(games[info.index - 1][1]["flag"]);
              if (games[info.index - 1][1]["nr_players"] == undefined && games[info.index - 1][1]["flag"] == undefined) {
                flagJoin = 1;
                setEnemy(1);
                if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
                  messaging.peerSocket.send({
                    command: "flag",
                    flagId: flagJoin,
                    gameName: games[info.index - 1][0],
                    location: 2
                  });
                }
                waiting(games[info.index - 1][0], flagJoin);
              }
              else if (games[info.index - 1][1]["nr_players"] == undefined && games[info.index - 1][1]["flag"]) {
                setEnemy(2);
                flagJoin = 2;
                waiting(games[info.index - 1][0], 1, flagJoin);

              }
              else if (games[info.index - 1][1]["nr_players"]) {
                console.log("room is full");
                box.style.display = "inline";
                textBox.style.display = "inline";
                grp.animate("enable");
                setTimeout(() => {
                  grp.animate("disable");
                  box.style.display = "none";
                  textBox.style.display = "none";
                  grp.style.display = "none";
                }, 3000);

              }

            }
          }
        }
      };
    }
  };

  // length must be set AFTER delegate
  listGames.length = NUM_ELEMS;
}



function waiting(gameName, flag1, flag2 = -1) {
  if (flag2 == 2 || flag1 == 1) {
    JoinOnlineGameAux(2, gameName);
  }
}
/* Statistics menu where we send the command to the companion alongside the new timestamp
that needs to be updated in the companion app*/
function Statistics() {
  hideElements();
  buttonCancel.style.display = "inline";
  txt1.style.display = "inline";
  console.log("JS memory: " + memory.js.used + "/" + memory.js.total);
  buttonCancel.addEventListener("click", (evt) => {
    hideElements();
    list.style.display = "inline";
  });

  var start, end, final_time = 0;
  if (start_time != null && end_time != null) {
    console.log(start_time);
    console.log(end_time);
    start = util.convertTime(start_time)
    end = util.convertTime(end_time)
    final_time = end - start;

  }

  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send({
      command: util.COMMAND_STATISTICS,
      time: final_time
    });
  }
}

function OptionsAux() {
  hideElements();
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send({
      command: util.COMMAND_OPTIONS
    });
  }

  messaging.peerSocket.addEventListener("message", (evt) => {
    var a = evt.data["enemy_color"];
    var b = evt.data["team_color"];
    hideElements();
    Options(a, b);
  });

}

/*Options menu where we gather changes made by the user from the companion
into the device */
function Options(enemy_c, team_c) {
  hideElements();
  buttonCancel.style.display = "inline";
  txt1.style.display = "inline";
  console.log("JS memory: " + memory.js.used + "/" + memory.js.total);
  buttonCancel.addEventListener("click", (evt) => {
    hideElements();
    list.style.display = "inline";
  });
  botEnemy1.style.fill = team_c;
  botEnemy2.style.fill = team_c;
  botTeam1.style.fill = enemy_c;
  botTeam2.style.fill = enemy_c;

}




/* App Master */
function main() {
  console.log("JS memory: " + memory.js.used + "/" + memory.js.total);
  hideElements();
  buttonStart.style.display = "inline";
  bg.style.display = "inline";
  messaging.peerSocket.addEventListener("open", (evt) => {
    console.log("Ready to send or receive messages");

  });
  console.log("JS memory: " + memory.js.used + "/" + memory.js.total);
  buttonStart.addEventListener("click", (evt) => {

    if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
      messaging.peerSocket.send({
        command: util.COMMAND_USERNAME
      });
    }
    buttonStart.style.display = "none";
    bg.style.display = "none";
    list.style.display = "inline";
    enemy = -1;
    damageRecord = [];

    attempts = 3;
    alreadyTimeout = 0;
    damageRecordP = [];
    console.log("JS memory: " + memory.js.used + "/" + memory.js.total);
    let items = list.getElementsByClassName("list-item");


    items.forEach((element, index) => {
      let touch = element.getElementById("touch");
      touch.onclick = function (evt) {
        hideElements();
        list.style.display = "none";
        buttonCancel.style.display = "inline";
        switch (element.text) {
          case "Join Online Game":

            JoinOnlineGameLobbyAux();
            break;
          case "Create Private Game":
            txt1.style.display = "inline";
            CreatePrivateGame();
            break;
          case "Join Private Game":

            JoinPrivateGameAux();

            break;
          case "Statistics":
            txt1.style.display = "inline";
            flag = 4;
            Statistics();
            break;
          case "Options":
            txt1.style.display = "inline";
            OptionsAux();
            break;
          default:
            hideElements();
            buttonStart.style.display = "inline";
            bg.style.display = "inline";

            break;
        }
      };

    });

  });

}


main();