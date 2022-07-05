import { settingsStorage } from "settings";
import * as messaging from "messaging";
import { me as companion } from "companion";
import { geolocation } from "geolocation";
import * as util from "../common/utils";






let enemy = -1;
function setEnemy(id) {
  enemy = id;
}


settingsStorage.onchange = function (evt) {
  console.log(JSON.parse(evt.newValue).name);

}



/*generate data for firebase public games */
/*for (let k = 1 ; k <= 30 ; k++){
  var obj = {
id : k
  }
  doWrite(JSON.stringify(obj),4);
}
*/


/*Gather data from public Fitbit profile using userId and authorization provided by Google OAuth and write it into Firebase */
function doThis(userId, authorization) {
  var url = "https://api.fitbit.com/1/user/" + userId + "/profile.json";

  var xhr = new XMLHttpRequest();
  xhr.open("GET", url);

  xhr.setRequestHeader("Authorization", `Bearer ${authorization}`);

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      console.log(xhr.status);
      console.log(xhr.responseText);
      var resp = JSON.parse(xhr.responseText)
      var obj = {
        user: resp["user"]["username"],
        id: userId
      }
      if (resp["user"]["username"]) {
        setUsername(resp["user"]["username"])
      }
      else {
        setUsername(userId);
      }

      doWrite(JSON.stringify(obj), 1);
    }
  };

  xhr.send();
}

/* send Geolocation API data to the device or return an error message */
function locationSuccess(position) {
  console.log("Latitude: " + position.coords.latitude,
    "Longitude: " + position.coords.longitude);
  var obj = {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude
  }
  sendSettingData(obj);
}

function locationError(error) {
  console.log("Error: " + error.code,
    "Message: " + error.message);

}


/* write to firebase */
function doWrite(data, location) {
  var url;
  switch (location) {
    case 0:
      url = util.PRIVATE_GAMES_DATABASE;
      break;
    case 1:
      url = util.USERS_DATABASE;
      break;
    case 2:
      url = util.ACTIVE_PRIVATE_GAMES_DATABASE;
      break;
    case 3:
      url = util.ACTIVE_PUBLIC_GAMES_DATABASE;
      break;
    case 4:
      url = util.PUBLIC_GAMES_DATABASE;
      break;
    default:
      break;
  }
  url = url + ".json";
  var xhr = new XMLHttpRequest();
  xhr.open("POST", url);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      console.log(xhr.status);
      console.log(xhr.responseText);
    }
  };

  xhr.send(data);
}



/*set username on companion */
function setUsername(name) {
  settingsStorage.setItem(util.KEY_USERNAME, name);

}
/* read from firebase + modify/delete/send_device based on modifyBit*/
function doRead(data, location, modifyBit = 0) {
  console.log(modifyBit);
  var url;
  switch (location) {
    case 0:
      url = util.PRIVATE_GAMES_DATABASE;
      break;
    case 1:
      url = util.USERS_DATABASE;
      break;
    case 2:
      url = util.ACTIVE_PRIVATE_GAMES_DATABASE;
      break;
    case 3:
      url = util.ACTIVE_PUBLIC_GAMES_DATABASE;
      break;
    case 4:
      url = util.PUBLIC_GAMES_DATABASE;
      break;
    default:
      break;
  }
  url = url + ".json";
  var list_of_things = []
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url);

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      console.log(xhr.status);
      var response = JSON.parse(xhr.responseText);
      for (const [key, value] of Object.entries(response)) {
        list_of_things.push([key, value])
      }

      accessData(list_of_things, data, modifyBit, location)


    }
  };

  xhr.send();

}
/* delete from firebase */
function doDelete(id, location, listItems, isGame = -1) {
  var url;
  switch (location) {
    case 0:
      url = util.PRIVATE_GAMES_DATABASE;
      break;
    case 1:
      url = util.USERS_DATABASE;
      break;
    case 2:
      url = util.ACTIVE_PRIVATE_GAMES_DATABASE;
      break;
    case 3:
      url = util.ACTIVE_PUBLIC_GAMES_DATABASE;
      break;
    case 4:
      url = util.PUBLIC_GAMES_DATABASE;
      break;
    default:
      break;
  }
  console.log("isGame is : " + isGame);
  if (isGame == -1) {
    url = url + "/" + id + ".json";
  }
  else {
    url = url + "/";
    for (let i = 0; i < listItems.length; i++) {
      if (id == listItems[i][0] || id == listItems[i][1]["gameName"]) {
        url = url + listItems[i][0];
        console.log(url);
        if (listItems[i][1]["nr_players"] && location == 0)
          url = url + "/" + "nr_players";
        if (listItems[i][1]["nr_players"] && location == 4) {
          url = url + "/" + "nr_players";
        }
        url = url + ".json";
        console.log(url);
        break;
      }
    }

  }
  console.log(url);
  var flag = 0;
  var xhr = new XMLHttpRequest();
  xhr.open("DELETE", url);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      console.log(xhr.status);
      console.log(xhr.responseText);

    }
  };

  xhr.send();
}

