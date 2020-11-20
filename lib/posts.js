import fs from "fs";
import path from "path";
import matter from "gray-matter";
import remark from "remark";
import html from "remark-html";

const postsDirectory = path.join(process.cwd(), "_posts");

export function getSortedPostsData() {
  // Get file names under /posts
  const files = getMdxFiles(postsDirectory);
  const allPostsData = files.map((file) => {
    // Remove ".md" from file name to get id
    const id = file.name.replace(/\.mdx$/, "");

    // Read markdown file as string
    const fullPath = path.join(file.path, file.name);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Combine the data with the id
    return {
      id,
      ...matterResult.data,
    };
  });

  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

function getMdxFiles(directory) {
  const dirEntries = fs.readdirSync(directory, { withFileTypes: true });
  const mdxFiles = dirEntries
    .filter((entry) => !entry.isDirectory())
    .filter((entry) => {
      return /\.mdx$/.test(entry.name);
    })
    .map((entry) => ({ path: directory, name: entry.name }));
  const directories = dirEntries.filter((entry) => entry.isDirectory());

  directories.forEach((dir) => {
    mdxFiles.push(...getMdxFiles(`${directory}/${dir.name}`));
  });

  return mdxFiles;
}

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);

  // Returns an array that looks like this:
  // [
  //   {
  //     params: {
  //       id: 'ssg-ssr'
  //     }
  //   },
  //   {
  //     params: {
  //       id: 'pre-rendering'
  //     }
  //   }
  // ]
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ""),
      },
    };
  });
}

export async function getPostData(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // Combine the data with the id
  return {
    id,
    contentHtml,
    ...matterResult.data,
  };
}
