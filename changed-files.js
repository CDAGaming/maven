const cgf = require("changed-git-files");
cgf((err, results) => {
    console.log(results);
});