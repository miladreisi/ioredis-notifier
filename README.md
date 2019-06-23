# ioredis-notifier


const notifer = require("./redis-notifier");
notifer.init().then(() => {
  console.log("done");

  notifer.addEventListener("voucherInfo::.*", notifer.events.expired, (key, event) => {
    console.log("expired");
    console.log(key, event);
  });
});