/* delete for PublicGames */
function doDeletePublic(id, location, listItems, delHP = -1) {
  var url, url_flag;
  console.log("HP DELETION IS : " + delHP);
  switch (location) {
    case 0:
      url = util.PRIVATE_GAMES_DATABASE;
      break;
    case 1:
      url = util.USERS_DATABASE;
      break;
    case 2:
      url = util.ACTIVE_PRIVATE_GAMES_DATABASE;
      break;
    case 3:
      url = util.ACTIVE_PUBLIC_GAMES_DATABASE;
      break;
    case 4:
      url = util.PUBLIC_GAMES_DATABASE;
      break;
    default:
      break;
  }
  url = url + "/";
  for (let i = 0; i < listItems.length; i++) {

    if (id == listItems[i][1]["id"]) {
      url = url + listItems[i][0];


      if (delHP == -1) {
        if (listItems[i][1]["flag"] && location == 4) {
          url_flag = url;
          url_flag = url_flag + "/" + "flag";
          url_flag = url_flag + ".json";
          break;
        }
      }
      url = url + ".json";



    }
  }

  console.log(url)
  console.log(url_flag)


  if (delHP == -1) {
    var flag1 = 0;
    var xhr1 = new XMLHttpRequest();
    xhr1.open("DELETE", url_flag);
    xhr1.onreadystatechange = function () {
      if (xhr1.readyState === 4) {
        console.log(xhr1.status);
        console.log(xhr1.responseText);

      }
    };

    xhr1.send();
  }
  else {
    var flag = 0;
    var xhr = new XMLHttpRequest();
    xhr.open("DELETE", url);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        console.log(xhr.status);
        console.log(xhr.responseText);

      }
    };
    xhr.send();
  }

}



/* modify on firebase(game implementation) */

