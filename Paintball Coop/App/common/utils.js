/* conversion from hh:mm:ss to ss */
export function convertTime(timestamp) {

  var seconds = parseInt(timestamp.slice(6, 8))
  var minutes = parseInt(timestamp.slice(3, 5)) * 60
  var hours = parseInt(timestamp.slice(0, 2)) * 3600
  return hours + minutes + seconds;
}

/* conversion from ss to hh:mm:ss */
export function convertToTime(seconds) {
  var date = new Date(null);
  date.setSeconds(seconds); // specify value for SECONDS here
  var result = date.toISOString().substr(11, 8);
  return result;
}

/* conversion for companion */
export function convertTimetoString(timestamp) {
  var stringTime = timestamp.slice(0, 2) + " hours , " + timestamp.slice(3, 5) + " minutes , " + timestamp.slice(6, 8) + " seconds";
  return stringTime;
}

/* from percent to decimal */
export function toDecimal(percent) {
  console.log("Percent is :" + percent)
  console.log("Decimal is :" + (parseFloat(percent) / 100))
  return parseFloat(percent) / 100;
}

/* from decimal to percent */
export function toPercent(number) {
  console.log("without percent is : " + number)
  number = number * 100
  console.log(" in percent this is : " + number)
  return number.toString() + "%";
}

/*generate a rand number*/
export function randNum(maximum) {
  return Math.floor(Math.random() * maximum + 1);
}




/* commands from device */
export let COMMAND_USERNAME = "usernameID";
export let COMMAND_OPTIONS = "opt";
export let COMMAND_STATISTICS = "stats";
export let COMMAND_JOIN_ONLINE_GAME = "join";
export let COMMAND_CREATE_PRIVATE_GAME = "create";
export let COMMAND_GAME_POSITION = "game";
export let COMMAND_ATTACK_CHOICE = "choose";
export let COMMAND_JOIN_PRIV = "priv";
export let COMMAND_JOIN_PUB = "pub";
export let COMMAND_SHOT = "shot";
export let COMMAND_GAME_OVER = "over";
export let COMMAND_GAME_TIMEOUT = "timeout";
export let COMMAND_GAME_CHECK = "gameCheck";


/* keys from settings API */
export let KEY_USERNAME = "username";
export let KEY_UserID = "userID";
export let KEY_OAUTH2 = "oauth";
export let KEY_TIME = "time";
export let KEY_NR_GAMES = "nr_games";
export let KEY_PERC_WINS = "perc_wins";
export let KEY_GS_RATE = "gs_rate";
export let KEY_TEAM_COLOR = "myColor";
export let KEY_ENEMY_COLOR = "myColor1";
export let KEY_PRIVATE_GAME_NAME = "userGame";
export let KEY_PRIVATE_GAME_PASS = "passGame";
export let KEY_PRIVATE_GAME_JOIN_PASS = "passtext";
export let KEY_ENEMY_INDEX = "enemyIndex";
export let KEY_NR_BULLETS = "nr_bullets";


/* locations for Web API */
export let PRIVATE_GAMES_DATABASE = "https://fitbit-games-default-rtdb.europe-west1.firebasedatabase.app/PrivateGames";
export let PUBLIC_GAMES_DATABASE = "https://fitbit-games-default-rtdb.europe-west1.firebasedatabase.app/PublicGames";
export let USERS_DATABASE = "https://fitbit-games-default-rtdb.europe-west1.firebasedatabase.app/Users";
export let ACTIVE_PRIVATE_GAMES_DATABASE = "https://fitbit-games-default-rtdb.europe-west1.firebasedatabase.app/ActivePrivateGames";
export let ACTIVE_PUBLIC_GAMES_DATABASE = "https://fitbit-games-default-rtdb.europe-west1.firebasedatabase.app/ActivePublicGames";
