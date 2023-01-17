const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs')
const multer = require('multer');

const routers = require('./src/routers/index')
const log = require('./src/middleware/log');
const notFound = require('./src/middleware/404');
const errorHandling = require('./src/middleware/errorHandling');

const app = express();
const port = 8080;

// app.use(bodyParser.json());
app.use(log);
app.use(routers);
app.use(errorHandling);
app.use(notFound);

// app.listen(port, () =>
//   console.log(`Server berjalan di http://localhost:${port}`)
// );

app.listen(port, function () {
  return console.log(`Server berjalan di http://localhost:${port}`);
});