function doModify(data, listItems, location) {
  var url;
  var checkDmg = 0;
  switch (location) {
    case 0:
      url = util.PRIVATE_GAMES_DATABASE;
      break;
    case 1:
      url = util.USERS_DATABASE;
      break;
    case 2:
      url = util.ACTIVE_PRIVATE_GAMES_DATABASE;
      break;
    case 3:
      url = util.ACTIVE_PUBLIC_GAMES_DATABASE;
      break;
    case 4:
      url = util.PUBLIC_GAMES_DATABASE;
      break;
    default:
      break;
  }
  var j = 0;
  url = url + "/";
  for (let i = 0; i < listItems.length; i++) {

    if (data.gameName == listItems[i][1]["gameName"]) {
      if (listItems[i][1]["winner"] == 1) {
        if (location == 2) {
          if (enemy == 1) {
            var obj = {
              win1: 1,
              win2: 0
            }
            sendSettingData(obj);
            break;
          }
        }
        else {
          if (enemy == 1) {
            var obj = {
              win1P: 1,
              win2P: 0
            }
            sendSettingData(obj);
            break;
          }
        }
      }
      else if (listItems[i][1]["winner"] == 2) {
        if (location == 2) {
          if (enemy == 2) {
            var obj = {
              win1: 0,
              win2: 1
            }
            sendSettingData(obj);
            break;
          }
        }
        else {
          if (enemy == 2) {
            var obj = {
              win1P: 0,
              win2P: 1
            }
            sendSettingData(obj);
            break;
          }
        }

      }
      if (checkDmg == 0) {
        if (listItems[i][1]["user1"] == undefined) {

          data.user1 = data.user;
          data.hp1 = data.hp;
          delete data.user;
          delete data.hp;

        }
        else if (listItems[i][1]["user2"] == undefined) {
          if (data.user == listItems[i][1]["user1"]) {
            break;
          }
          data.user1 = listItems[i][1]["user1"];
          data.hp1 = listItems[i][1]["hp1"]
          data.user2 = data.user;
          data.hp2 = data.hp;
          data.nr_players = 2;

          delete data.user;
          delete data.hp;
          console.log(data)
          var obj = {
            gameName: data.gameName,
            nr_players: 2
          }

          if (location == 3) {

            var obj1 = {
              id: listItems[i][1]["id"],
              nr_players: 2
            }
            doRead(obj1, 4, 3);
          }
          else {
            doRead(obj, 0, 3);
          }
        }
        else {
          checkDmg = 1;
        }
      }
      url = url + listItems[i][0] + ".json";
      if (checkDmg == 1) {
        if (enemy == 2) {

          data.user1 = listItems[i][1]["user1"];
          data.user2 = listItems[i][1]["user2"];
          data.hp1 = listItems[i][1]["hp1"];
          data.hp2 = listItems[i][1]["hp2"] - data.hp;
          data.id = listItems[i][1]["id"]
          delete data.user;
          delete data.hp;
          if (location == 2) {
            if (data.hp2 <= 0) {
              var obj = {
                win1: 1,
                win2: 0

              }
              sendSettingData(obj);
              data.winner = "1";
              break;
            }
            else if (data.hp1 <= 0) {
              var obj = {
                win1: 0,
                win2: 1

              }
              sendSettingData(obj);
              data.winner = "2";
            }
          }
          else {
            if (data.hp2 <= 0) {
              var obj = {
                win1P: 1,
                win2P: 0

              }
              sendSettingData(obj);
              data.winner = "1";
            }
            else if (data.hp1 <= 0) {
              var obj = {
                win1P: 0,
                win2P: 1

              }
              sendSettingData(obj);
              data.winner = "2";
            }
          }


        }
        else if (enemy == 1) {

          data.user1 = listItems[i][1]["user1"];
          data.user2 = listItems[i][1]["user2"];
          data.hp2 = listItems[i][1]["hp2"]
          data.hp1 = listItems[i][1]["hp1"] - data.hp;
          data.id = listItems[i][1]["id"]
          delete data.user;
          delete data.hp;
          if (location == 2) {
            if (data.hp1 <= 0) {
              var obj = {
                win1: 0,
                win2: 1

              }
              sendSettingData(obj);
              data.winner = "2";

            }
            else if (data.hp2 <= 0) {
              var obj = {
                win1: 1,
                win2: 0

              }
              sendSettingData(obj);
              data.winner = "1";
            }
          } else {
            if (data.hp2 <= 0) {
              var obj = {
                win1P: 1,
                win2P: 0

              }
              sendSettingData(obj);
              data.winner = "1";
            }
            else if (data.hp1 <= 0) {
              var obj = {
                win1P: 0,
                win2P: 1

              }
              sendSettingData(obj);
              data.winner = "2";
            }
          }
        }
      }
    }
  }


  console.log(url);
  var xhr = new XMLHttpRequest();
  xhr.open("PUT", url);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      console.log(xhr.status);
      console.log(xhr.responseText);

    }
  };

  xhr.send(JSON.stringify(data));
}

/*modify on firebase(game matchmaking) */
function doModifyGame(data, listItems, location) {
  var url;
  switch (location) {
    case 0:
      url = util.PRIVATE_GAMES_DATABASE;
      break;
    case 1:
      url = util.USERS_DATABASE;
      break;
    case 2:
      url = util.ACTIVE_PRIVATE_GAMES_DATABASE;
      break;
    case 3:
      url = util.ACTIVE_PUBLIC_GAMES_DATABASE;
      break;
    case 4:
      url = util.PUBLIC_GAMES_DATABASE;
      break;
    default:
      break;
  }
  url = url + "/";
  for (let i = 0; i < listItems.length; i++) {
    if ((data.gameName == listItems[i][0] && location == 0) || (data.id == listItems[i][1]["id"] && location == 4)) {

      if (location == 0) {

        data.name = listItems[i][1]["name"]
        data.pass = listItems[i][1]["pass"]
        delete data.gameName;
      }
      else if (location == 4) {

        data.id = listItems[i][1]["id"]
        delete data.gameName;
      }
      url = url + listItems[i][0] + ".json";
    }
  }
  console.log(url);
  var xhr = new XMLHttpRequest();
  xhr.open("PUT", url);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      console.log(xhr.status);
      console.log(xhr.responseText);

    }
  };
  xhr.send(JSON.stringify(data));
}


