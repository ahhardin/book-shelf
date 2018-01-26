var books = [];
page = 0

$('.search').on('click', function() {
  page = 0
  $(".spinner").show()
  $(".books").hide()
  var search = $('#search-query').val();

  fetch(search,0);
});

$('.pagination-next').on('click', function() {
  $(".spinner").show()
  $(".books").hide()
  var search = $('#search-query').val();
  page+=1
  pageIndex = parseInt(page)*10
  fetch(search,pageIndex);
  $('.pagination-prev').show()
  console.log(page)
});

$('.pagination-prev').on('click', function() {
  $(".spinner").show()
  $(".books").hide()
  var search = $('#search-query').val();
  page -= 1
  if (page == 0) {
    $('.pagination-prev').hide()
  }
  pageIndex = parseInt(page)*10
  fetch(search,pageIndex);
  console.log(page)
});

var fetch = function(query,pageIndex) {
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
  console.log(books)
  var source = $('#book-template').html();
  var template = Handlebars.compile(source);

  for (var i = 0; i < books.length; i++) {
    var newHTML = template(books[i]);
    $('.books').append(newHTML);
  }
  $(".pagination-next").show()

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
      isbn: isbn()
    };

    books.push(book);
  }

  renderBooks();
};
