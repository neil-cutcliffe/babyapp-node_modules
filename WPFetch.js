import { Component } from "react";
import WPAPI from "wpapi";

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


const wp_no_auth = new WPAPI({ endpoint: wordpressUrl + '/wp-json' })
let   wp = wp_no_auth

class WPFetch extends Component {

deleteFromCache = async ( cacheName, path ) => {
  console.log('WPFetch.deleteFromCache url=', path)
  const cache = await caches.open(cacheName);
  await cache.delete(wordpressUrl + path);
}


CheckAuth = async ( email, password ) => {
  var ret = false

  var wp_auth = new WPAPI({
    endpoint: wordpressUrl + '/wp-json',
    username: email,
    password: password,
    auth: true
  });

  if (!email) {
    let error = new Error("No email address");
    error.code = 'no_email';
    throw error;
  }
  if (!password) {
    let error = new Error("No password");
    error.code = 'no_password';
    throw error;
  }

  await wp_auth.posts().auth().get()
  .then(function( data ) {
      console.log('WPFetch.CheckAuth .then')
      console.log(data)
      wp = wp_auth
      ret = true
  })
// Let the caller catch errors
  return ret
}

CancelAuth = ( ) => {
  wp = wp_no_auth
}


Update = async ( id, t, c, f ) => {
  var ret = false
  console.log('WPFetch.Update'
                + ' id:' + id
                + ' title:'   + t
                + ' content:' + c
                + ' file:'    + f )

  await wp.posts().id( id ).update({
    'title':   t,
    'content': c
  })
  .then( function( data ) {
    console.log(data)
    ret = data
  })
// Let the caller catch errors
  return ret
}

UpdateMeta = async ( id, favorite ) => {
  var ret = false
  console.log('WPFetch.UpdateMeta'
                + ' id:' + id
                + ' favorite:'+ favorite )

  await wp.posts().id( id ).update({
    'meta':   {'_favorite': favorite}
  })
  .then( function( data ) {
    console.log(data)
    ret = data
  })
// Let the caller catch errors
  return ret
}

Delete = async ( id ) => {
  var ret = false
  console.log('WPFetch.Delete'
                + ' id:' + id )

  await wp.posts().id( id ).delete()
  .then( function( data ) {
    console.log(data)
    ret = data
  })
  .catch(function( err ) {
    console.log('WPFetch.Delete .catch')
    console.log(err)
  })
  return ret
}


Create = async ( t, c, f ) => {
  var ret
  console.log('WPFetch.Create title:' + t + ' content:' + c + ' file:' + f)
  await wp.posts().create({
      title: t,
      content: c,
      status: 'publish'
  })
  .then(async function( post ) {
    console.log('WPFetch.Create file post.id:' + post.id )
    ret = post
    if ( f ) {
      await wp.media().file( f ).create({
        title: f.name,
        post: post.id
      })
      .then( async function( media ) {
        console.log('WPFetch.Create media.id:' + media.id + ' post.id:' + post.id )
        await wp.posts().id( post.id ).update({
          featured_media: media.id
        })
        .then( function( data ) {
          console.log('WPFetch.Create update media.id:' + media.id + ' post.id:' + post.id )
          console.log(data)
        })
        .catch(function( err ) {
          console.log('WPFetch.Create update .catch')
          console.log(err)
        })
      })
      .catch(function( err ) {
          console.log('WPFetch.Create file .catch')
          console.log(err)
      })
    }
  })
  .catch(function( err ) {
      // handle error
      console.log('WPFetch.Create create .catch')
      console.log(err)
      ret = false
  })
  return ret
}

Posts = async () => {
  var ret
  await wp.posts().get()
  .then(function( data ) {
      ret = data
  })
  .catch(function( err ) {
      // handle error
      console.log('WPFetch.Posts .catch')
      console.log(err)
  })
  return ret
}

Post = async (id) => {
  var ret
  await wp.posts().id(id).get()
  .then(function( data ) {
      ret = data
  })
  .catch(function( err ) {
      // handle error
      console.log('WPFetch.Post .catch')
      console.log(err)
  })
  return ret
}

Author = async(id) => {
  var ret
  await wp.users().id(id).get()
  .then(function( data ) {
      ret = data
  })
  .catch(function( err ) {
      // handle error
      console.log('WPFetch.Author .catch')
      console.log(err)
  })
  return ret
}

Media = async (id) => {
  var ret
  await wp.media().id(id).get()
  .then(function( data ) {
      ret = data
  })
  .catch(function( err ) {
      // handle error
      console.log('WPFetch.Media .catch')
      console.log(err)
  })
  return ret
}


}
export default WPFetch;
