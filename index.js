const http = require("http");
const example = require('./example')
const moment = require('moment')

const port = 8080;
const hostName = "127.0.0.1";

const server = http.createServer((req, res) => {
  const url = req.url;

  res.statusCode = 200;
  res.setHeader("Content-Type", "text/json");
  // res.write("hello world");
  if (url === "/sekolah") {
    res.write(
      JSON.stringify({
        status: "success",
        message: "response success",
        data: {
          pesan: "ini adalah route /sekolah",
            smk: example.smk,
            hari: moment().calendar(),
        },
      })
    );
  } else {
    res.write(
      JSON.stringify({
        status: "success",
        message: "response success",
        data: {
          pesan: "ini bukan route /sekolah",
        },
      })
    );
  }
  res.end();
});

server.listen(port, hostName, () => {
  console.log(`http://${hostName}:${port}/`);
});
