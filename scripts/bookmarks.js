/* global api */

'use strict';

const bookmark = (function () {

//======================== Here is the bookmark creator

  const create = function (id, title, url, desc) {

    return {
      id,
      title,
      url,
      desc,
      rating: null,
      detailedView: false,
    };
  };

  const add = function (bookmark) {
    this.myBookmarks.push(bookmark);
  };

  const generateElement = function (myBookmark) {
    if (myBookmark.detailedView) {
      return `
      <div class='expanded-bookmark'>
        <li class='js-bookmark-my-bookmark' data-bookmark-id='${myBookmark.id}'>
          <h2 id='expanded-title'>${myBookmark.title}</h2>
          <div id="expanded-url" class='bookmark button'>
          <a href='${myBookmark.url}' target="_blank">Take Me There</a>
          </div>
          <div class='rating js-rating'>
          <p>Rating: ${myBookmark.rating}</p>
          </div>
            <p class='bookmark-desc'>${myBookmark.desc}</p>
            <button class='less-bookmark js-collapse-bookmark' type="submit">Less Bookmark</button>
            <button class='delete-bookmark js-delete-bookmark' type="submit">Delete</button>
        </li>
      </div>
      `;
    } else {
      return `
      <div>
        <li class='collapsed-bookmark js-bookmark-my-bookmark' data-bookmark-id='${myBookmark.id}'>
          <h2 class="collapsed-title">${myBookmark.title}</h2>
          <p class="collapsed-rating">Rating: ${myBookmark.rating}</p>
          <button class='js-expand-bookmark' type="submit">More Bookmark</button>
          </div>
        </li>
      </div>
      `;
    }

  };

  const generateString = function (bookmark) {
    const list = bookmark.map((myBookmark) => generateElement(myBookmark));
    return list.join('');
  };
//=================== This is the all important render 
  const render = function (myBookmarks) {
    let allBookmarks = !myBookmarks ? bookmark.myBookmarks : myBookmarks;
    const stringOfBookmarks = generateString(allBookmarks);
    $('.js-bookmark-list').html(stringOfBookmarks);
  };

//================= When using the api, the Id is very important, this is how you find it
  const findId = function (id) {
    const myBookmarks = bookmark.myBookmarks;
    return myBookmarks.find(myBookmark => myBookmark.id === id);
  };

  const getId = function (myBookmark) {
    return $(myBookmark)
      .closest('.js-bookmark-my-bookmark')
      .data('bookmark-id');
  };

  
  
  const newBookmark = function () {
    $('.js-new-bookmark-form').submit(function (event) {
      event.preventDefault();
      const newTitle = $('.title-bookmark-input').val();
      const newURL = $('.url-bookmark-input').val();
      const newDesc = $('.desc-bookmark-input').val();
      const newRating = $('#filter-rating option:selected').val();
      $('.title-bookmark-input').val('');
      $('.url-bookmark-input').val('');
      $('.desc-bookmark-input').val('');
      api.createMyBookmark(newTitle, newURL, newDesc, newRating, (newBookmark) => {
        bookmark.add(newBookmark);
        render();
      });
    });
  };
  
//=========================== To delete a bookmark, Id is also critical

  const findAndDelete = function (id) {
    bookmark.myBookmarks = bookmark.myBookmarks.filter(myBookmark => myBookmark.id !== id);
  };
  const deleteBookmark = function () {
    $('.js-bookmark-list').on('click', '.js-delete-bookmark', event => {
      const id = bookmark.getId(event.currentTarget);
      api.deleteMyBookmark(id, () => {
        bookmark.findAndDelete(id);
        bookmark.render();
      });
    });
  };

//=============== The user needs to be able to expand the view of their bookmark

  const seeMoreButton = function () {
    $('.js-bookmark-list').on('click', '.js-expand-bookmark', event => {
      const id = bookmark.getId(event.currentTarget);
      const foundMyBookmark = findId(id);
      foundMyBookmark.detailedView = true;
      bookmark.render();
    });
  };
//=================== The user needs to be able to see less of their bookmark

  const seeLessButton = function () {
    $('.js-bookmark-list').on('click', '.js-collapse-bookmark', event => {
      const id = bookmark.getId(event.currentTarget);
      const foundMyBookmark = findId(id);
      foundMyBookmark.detailedView = false;
      bookmark.render();
    });
  };

  //======================== The user needs to be able to filter by the rating drop down

  const filterBy = function () {
    $('select.rating-choice').change(function () {
      var selectedRating = $('.rating-choice option:selected').val();
      const myBookmarks = bookmark.myBookmarks;
      let filteredMyBookmarks = myBookmarks.filter(myBookmark => myBookmark.rating >= selectedRating);
      render(filteredMyBookmarks);
    });
  };

//========================= Event listeners

  const bindEventListeners = function () {
    newBookmark();
    deleteBookmark();
    seeMoreButton();
    seeLessButton();
    filterBy();
  };

//======================= IIFE Exposure  
  return {
    create,
    add,
    generateElement,
    generateString,
    findId,
    findAndDelete,
    getId,
    
    render,
    bindEventListeners,
    
    myBookmarks: [],
    showForm: false,
    minimumRating: null,
  };
  
}());