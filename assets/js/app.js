(function($) {
  var client = algoliasearch('K2QBSKPQB1', 'ee07edd4f55991d8fba28db8a9c52230');
  var index = client.initIndex('cheatsogang');
  var limit = 100;
  var url = 'https://s3.ap-northeast-2.amazonaws.com/cheatsogang2';
  function bottomScrollReArrange() {
    var h = $(window).height();
    var w = $(window).width();
    $('.bottom-scroll').css({
      top: h - 40,
      left: w - 40,
      display: 'inline-block'
    });
  }
  function isHit(elem, query) {
    if (!elem) {
      return false;
    }
    if (elem.title.includes(query)) {
      return true;
    } else {
      var hit = false;
      elem.attachments.every(function(attachment) {
        if (attachment.title.includes(query)) {
          hit = true
          return false;
        } else {
          return true;
        }
      });
      return hit;
    }
  }

  function bottomScrollEventHandler() {
    $('.bottom-scroll').click(function(e) {
      e.preventDefault();
      $('html, body').animate({
        scrollTop: 0
      }, 'fast');
    });
  }

  $(window).resize(bottomScrollReArrange);
  $(document).ready(function() {
    bottomScrollReArrange();
    bottomScrollEventHandler();
    var intervals = [];
    var search = function(page) {
      var query = $('#search-input').val().trim();
      $('#loader').show();
      $('#result-table').show();
      $('#result-table tbody').html('');
      $('#pagination').html('');
      if (query == '') {
        $('#loader').hide();
        return;
      }
      index.search(query, {
        offset: page - 1,
        length: limit
      }, function(err, content) {
        if (err) {
          console.log(err);
        } else {
          content.hits.forEach(function(obj) {
            for (var i = 1; i < 5; i++) {
              var elem = obj[i];
              if (!isHit(elem, query)) {
                continue;
              } else {
                console.log('hi');
                $('#result-table tbody').append('' +
                  '<tr>' + 
                    '<td>' +
                      '<span class="title">' + elem.title + '</span>' +
                      '<ul class="nav nav-pills nav-stacked">' + 
                        elem.attachments.map(function(attachment, index) {
                          return ('' +
                            '<li class="nav-item">' +
                              '<a class="nav-link" href="' + url + '/' + attachment.file_name + '" target="blank">' +
                                attachment.title +
                              '</a>' +
                            '</li>'
                          );
                        }).join('') +
                      '</ul>' +
                    '</td>' +
                  '</tr>'
                );
              }
            }
          });
          $('#pagination')
            .append('' +
              '<nav>' +
                '<ul class="pagination">' +
                  (new Array(parseInt(content.nbHits / limit) + (content.nbHits % limit ? 1 : 0)).fill(undefined)).map(function(elem, index) {
                    var className = index + 1 == page ? 'active' : '';
                    return ('' +
                      '<li class="page-item ' + className + '">' +
                        '<a class="page-link" href="#">' + (index + 1) + '</a>' +
                      '</li>'
                    )
                  }).join('') +
                '</ul>' +
              '</nav>'
            );
          $('#loader').hide();
        }
      });
    };
    $(document).on('click', '.page-link', function(e) {
      var page = parseInt($(this).text());
      search(page);
    });
    $('#search-input').keypress(function(e) {
      if (e.which == 13) {
        search(1);
      }
    });
    $('#search-button').click(function(e) {
      search(1);
    });
  });
}(jQuery));
      

