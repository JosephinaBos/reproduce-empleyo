$(document).ready(function () {
    $(function () {
    function addF5Handler(){
    el = $('body', $('#contenedor iframe').contents());
    if(el.length != 1) {
    setTimeout(addF5Handler, 100);
    return;
    }
    $($('#contenedor iframe').get(0).contentWindow.document).keydown(function () {
    var myWindow = $('#contenedor iframe').get(0).contentWindow;
    if (myWindow.event && myWindow.event.keyCode == 116) {
    myWindow.event.cancelBubble = true;
    myWindow.event.returnValue = false;
    myWindow.event.keyCode = 0;
    myWindow.status = "F5 is disabled on all popups";
    return false;
    }
    });
    }
    addF5Handler();
    });


    var QueryString = function () {
        var query_string = {};
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (typeof query_string[pair[0]] === "undefined") {
                query_string[pair[0]] = decodeURIComponent(pair[1]);
            } else if (typeof query_string[pair[0]] === "string") {
                var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
                query_string[pair[0]] = arr;
            } else {
                query_string[pair[0]].push(decodeURIComponent(pair[1]));
            }
        }
        return query_string;
    } ();

    $('#contenedor').append('<iframe src="https://surfly.com/' + QueryString.id + '/" frameborder="0" "></iframe>');
});