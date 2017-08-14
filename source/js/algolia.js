;(function(){
  var t = setInterval(function(){
    if (typeof($) === 'undefined') return;
    onReady();
    clearInterval(t);
  }, 100)
  function onReady(){
    $(document).ready(function(){
      var CONFIG ={
        root: '/blog/',
        algolia:{
          applicationID: 'XDG1C6ASA4',
          apiKey: 'eebdd0f1174b77269d954813961815bc',
          indexName: 'khiav-hexo-blog',
          hits:{ per_page: 10 },
          labels:{ "input_placeholder": "輸入搜尋內容", "hits_empty": "找不到「${query}」", "hits_stats": "找到 ${hits} 條相關條目，花費 ${time} 亳秒" }
        }
      };
      var algoliaSettings = CONFIG.algolia;
      var isAlgoliaSettingsValid = algoliaSettings.applicationID &&
        algoliaSettings.apiKey &&
        algoliaSettings.indexName;
      if (!isAlgoliaSettingsValid){
        window.console.error('Algolia Settings are invalid.');
        return;
      }
      var doSearch = _.debounce(function(helper){
        helper.search();
      }, 500);
      var search = instantsearch({
        appId: algoliaSettings.applicationID,
        apiKey: algoliaSettings.apiKey,
        indexName: algoliaSettings.indexName,
        searchFunction: function(helper){
          var searchInput = $('#algolia-search-input').find('input');
          if (searchInput.val()) doSearch(helper);
        }
      });
      // Registering Widgets
      [
        instantsearch.widgets.searchBox({
          container: '#algolia-search-input',
          placeholder: algoliaSettings.labels.input_placeholder
        }),
        instantsearch.widgets.hits({
          container: '#algolia-hits',
          hitsPerPage: algoliaSettings.hits.per_page || 10,
          templates:{
            item: function(data){
              return (
                '<a href="' + CONFIG.root + data.path + '" class="algolia-hit-item-link">' +
                data._highlightResult.title.value +
                '</a>'
              );
            },
            empty: function(data){
              return (
                '<div id="algolia-hits-empty">' +
                algoliaSettings.labels.hits_empty.replace(/\$\{query}/, data.query) +
                '</div>'
              );
            }
          },
          cssClasses:{
            item: 'algolia-hit-item'
          }
        }),
        instantsearch.widgets.stats({
          container: '#algolia-stats',
          templates:{
            body: function(data){
              var stats = algoliaSettings.labels.hits_stats
                .replace(/\$\{hits}/, data.nbHits)
                .replace(/\$\{time}/, data.processingTimeMS);
              return (
                stats +
                '<span class="algolia-powered">' +
                '  <img src="' + CONFIG.root + 'imgs/algolia_logo.svg" alt="Algolia" />' +
                '</span>' +
                '<hr />'
              );
            }
          }
        }),
        instantsearch.widgets.pagination({
          container: '#algolia-pagination',
          scrollTo: false,
          showFirstLast: false,
          labels:{
            first: '<i class="fa fa-angle-double-left"></i>',
            last: '<i class="fa fa-angle-double-right"></i>',
            previous: '<i class="fa fa-angle-left"></i>',
            next: '<i class="fa fa-angle-right"></i>'
          },
          cssClasses:{
            root: 'pagination',
            item: 'pagination-item',
            link: 'page-number',
            active: 'current',
            disabled: 'disabled-item'
          }
        })
      ].forEach(search.addWidget, search);
      search.start();
      $('.popup-trigger').on('click', function(e){
        e.stopPropagation();
        $('body').append('<div class="popoverlay">').css('overflow', 'hidden');
        $('.popoverlay').fadeIn(300);
        $('.popup').fadeIn(300);
        $('#algolia-search-input').find('input').focus();
      });
      $('.popup-btn-close').click(function(){
        $('.popoverlay').fadeOut(300);
        $('.popup').fadeOut(300);
        $('.popoverlay').remove();
        $('body').css('overflow', '');
      });
    });
  }
})();
