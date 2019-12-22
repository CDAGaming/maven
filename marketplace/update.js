const crypto = require('crypto')
const fs = require('fs');

const sha1 = path => new Promise((resolve, reject) => {
	const hash = crypto.createHash('sha1')
	const rs = fs.createReadStream(path)
	rs.on('error', reject)
	rs.on('data', chunk => hash.update(chunk))
	rs.on('end', () => resolve(hash.digest('hex')))
});

async function run() {
    let json = {
        updated: new Date().toString(),
        mods: []
    };
    for (let dir of fs.readdirSync("./plugins/")) {
        let plugin = JSON.parse(fs.readFileSync(`./plugins/${dir}/${dir}.json`));
        let physicalFile = fs.existsSync(`./plugins/${dir}/${dir}.jar`);
        plugin.link = physicalFile ? `https://gitlab.com/EMC-Framework/maven/raw/master/marketplace/plugins/${dir}/${dir}.jar` : "";
        plugin.sha1 = physicalFile ? await sha1(`./plugins/${dir}/${dir}.jar`) : "0";
        json.mods.push(plugin);
        console.log(`Updated ${plugin.name}`);
    }
    fs.writeFileSync("./index.json", JSON.stringify(json, null, 2));
}

run();
