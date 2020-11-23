import renderToString from "next-mdx-remote/render-to-string";
import hydrate from "next-mdx-remote/hydrate";
import matter from "gray-matter";
import Layout from "../../components/layout";
import {
  getAllPostSlugs,
  getPostData,
  registerSlugsToPaths,
} from "../../lib/posts";
import Head from "next/head";
import utilStyles from "../../styles/utils.module.css";
import Date from "../../components/date";

const components = {
  h2: (props) => <h2 style={{ color: "tomato" }} {...props} />,
};

export default function Post({ mdxSource, matter }) {
  const content = hydrate(mdxSource, { components });
  return (
    <Layout>
      <Head>
        <title>{matter.title}</title>
      </Head>
      <article>
        {" "}
        <h1 className={utilStyles.headingXl}>{matter.title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={matter.date} />
        </div>
        {content}
      </article>
    </Layout>
  );
}

export async function getStaticPaths() {
  const paths = getAllPostSlugs();
  registerSlugsToPaths(paths);

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const { fileContents } = await getPostData(params.slug);
  const { data, content } = matter(fileContents);
  const mdxSource = await renderToString(content, {
    components,
    scope: data,
  });
  return {
    props: {
      mdxSource,
      matter: data,
    },
  };
}
