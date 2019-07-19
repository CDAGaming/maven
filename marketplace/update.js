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
        updated: new Date().toString()
    };
    for (let dir of fs.readdirSync("./plugins/")) {
        json[dir] = JSON.parse(fs.readFileSync(`./plugins/${dir}/${dir}.json`));
        json[dir].link = `https://gitlab.com/EMC-Framework/maven/raw/master/marketplace/plugins/${dir}/${dir}.jar`;
        json[dir].sha1 = await sha1(`./plugins/${dir}/${dir}.json`);
    }
    fs.writeFileSync("./index.json", JSON.stringify(json, null, 2));
}

run();
