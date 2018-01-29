/*global bookmark, api*/

'use strict';
//===========DOM, DOM, DOM, DOM

$(document).ready(function () {
  bookmark.bindEventListeners();
  bookmark.render();

  api.getMyBookmarks((myBookmarks) => {
    myBookmarks.forEach((myBookmark) => bookmark.add(myBookmark));
    bookmark.render();
  });
});