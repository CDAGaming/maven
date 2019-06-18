/**
 * Node.js script to update the latest version of all libraries
 * Usage: node update-latest
 * Author: Deftware
 */

const fs = require('fs');
const path = require('path');
const blacklist = ["subsystem", "optifabric"];

function readdirSync(p, a = []) {
    if (fs.statSync(p).isDirectory()) {
        fs.readdirSync(p).map(f => readdirSync(a[a.push(path.join(p, f)) - 1], a))
    }
    return a;
};

function getPathDirs(dir) {
    return fs.readdirSync(dir).filter(f => fs.statSync(path.join(dir, f)).isDirectory());
}

let latestPaths = [];

// Find all files that have a latest folder
readdirSync(__dirname).forEach(p => {
    if (!p.includes(".git")) {
        if (fs.statSync(p).isDirectory()) {
            p = p.replace(/\\/g, "/");
            let lastEntry = p.split("/")[p.split("/").length - 1];
            let fileName = p.split("/")[p.split("/").length - 2];
            if ((lastEntry === "latest" || lastEntry.startsWith("latest-") || lastEntry.endsWith("-latest")) && !blacklist.includes(fileName)) {
                latestPaths.push({
                    path: `${p}/`,
                    parent: p.substring(0, p.length - lastEntry.length),
                    lastEntry,
                    fileName,
                    latestVersion: ""
                })
            }
        }
    }
});

// Find the latest version for each file
latestPaths.forEach(p => {
    let latestVersion = 0,
        dir = "";
    getPathDirs(p.parent).forEach(version => {
        if (!version.includes("latest")) {
            let dirVersion = parseInt((version.includes("-") ? version.split("-")[0] : version).replace(/\./g, ""));
            let type = version.includes("-") ? version.split("-")[1] : "",
                pType = p.lastEntry.includes("-") ? p.lastEntry.split("-")[1] : "";
            if (dirVersion > latestVersion && type == pType) {
                latestVersion = dirVersion;
                dir = version;
            }
        }
    });
    p.latestVersion = dir;
});

// Update the files
latestPaths.forEach(p => {
    let jarFile = `${p.parent}${p.latestVersion}/${p.fileName}-${p.latestVersion}.jar`, sha1 = `${jarFile}.sha1`;
    let newJarFile =  `${p.parent}${p.lastEntry}/${p.fileName}-${p.lastEntry}.jar`, newSha1 = `${newJarFile}.sha1`;
    fs.unlinkSync(newJarFile);
    fs.unlinkSync(newSha1);
    fs.copyFileSync(jarFile, newJarFile);
    fs.copyFileSync(sha1, newSha1);
    console.log(`Updated ${p.fileName}/${p.lastEntry} to version ${p.latestVersion}`);
});
