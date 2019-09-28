# ioredis-notifier

#Example
```javascript
const notifer = require("ioredis-notifier");
notifer.init({
    host: 'localhost',
    port: 6379,
    password: 'some-password'
  }).then(() => {
  console.log("done");

  notifer.addEventListener("myRegexSearchingForAKey.*", notifer.events.expired, (key, event) => {
    console.log("expired");
    console.log(key, event);
  });
});
```
