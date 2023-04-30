$(document).ready(function(){
    $('.searchTable').on('keyup', function(){
        var searchTerm = $(this).val().toLowerCase();
        $('tbody tr').each(function(){
            var name = $(this).find('td:first').text().toLowerCase();
            if(name.indexOf(searchTerm) === -1){
                $(this).hide();
            } else {
                $(this).show();
            }
        });
    });
});
