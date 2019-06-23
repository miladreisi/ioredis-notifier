const Redis = require("ioredis");
let defaultConfig = {
  host: "localhost",
  port: 6379,
  password: ""
};
exports.events = {
  expired: "__keyevent@0__:expired"
};

const keyEventsMap = new Map();
function messageListener(event, key) {
  console.log("messageListener");
  console.log(event, key);
  for (let [itemKey, itemValue] of keyEventsMap) {
    let regex = new RegExp(itemKey);
    let matched = regex.test(key);
    if (matched) {
      let callback = itemValue.get(event);
      callback(key, event);
    }
  }
}

module.exports.addEventListener = (key, event, callback) => {
  let events = keyEventsMap.get(key);
  if (events == undefined) {
    let eventCallbackMap = new Map();
    eventCallbackMap.set(event, callback);
    keyEventsMap.set(key, eventCallbackMap);
  } else {
    events.set(event, callback);
  }
};

let redis = null;
module.exports.init = config => {
  return new Promise((resolve, reject) => {
    try {
      if (redis) return resolve(redis);
      let newConfig = Object.assign(defaultConfig, config);
      redis = new Redis({
        host: newConfig.server,
        port: newConfig.port,
        password: newConfig.password
      });
      redis.on("ready", () => {
        redis.config("SET", "notify-keyspace-events", "Ex");
        redis.on("message", messageListener);
        redis.subscribe("__keyevent@0__:expired");
        resolve(redis);
      });
    } catch (error) {
      reject(error);
    }
  });
};