/* Modify bit :
  1 - add user to the Active game(public or private)
  2 - delete old user entry after new add
  3 - add fields to check which user enters(1 or 2)
  4 - delete entries after game finished(private games)
  6 - send data for public games to device(first player
      checking if he can enter/second player enters the
      game
  7 - delete entries after game finished(public games)
  8 - check if public room is full or not based on id*/

function accessData(jsonObj, data, modifyBit, location) {
  console.log(modifyBit);
  if (modifyBit == 1)
    doModify(data, jsonObj, location);
  else if (modifyBit == 2) {
    for (let i = 0; i < jsonObj.length; i++) {
      if (data == jsonObj[i][1]["id"]) {
        doDelete(jsonObj[i][0], location, []);
        break;
      }
    }
  }
  else if (modifyBit == 3) {
    doModifyGame(data, jsonObj, location);
  }
  else if (modifyBit == 4) {
    doDelete(data.gameName, location, jsonObj, 1);

  }
  else if (modifyBit == 6) {
    console.log("am intrat pe 6");
    var obj = {
      list1: jsonObj,
      idr: data
    }
    sendSettingData(obj)
  }
  else if (modifyBit == 7) {
    if (location == 4) {
      doDeletePublic(data, location, jsonObj);
    }
    else {
      doDeletePublic(data, location, jsonObj, 1);
    }

  }
  else if (modifyBit == 8) {
    if (checkValidId(data, jsonObj) == 1) {
      var numId = util.randNum(8);
      console.log("new id is :  " + numId);
      doRead(numId, 4, 8);
    }
    else {
      doRead(data, 4);
    }
  }
  else {
    var obj = {
      list: jsonObj,
      pass: data
    }
    sendSettingData(obj)
  }
}



/*Function used to send data to the device */
function sendSettingData(data) {
  // If we have a MessageSocket, send the data to the device
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(data);
  } else {
    console.log("No peerSocket connection");
  }
}


function checkValidId(id, listItems) {
  var counter = 0;
  var exists = 0;
  for (let i = 0; i < listItems.length; i++) {
    counter++;
    if (id == listItems[i][1]["id"]) {
      exists = 1;
      if (listItems[i][1]["nr_players"])
        return 1;
    }

  }
  if (counter == listItems.length && exists == 0) {
    return 1;
  }
  return 0;
}



