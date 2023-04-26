$('#search_btn').click(function(){
    window.location.href = `/${$('#place_search').val()}`;
})

$('#place_search').on('keypress', function(e) {
    if (e.which === 13) {
        window.location.href = `/${$('#place_search').val()}`;
    }
  });
