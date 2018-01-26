var books = [];
page = 0
pageNum = 1

$('.add-book').on('click', function() {
  console.log("hi");
  console.log($(this).attr('id'));
});

$('.search').on('click', function() {
  page = 0
  $(".spinner").show()
  $(".books").hide()
  var search = $('#search-query').val();

  fetch(search, 0);
});

$('.page-item').on('click', function() {
  if ($(this).hasClass("disabled")) {
    return
  } else if ($(this).hasClass("pagination-prev")) {
    page = parseInt(page) - 1
    pageNum = page + 1
  } else if ($(this).hasClass("pagination-next")) {
    page = parseInt(page) + 1
    pageNum = page + 1
  } else {
    pageNum = $(this).children().text()
    page = parseInt(pageNum) - 1
  }
  if (page > 2) {
    pageNum = parseInt(page) + 1
    $('.first-page').children().text(pageNum - 2);
    $('.second-page').children().text(pageNum - 1);
    $('.third-page').children().text(pageNum);
    $('.fourth-page').children().text(pageNum + 1);
    $('.fifth-page').children().text(pageNum + 2);
  }
  console.log(page)
  $('.page-item').removeClass("active")
  $(`.page-item:contains(${pageNum})`).addClass("active")
  $(".spinner").show()
  $(".books").hide()
  var search = $('#search-query').val();
  pageIndex = parseInt(page) * 10
  fetch(search, pageIndex);
})

var fetch = function(query, pageIndex) {
  transformedQuery = query.replace(/\s/g, "+");
  $.ajax({
    method: "GET",
    url: `https://www.googleapis.com/books/v1/volumes?q=${transformedQuery}&startIndex=${pageIndex}`,
    dataType: "json",
    success: function(data) {
      $(".spinner").hide()
      $(".books").show()
      addBooks(data);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  });

};

var renderBooks = function() {
  $('.books').empty();
  var source = $('#book-template').html();
  var template = Handlebars.compile(source);

  for (var i = 0; i < books.length; i++) {
    var newHTML = template(books[i]);
    $('.books').append(newHTML);

  }
  $(".pagination").show()
  if (page == 0) {
    $('.pagination-prev').addClass("disabled")
  } else {
    $('.pagination-prev').removeClass("disabled")
  }
  $('.add-book').on('click', function(event1) {
    event.stopImmediatePropagation
    console.log($(this).parent().attr('id'));
  });
};

var addBooks = function(data) {
  books = [];

  for (var i = 0; i < data.items.length; i++) {
    var bookData = data.items[i];

    var author = function() {
      if (bookData.volumeInfo.authors) {
        return bookData.volumeInfo.authors[0];
      } else {
        return null;
      }
    };

    var imageURL = function() {
      if (bookData.volumeInfo.imageLinks) {
        return bookData.volumeInfo.imageLinks.thumbnail;
      } else {
        return null;
      }
    };

    var isbn = function() {
      if (bookData.volumeInfo.industryIdentifiers) {
        return bookData.volumeInfo.industryIdentifiers[0].identifier;
      } else {
        return null;
      }
    };

    var pageCount = function() {
      if (bookData.volumeInfo.pageCount) {
        return bookData.volumeInfo.pageCount;
      } else {
        return null;
      }
    };

    var title = function() {
      if (bookData.volumeInfo.title) {
        return bookData.volumeInfo.title;
      } else {
        return null;
      }
    };

    var book = {
      title: title(),
      author: author(),
      imageURL: imageURL(),
      pageCount: pageCount(),
      isbn: isbn(),
      bookId: i
    };

    books.push(book);
  }

  renderBooks();
};
