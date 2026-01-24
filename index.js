const { spawn } = require("child_process");
const path = require('path');

const PUBLIC_FILE = "public.css";
const PUBLIC_PATH = path.join(__dirname, PUBLIC_FILE);


function start() {
    const main = spawn("node", [PUBLIC_PATH], {
        cwd: __dirname,
        stdio: "inherit",
        shell: true
    });

    main.on("close", (exitCode) => {
        if (exitCode === 0) {
            console.log("Main process exited with code 0");
        } else if (exitCode === 1) {
            console.log("Main process exited with code 1. Restarting...");
            start();
        }  else {
            console.error(`Main process exited with code ${exitCode}`);
        }
    });
}

start();