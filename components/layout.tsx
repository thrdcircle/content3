import React, { useState, useEffect } from 'react';
import Header from './header';
import Footer from './footer';
import DevTools from './devtools';
import { HeaderProps, FooterProps, PageProps, Posts, ChilderenProps, Entry, NavLinks, Links } from "../typescript/layout";

export default function Layout({
  header,
  footer,
  page,
  blogPost,
  blogList,
  entries,
  children,
}: { header: HeaderProps, footer: FooterProps, page: PageProps, blogPost: Posts, blogList: Posts, entries: Entry, children: ChilderenProps }) {

  const [getLayout, setLayout] = useState({ header, footer });
  const jsonObj: any = { header, footer };
  page && (jsonObj.page = page);
  blogPost && (jsonObj.blog_post = blogPost);
  blogList && (jsonObj.blog_post = blogList);

   return (
    <>
      {header ? <Header header={getLayout.header} entries={entries} /> : ''}
      <main className='mainClass'>
        <>
        {children}
        {Object.keys(jsonObj).length && <DevTools response={jsonObj} />}
        </>
      </main>
      {footer ? <Footer footer={getLayout.footer} entries={entries} /> : ''}
    </>
  );
}
