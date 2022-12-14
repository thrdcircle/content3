import React, { useEffect, useState } from "react";
import moment from "moment";
import parse from "html-react-parser";
import { getPageRes, getBlogPostRes } from "../../helper";
import { onEntryChange } from "../../contentstack-sdk";
import Skeleton from "react-loading-skeleton";
import RenderComponents from "../../components/render-components";
import ArchiveRelative from "../../components/archive-relative";
import { Page, BlogPosts, PageUrl } from "../../typescript/pages";

export default function BlogPost({
  blogPost,
  page,
  pageUrl,
}: {
  blogPost: BlogPosts;
  page: Page;
  pageUrl: PageUrl;
}) {
  const [getPost, setPost] = useState({ banner: page, post: blogPost });
  async function fetchData() {
    try {
      const entryRes = await getBlogPostRes(pageUrl);
      const bannerRes = await getPageRes("/blog");
      if (!entryRes || !bannerRes) throw new Error("Status: " + 404);
      setPost({ banner: bannerRes, post: entryRes });
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    onEntryChange(() => fetchData());
  }, [blogPost]);

  const { post, banner } = getPost;
  return (
    <>
      <div className="blog-container">
        <article className="blog-detail">
          {post && post.title ? (
            <h1 {...(post.$?.title as {})}>{post.title}</h1>
          ) : (
            <h1>
              <Skeleton />
            </h1>
          )}
          
          {post && post.body ? (
            <div {...(post.$?.body as {})}>{parse(post.body)}</div>
          ) : (
            <Skeleton height={800} width={600} />
          )}
        {post && post.citations ? (
            <div {...(post.$?.citations as {})}>{parse(post.citations)}</div>
          ) : (
            <Skeleton height={800} width={600} />
          )}
        {post && post.author_note ? (
            <div {...(post.$?.author_note as {})}>
              {parse(post.author_note)}
            </div>
          ) : (
            <Skeleton height={800} width={600} />
          )}
        </article>

        {/*  <div className="blog-column-right">
          <div className="related-post">
            {banner && banner?.page_components[2].widget ? (
              <h2 {...(banner?.page_components[2].widget.$?.title_h2 as {})}>
                {banner?.page_components[2].widget.title_h2}
              </h2>
            ) : (
              <h2>
                <Skeleton />
              </h2>
            )}
            {post && post.related_post ? (
              <ArchiveRelative
                {...post.$?.related_post}
                blogs={post.related_post}
              />
            ) : (
              <Skeleton width={300} height={500} />
            )}
          </div>
        </div>*/}
      </div>
    </>
  );
}
export async function getServerSideProps({ params }: any) {
  try {
    const page = await getPageRes("/blog");
    const posts = await getBlogPostRes(`/blog/${params.post}`);
    if (!page || !posts) throw new Error("404");

    return {
      props: {
        pageUrl: `/blog/${params.post}`,
        blogPost: posts,
        page,
      },
    };
  } catch (error) {
    console.error(error);
    return { notFound: true };
  }
}
