// FOOTBALL API
const apikey = 'a98d30cb2cmsh202650c16d13e5fp1276a0jsnf0844aad8c4e';
const apibase_cricket = 'https://sportapi7.p.rapidapi.com';
var betters_list = [8, 11, 32];
// var allowed_league_ids = [2, 3, 39, 140, 78, 71, 61, 91, 119, 1, 13, 12];  // INITIAL LIST
var allowed_league_ids = [2, 3, 39, 140, 78, 71, 61, 91, 119, 1, 13, 12, 48, 660, 772, 906, 932, 931, 933, 939, 1020, 1128,296,297,298,299];

(function ($) {
    var timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    var currentDate = new Date();
    var today = formatDate(currentDate);
    var currentseason = formatSeason(currentDate);
    var data = '';

    // FIXTURES SETTINGS + GET
    var settings = {
        "url": apibase_cricket+"/api/v1/sport/cricket/scheduled-events/" + today,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "x-rapidapi-key": apikey,
            "x-rapidapi-host": "sportapi7.p.rapidapi.com"
        },
    };
    $.ajax(settings).done(function (response) {

        console.log(response);
        var grouped_by_league = {};
        response.events.forEach(function (event) {
            if (event.tournament && event.tournament.id) {
                if (!grouped_by_league[event.tournament.id]) {
                    grouped_by_league[event.tournament.id] = [];
                }
                grouped_by_league[event.tournament.id].push(event);
            }
        });
        console.log(grouped_by_league);

        $.each(grouped_by_league, function(tour_id, data) {
            var tour = data[0].tournament.name;

            var leagueSpoiler =
                '<div class="gameheader spoiler"  data-lg-id="' + data[0].tournament.id + '">'+
                '<div class="badge league"<span>' + data[0].tournament.category.name + '</span></div><div class="badge league"<span>' + data[0].tournament.name + '</span></div>' +
                '</div>';

            $('.gamescontainer').append(leagueSpoiler);


            $.each(data, function(event,edata) {


                var hometeam = edata.homeTeam.name;
                var homescore = edata.homeScore.current;
                var awayscore = edata.awayScore.current;
                var awayteam = edata.awayTeam.name;
                $('.gamescontainer').append(hometeam+' - '+awayteam+'<br>');
            });
       });
    });



    function formatSeason(date) {
        var year = date.getFullYear();
        return year;
    }
    $(document).on('click', '.load-standng-widget', function (event) {
        event.preventDefault();
        let id = $(this).data('league');
        let standings = $('#wg-api-football-standings');
        standings.html('').addClass('active');
        standings.attr('data-league', id);
        window.document.dispatchEvent(new Event("DOMContentLoaded", {
            bubbles: true,
            cancelable: true
        }));
        $('body').addClass('noscroll').append('<div class="uniclose">X</div>');
    });
    $(document).on('click', '.gamebadges.ginfo', function (event) {
        event.preventDefault();
        let id = $(this).data('fixid');
        let thegame = $('#wg-api-football-game');
        thegame.html('').addClass('active');
        thegame.attr('data-id', id);
        window.document.dispatchEvent(new Event("DOMContentLoaded", {
            bubbles: true,
            cancelable: true
        }));
        $('body').addClass('noscroll').append('<div class="uniclose">X</div>');
    });
    $(document).on('click', '.upcomebut', function () {
        $('.upcomebut').removeClass('active');
        $('.gamescontainer .message').text('');
        $('.gamerow').each(function(index) {
            $(this).removeClass('goodns');
            $(this).removeClass('livenow');
            $(this).removeClass('finished');
            $(this).removeClass('notstarted');
        });
        if ($(this).hasClass('nextfull')) {
            $('.upcomebut').not(('.upcomebut.full')).hide();
            $(this).next('.upcomebut.full').addClass('active').show();
            $('.closeall').addClass('show').show();
        } else {
            $(this).addClass('active');
        }
    });
    $(document).on('click', '.upcomebut.live', function () {

        $('.gamerow').each(function(index) {
            var fstat = $(this).data('status');
            if (fstat === 'LIVE' || fstat === '1H' || fstat === 'HT' || fstat === '2H' || fstat === 'ET' || fstat === 'P'){
                $(this).show().addClass('livenow');
            }else{
                $(this).hide();
            }
        });
        $('.lgamerow').each(function() {
            if ($(this).find('.livenow').length > 0) {
                $(this).not('.toggled').find('.spoiler').trigger('click');
                $(this).show();
            }else{
                $(this).hide();
            }
        });
        if($('.gamescontainer').find('.livenow').length < 1){
            $('.gamescontainer .message').text('No corresponding data in this section');
        }
    });
    $(document).on('click', '.upcomebut.finished', function () {

        $('.gamerow').each(function(index) {
            var fstat = $(this).data('status');
            if (fstat === 'FT' || fstat === 'AET' || fstat === 'PEN'){
                $(this).show().addClass('finished');
            }else{
                $(this).hide();
            }
        });
        $('.lgamerow').each(function() {
            if ($(this).find('.finished').length > 0) {
                if ($(this).index() > 0) {
                    $(this).not('.toggled').find('.spoiler').trigger('click');
                    $(this).show();
                }
            }else{
                $(this).hide();
            }
        });
    });
    $(document).on('click', '.upcomebut.allupcome, .upcomein.s24h', function () {
        $('.gamerow').each(function(index) {
            var fstat = $(this).data('status');
            if (fstat === 'NS'){
                $(this).show().addClass('notstarted');
            }else{
                $(this).hide();
            }
        });
        $('.lgamerow').each(function() {
            if ($(this).find('.notstarted').length < 1) {
                $(this).hide();
            }else{
                $(this).show();
            }
        });

    });
    $(document).on('click', '.upcomein.ssh', function () {
        $('.gamescontainer .message').text('');
        var uptime = parseInt($(this).data('upcome'));
        $('.gamerow').each(function(index) {
            var fstat = $(this).data('status');
            if (fstat === 'NS'){
                $(this).show().addClass('notstarted');
            }else{
                $(this).hide();
            }
        });

        $('.gamerow.notstarted').each(function(index) {
            var thisstart = $(this).data('start-time');

            var timeParts = thisstart.split(':');
            var hours = parseInt(timeParts[0], 10);
            var minutes = parseInt(timeParts[1], 10);

            var now = new Date();
            var timestamp1 = now.getTime();
            var now2 = now;

// Set the time to today's date
            now2.setHours(hours);
            now2.setMinutes(minutes);
            now2.setSeconds(0); // Optionally set seconds to 0
            now2.setMilliseconds(0); // Optionally set milliseconds to 0

// Get the timestamp
            now2.setHours(hours);
            now2.setMinutes(minutes);
            now2.setSeconds(0); // Optionally set seconds to 0
            now2.setMilliseconds(0); // Optionally set milliseconds to 0

// Get the timestamp
            var timestamp2 = now2.getTime();
            if(timestamp1 > timestamp2){
                timestamp2 = timestamp2 + 86400000;
            }
            var between = parseInt(timestamp2) - parseInt(timestamp1);
            var hoursto = between / (60*60*1000);
            if(uptime > hoursto) {
                $(this).show().addClass('goodns');
            }else{
                $(this).hide();
            }

        });

        $('.lgamerow').each(function() {
            if ($(this).find('.goodns').length > 0 && uptime < 25) {
                $(this).not('.toggled').find('.spoiler').trigger('click');
                $(this).show();
            }else{
                $(this).hide();
            }
        });
    });
    $(document).on('click', '.upcomebut.allgames, .upcomeclose', function () {
        $('.gamerow').each(function(index) {
            $(this).show();
        });
        $('.lgamerow').show();
    });
    $(document).on('click', '.uniclose', function () {
        $('.wg-api-widget').html('').removeClass('active');
        $('body').removeClass('noscroll');
        $('body .uniclose').remove();
    });
    $(document).on('click', '.spoiler', function () {
        if (!$(this).hasClass('betloaded')) {
            var thisleagueid = $(this).data('lg-id');
            $(this).addClass('betloaded');
        }

        $(this).parent().toggleClass('toggled');
        $(this).next('.gamecontent').slideToggle();
    });
})(jQuery);