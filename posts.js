import WPFetch from "./WPFetch";
//import { matchSorter } from "match-sorter";
//import sortBy from "sort-by";

export var baseName     = '';
export var appName      = '';
       var wordpressUrl = '';

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.0/8 are considered localhost for IPv4.
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

if (isLocalhost) {

  // Use wordpress server on a site setup for testing.

  baseName     = '/'
  appName      = import.meta.env.VITE_WORDPRESS_SITE
  wordpressUrl = import.meta.env.VITE_WORDPRESS_HOST + '/' + appName

//  this is old, before switching from React to Vite
//  appName      = process.env.REACT_APP_WORDPRESS_SITE
//  wordpressUrl = process.env.REACT_APP_WORDPRESS_HOST + '/' + appName

} else {

  // Use wordpress server that served this app

  // Last two components of pathname are baseName for the Router
  const pos1   = window.location.href.lastIndexOf('/',
                 window.location.href.lastIndexOf('/',
                 window.location.href.lastIndexOf('/')-1)-1)
  const pos2   = window.location.href.lastIndexOf('/')
  baseName     = window.location.href.substr( pos1, pos2 - pos1 + 1 )

  // First component of baseName is appName
  appName      = baseName.substr(1,
                 baseName.lastIndexOf('/',
                 baseName.lastIndexOf('/')-1)-1)

  wordpressUrl = window.location.href.substr(0,
                 window.location.href.lastIndexOf('/',
                 window.location.href.lastIndexOf('/')-1))
}

console.log('baseName: '     + baseName)
console.log('appName: '      + appName)
console.log('wordpressUrl: ' + wordpressUrl)

var wpFetch = new WPFetch(wordpressUrl)

export async function getPosts(query) {
  console.log('getPosts()');
  let posts = await wpFetch.Posts();
//  if (!posts) posts = [];
  console.log(posts);
//  console.log(query);
//  if (query) {
//    posts = matchSorter(posts, query, { keys: ["title.rendered", "content.rendered"] });
//  }
//  return posts.sort(sortBy("last", "createdAt"));
  return posts;
}

export async function createPost() {
  console.log('createPost()');
  let post = await wpFetch.Create(
    'New post',
    'Put your content here',
    null);
  await wpFetch.deleteFromCache('wp-json', '/wp-json/wp/v2/posts')
  if (!post) throw new Error("New post not created", null);
  return post ?? null;
}

export async function getPost(id) {
  const post = await wpFetch.Post(id)
  console.log(post);
  return post ?? null;
}

export async function updatePost(id, updates) {
  console.log('updatePost() id=' + id);
//  console.log(updates);
  let post = await wpFetch.Update(
    id,
    updates.title,
    updates.content);
  await wpFetch.deleteFromCache('wp-json', '/wp-json/wp/v2/posts')
  await wpFetch.deleteFromCache('wp-json', '/wp-json/wp/v2/posts/' + id)
  if (!post) throw new Error("No post found for", id);
  return post ?? null;
}

export async function updatePostMeta(id, updates) {
  console.log('updatePostMeta() id=' + id);
//  console.log(updates);
  let post = await wpFetch.UpdateMeta(
    id,
    updates.favorite);
  await wpFetch.deleteFromCache('wp-json', '/wp-json/wp/v2/posts')
  await wpFetch.deleteFromCache('wp-json', '/wp-json/wp/v2/posts/' + id)
  if (!post) throw new Error("No post found for", id);
  return post ?? null;
}

export async function deletePost(id) {
  console.log('deletePost() id=' + id);
  let post = await wpFetch.Delete( id );
  await wpFetch.deleteFromCache('wp-json', '/wp-json/wp/v2/posts')
  await wpFetch.deleteFromCache('wp-json', '/wp-json/wp/v2/posts/' + id)
  if (!post) throw new Error("No post found for", id);
  return post ?? null;
}

export async function getAuthor(id) {
  console.log('getAuthor() id=' + id)
  const author = await wpFetch.Author(id);
  return author ?? null;
}

export async function getMedia(id) {
  console.log('getMedia() id=' + id)
  const media = await wpFetch.Media(id);
  console.log(media);
  return media ?? null;
}
