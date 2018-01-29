/* global, api */

'use strict';

const api = (function () {

  const BASE_URL = 'https://thinkful-list-api.herokuapp.com/briandudey';


  const getMyBookmarks = function (callback) {
    $.getJSON(`${BASE_URL}/bookmarks`, callback);
  };

  const createMyBookmark = function (title, url, desc, rating, callback) {
    const newBookmark = JSON.stringify({ 
      title: title, 
      url: url, 
      desc: desc, 
      rating: rating });
    $.ajax({
      url: `${BASE_URL}/bookmarks`,
      method: 'POST',
      contentType: 'application/json',
      data: newBookmark,
      success: callback
    });
  };

  const deleteMyBookmark = function (id, callback) {
    $.ajax({
      url: `${BASE_URL}/bookmarks/${id}`,
      method: 'DELETE',
      contentType: 'application/json',
      success: callback
    });
  };

  return {
    getMyBookmarks,
    createMyBookmark,
    deleteMyBookmark

  };

}());