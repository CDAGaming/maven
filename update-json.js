/**
 * Node.js script to update the version and version-devel json files
 * Usage: node update-json
 * Author: Deftware
 */

const fs = require('fs');
const path = require('path');

function updateJsonFile(file) {
    let content = JSON.parse(fs.readFileSync(file));
    Object.keys(content).forEach(version => {
        let subsystem = content[version].subsystem;
        let dir = `./me/deftware/${subsystem ? 'EMC-F' : 'EMC'}/`;
        let latestVersion = 0;
        fs.readdirSync(dir).filter(f => fs.statSync(path.join(dir, f)).isDirectory()).forEach(p => {
            if (!p.includes("latest")) {
                let dirVersion = p.split("-")[1];
                if (p.includes("Pre")) {
                    dirVersion += `-${p.split("-")[2]}`
                }
                if (dirVersion === version) {
                    p = parseInt(p.split("-")[0].replace(/\./g, ""));
                    if (p > latestVersion) {
                        latestVersion = p;
                    }
                }
            }
        });
        latestVersion = latestVersion.toString();
        latestVersion = `${latestVersion.substring(0, 2)}.${latestVersion.substring(2, 3)}.${latestVersion.substring(3)}-${version}`;
        content[version].version = latestVersion;
    });
    fs.writeFile(file, `${JSON.stringify(content, null, 2)}\n`, function (err) {
        if (err) {
            return console.log(err);
        }
        console.log(`Updated ${file}`);
    });
}

updateJsonFile('./versions.json');
updateJsonFile('./versions-devel.json');