import WPFetch from "./WPFetch";
//import { matchSorter } from "match-sorter";
//import sortBy from "sort-by";

var wpFetch = new WPFetch()

export async function getPosts(query) {
  console.log('getPosts()');
  let posts = await wpFetch.Posts();
  if (!posts) posts = [];
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
  return media ?? null;
}