function MainMenu(evt) {
  if (evt.data && evt.data.command == util.COMMAND_USERNAME) {
    console.log(evt.data.command);
    var user = JSON.parse(settingsStorage.getItem(util.KEY_UserID));
    doRead(user["name"], 1, 2)
    let data = JSON.parse(settingsStorage.getItem(util.KEY_OAUTH2))
    doThis(user["name"], data.access_token)


  }
  if (evt.data && evt.data.command == util.COMMAND_STATISTICS) {
    var ex_time = settingsStorage.getItem(util.KEY_TIME);
    if (ex_time == undefined) {
      settingsStorage.setItem(util.KEY_TIME, "00:00:00");
    }
    var hs_rate = settingsStorage.getItem(util.KEY_GS_RATE)
    if (hs_rate == undefined) {
      settingsStorage.setItem(util.KEY_GS_RATE, JSON.stringify("0%"));
    }
    var nr_bullets = settingsStorage.getItem(util.KEY_NR_BULLETS);
    if (nr_bullets == undefined) {
      settingsStorage.setItem(util.KEY_NR_BULLETS, JSON.stringify("0"));
    }
    var nr_games = settingsStorage.getItem(util.KEY_NR_GAMES);
    if (nr_games == undefined) {
      settingsStorage.setItem(util.KEY_NR_GAMES, JSON.stringify("0"));
    }


    var perc_wins = settingsStorage.getItem(util.KEY_PERC_WINS);
    if (perc_wins == undefined) {
      settingsStorage.setItem(util.KEY_PERC_WINS, JSON.stringify("0%"));
    }
    ex_time = evt.data.time + util.convertTime(ex_time);
    var ex_time_date = util.convertToTime(ex_time);
    settingsStorage.setItem(util.KEY_TIME, ex_time_date);


  }
  else if (evt.data && evt.data.command == util.COMMAND_OPTIONS) {
    console.log(evt.data.command);
    var col = JSON.parse(settingsStorage.getItem(util.KEY_TEAM_COLOR));
    var col1 = JSON.parse(settingsStorage.getItem(util.KEY_ENEMY_COLOR));
    var colors = {
      team_color: col,
      enemy_color: col1
    }
    sendSettingData(colors);
  }
  else if (evt.data && evt.data.command == util.COMMAND_JOIN_ONLINE_GAME) {
    console.log(evt.data.command);
    if (evt.data.location == 3) {
      var numId = util.randNum(8);
      doRead(numId, 4, 8);
    }
    else {
      var pass = JSON.parse(settingsStorage.getItem(util.KEY_PRIVATE_GAME_JOIN_PASS))
      doRead(pass["name"], 0)
    }
  }
  else if (evt.data && evt.data.command == util.COMMAND_CREATE_PRIVATE_GAME) {
    console.log(evt.data.command);
    var name = JSON.parse(settingsStorage.getItem(util.KEY_PRIVATE_GAME_NAME))
    var pass = JSON.parse(settingsStorage.getItem(util.KEY_PRIVATE_GAME_PASS))
    var name_pass = {
      name: name["name"],
      pass: pass["name"]
    };

    doWrite(JSON.stringify(name_pass), 0);
  }
  else if (evt.data && evt.data.command == util.COMMAND_GAME_POSITION) {
    console.log(evt.data.command);
    geolocation.getCurrentPosition(locationSuccess, locationError, { timeout: 60 * 1000 });
  }
  else if (evt.data && evt.data.command == util.COMMAND_ATTACK_CHOICE) {
    console.log(evt.data.command);
    var choice = JSON.parse(settingsStorage.getItem(util.KEY_ENEMY_INDEX));
    var obj = {
      index: choice["name"]
    }
    sendSettingData(obj);
  }
  else if (evt.data && evt.data.command == util.COMMAND_JOIN_PUB) {
    var user = JSON.parse(settingsStorage.getItem(util.KEY_UserID));
    var obj = {
      user: user["name"],
      hp: 100,
      id: evt.data.idGame,
      gameName: evt.data.gameName
    }
    console.log(obj)
    doRead(obj, 3, 1);
  }
  else if (evt.data && evt.data.command == util.COMMAND_JOIN_PRIV) {
    console.log(evt.data.gameName)
    var user = JSON.parse(settingsStorage.getItem(util.KEY_UserID));
    var name = evt.data.gameName;
    var obj = {
      user: user["name"],
      gameName: name,
      hp: 100
    }
    console.log(obj)
    doRead(obj, 2, 1);
  }
  else if (evt.data && evt.data.command == util.COMMAND_SHOT) {


    var user = JSON.parse(settingsStorage.getItem(util.KEY_UserID));
    var dmg = evt.data.dmg;
    var name = evt.data.gameName;
    var enemy = evt.data.enemy;
    var id = evt.data.idGame;
    var guessed = evt.data.guessed;
    console.log(id);
    setEnemy(enemy);
    console.log(evt.data);

    var hs_rate = JSON.parse(settingsStorage.getItem(util.KEY_GS_RATE))
    var nr_bullets = JSON.parse(settingsStorage.getItem(util.KEY_NR_BULLETS));
    if (nr_bullets == "0") {
      nr_bullets = 0;
    }
    else {
      nr_bullets = parseInt(nr_bullets);
    }
    console.log(nr_bullets)
    console.log(typeof nr_bullets)
    nr_bullets++;
    var nrb = nr_bullets.toString()
    console.log(nrb)
    var rate;
    settingsStorage.setItem(util.KEY_NR_BULLETS, JSON.stringify(nrb));

    var hs_nr = util.toDecimal(hs_rate) * nr_bullets;
    hs_nr = parseInt(hs_nr);
    if (guessed == 1) {
      hs_nr = hs_nr + 1;
      hs_nr = hs_nr / nr_bullets
      hs_nr = hs_nr.toFixed(2)
      rate = util.toPercent(hs_nr)
    }
    else {
      hs_nr = hs_nr / nr_bullets
      hs_nr = hs_nr.toFixed(2)
      rate = util.toPercent(hs_nr)
    }
    settingsStorage.setItem(util.KEY_GS_RATE, JSON.stringify(rate));

    if (guessed == 1) {
      var obj = {
        user: user["name"],
        gameName: name,
        hp: dmg
      }
      if (evt.data.location == 2) {
        doRead(obj, 2, 1);
      }
      else {
        obj = {
          user: user["name"],
          gameName: name,
          hp: dmg,
          id: id
        }
        console.log(obj)
        doRead(obj, 3, 1);
      }
    }
  }
  else if (evt.data && evt.data.command == "flag") {
    var location = evt.data.location;
    console.log(location);
    var obj = {
      gameName: evt.data.gameName,
      flag: evt.data.flagId,
      id: evt.data.idGame
    }
    console.log(obj)
    var private_game = {
      gameName: evt.data.gameName
    }
    if (location == 3) {
      doWrite(JSON.stringify(private_game), 3);
      doRead(obj, 4, 3);
    }
    else {
      doWrite(JSON.stringify(private_game), 2);
      var obj1 = {
        gameName: evt.data.gameName,
        flag: evt.data.flagId
      }
      doRead(obj1, 0, 3);
    }
  }
  else if (evt.data && evt.data.command == util.COMMAND_GAME_OVER) {
    doublePress++;
    var name = evt.data.gameName;
    var location = evt.data.location;
    var winner = evt.data.winner
    var enemy = evt.data.enemy
    var id = evt.data.idGame;
    var nr_games = JSON.parse(settingsStorage.getItem(util.KEY_NR_GAMES));
    var perc_wins = JSON.parse(settingsStorage.getItem(util.KEY_PERC_WINS));
    var nr_wins = util.toDecimal(perc_wins) * nr_games;
    if (nr_games == "0") {
      nr_games = 0;
    }
    else {
      nr_games = parseInt(nr_games);
    }
    nr_games++;
    if (doublePress == 2) {
      nr_games--;
      doublePress = 0;
    }
    var nrg = nr_games.toString();
    console.log(nrg)
    settingsStorage.setItem(util.KEY_NR_GAMES, JSON.stringify(nrg));



    console.log(nr_wins);
    if ((winner == 1 && enemy == 2) || (winner == 2 && enemy == 1)) {

      nr_wins++;
      console.log(nr_wins);
      nr_wins = nr_wins / nr_games;
      nr_wins = nr_wins.toFixed(2);
      console.log("PERCENT of wins : " + nr_wins)
      perc_wins = util.toPercent(nr_wins);



    }
    else {
      nr_wins = nr_wins / nr_games;
      nr_wins = nr_wins.toFixed(2);
      perc_wins = util.toPercent(nr_wins);

    }

    settingsStorage.setItem(util.KEY_PERC_WINS, JSON.stringify(perc_wins));


    var obj = {
      gameName: name
    }
    console.log(evt.data);
    console.log(winner + "vs" + enemy);
    if (winner == enemy) {
      doRead(obj, location, 4);
      if (location == 2) {
        doRead(obj, 0, 4);
        console.log(location);

      }
      else if (location == 3) {
        doRead(obj, 4, 4);
      }
    }

  }
  else if (evt.data && evt.data.command == util.COMMAND_GAME_CHECK) {
    console.log(evt.data.command);
    doRead(evt.data.idGame, 4, 6);

  }
  else if (evt.data && evt.data.command == util.COMMAND_GAME_TIMEOUT) {
    doRead(evt.data.idGame, 3, 7);
    doRead(evt.data.idGame, 4, 7);

  }
}

function handleGlobalEvent(evt) {
  MainMenu(evt);
}

/*Actions based on messages provided by the device */
messaging.peerSocket.addEventListener("message", handleGlobalEvent);