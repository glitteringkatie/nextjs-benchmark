const withPlugins = require("next-compose-plugins");
const nextMDX = require("@next/mdx");

module.exports = withPlugins([
  [
    nextMDX,
    {
      extension: /\.mdx?$/,
      options: {
        remarkPlugins: [],
        rehypePlugins: [],
      },
      pageExtensions: ["mdx", "js", "jsx"],
    },
  ],
  // your other plugins here
]);
