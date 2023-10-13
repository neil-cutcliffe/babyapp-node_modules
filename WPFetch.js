import { Component } from "react";
import WPAPI from "wpapi";


class WPFetch extends Component {

constructor(wordpressUrl) {
  super();
  this.wordpressEndpoint = wordpressUrl + '/wp-json';
  this.wp_no_auth = new WPAPI({ endpoint: this.wordpressEndpoint });
  this.wp = this.wp_no_auth
}


deleteFromCache = async ( cacheName, path ) => {
  console.log('WPFetch.deleteFromCache url=', path)
  const cache = await caches.open(cacheName);
  await cache.delete(this.wordpressEndpoint + path);
}


CheckAuth = async ( email, password ) => {
  var ret = false

  var wp_auth = new WPAPI({
    endpoint: this.wordpressEndpoint,
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
      this.wp = wp_auth
      ret = true
  })
// Let the caller catch errors
  return ret
}

CancelAuth = ( ) => {
  this.wp = this.wp_no_auth
}


Update = async ( id, t, c, f ) => {
  var ret = false
  console.log('WPFetch.Update'
                + ' id:' + id
                + ' title:'   + t
                + ' content:' + c
                + ' file:'    + f )

  await this.wp.posts().id( id ).update({
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

  await this.wp.posts().id( id ).update({
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

  await this.wp.posts().id( id ).delete()
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
  await this.wp.posts().create({
      title: t,
      content: c,
      status: 'publish'
  })
  .then(async function( post ) {
    console.log('WPFetch.Create file post.id:' + post.id )
    ret = post
    if ( f ) {
      await this.wp.media().file( f ).create({
        title: f.name,
        post: post.id
      })
      .then( async function( media ) {
        console.log('WPFetch.Create media.id:' + media.id + ' post.id:' + post.id )
        await this.wp.posts().id( post.id ).update({
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
  await this.wp.posts().get()
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
  await this.wp.posts().id(id).get()
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
  await this.wp.users().id(id).get()
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
  await this.wp.media().id(id).get()
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
