const fs = require("fs");
const simpleGit = require("simple-git");
const git = simpleGit();

const path = "./_posts/generated-mdx";
if (!fs.existsSync(path) || fs.readdirSync(path).length === 0) {
  git.clone("https://github.com/glitteringkatie/generated-mdx.git", path, [
    `--depth`,
    `1`,
  ]);
}
