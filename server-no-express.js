const http = require("http");
const path = require("path");
const fs = require("fs");
const fsPromises = require("fs").promises;
const logEvents = require("./logEvents");
const EventEmmitter = require("events");
class Emmitter extends EventEmmitter {}
// initialize Object
const myEmmitter = new Emmitter();
myEmmitter.on("log", (msg, fileName) => logEvents(msg, fileName));

// define webserver port
const PORT = process.env.PORT || 3500;

const serveFile = async (filePath, contentType, response) => {
  try {
    const rawData = await fsPromises.readFile(
      filePath,
      // if image type, don't use utf8 (pics won't show)
      !contentType.includes("image") ? "utf8" : ""
    );
    const data =
      contentType === "application/json" ? JSON.parse(rawData) : rawData;
    response.writeHead(filePath.includes("404.html") ? 404 : 200, {
      "Content-Type": contentType,
    });
    response.end(
      contentType === "application/json" ? JSON.stringify(data) : data
    );
  } catch (err) {
    console.error(err);
    myEmmitter.emit("log", `${err.name}\t${err.message}`, "errorLog.txt");
    response.statusCode = 500;
    response.end();
  }
};

const server = http.createServer((req, res) => {
  console.log(`${req.method}: ${req.url}`);

  myEmmitter.emit("log", `${req.url}\t${req.method}`, "reqLog.txt");

  const extension = path.extname(req.url);

  let contentType;

  switch (extension) {
    case ".css":
      contentType = "text/css";
      break;
    case ".js":
      contentType = "text/javascript";
      break;
    case ".json":
      contentType = "application/json";
      break;
    case ".jpg":
      contentType = "image/jpeg";
      break;
    case ".png":
      contentType = "image/png";
      break;
    case ".txt":
      contentType = "text/plain";
      break;

    default:
      contentType = "text/html";
      break;
  }

  let filePath =
    contentType === "text/html" && req.url === "/"
      ? path.join(__dirname, "views", "index.html")
      : // if last letter of url is '/' look at subdirectory
      (contentType === "text/html") & (req.url.slice(-1) === "/")
      ? path.join(__dirname, "views", req.url, "index.html")
      : contentType === "text/html"
      ? path.join(__dirname, "views", req.url)
      : path.join(__dirname, req.url);
  // makes .html extension not required in browser
  if (!extension && req.url.slice(-1) !== "/") filePath += ".html";

  const fileExists = fs.existsSync(filePath);

  if (fileExists) {
    // serve the file
    serveFile(filePath, contentType, res);
  } else {
    // 404
    // 301 (redirect)
    switch (path.parse(filePath).base) {
      case "old-page.html":
        // this page has moved
        res.writeHead(301, { Location: "/new-page.html" });
        res.end();
        break;
      case "www.unknown-page.html":
        // redirect to root
        res.writeHead(301, { Location: "/" });
        res.end();
        break;
      default:
        // serve 404
        serveFile(path.join(__dirname, "views", "404.html"), "text/html", res);
    }
  }
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
