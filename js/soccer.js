// FOOTBALL API
const apibase = 'https://api.flashscore.ai/api/soccer';
var betters_list = [8, 11, 32];
// var allowed_league_ids = [2, 3, 39, 140, 78, 71, 61, 91, 119, 1, 13, 12];  // INITIAL LIST
var allowed_league_ids = [2, 3, 39, 140, 78, 71, 61, 91, 119, 1, 13, 12, 48, 660, 772, 906, 932, 931, 933, 939, 1020, 1128,296,297,298,299,26,37,330,618,190,188,398];


(function ($) {
    var timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    var currentDate = new Date();
    var today = formatDate(currentDate);
    var currentseason = formatSeason(currentDate);
    var soccerdata = '';


    // FIXTURES SETTINGS + GET
    var settings = {
        "url": apibase+"/fixtures?season=" + currentseason + "&date=" + today,
        "method": "GET",
        "timeout": 0,
    };
    $.ajax(settings).done(function (response) {
       // console.log(response);
        soccerdata = response.data;
        refresh_data(soccerdata);
    });

    function getLeagueOdds(league, inplay) {
        var activegroup = $('input[name="bettype"]:checked').val();
        var activebetters = [];
        $('input[name="betoption"]:checked').each(function () {
            activebetters.push(parseInt($(this).val(), 10));
        });

        // console.log(activebetters);


        // ODDS SETTINGS
        var settings2 = {
            "url": apibase+'/odds?league=' + league + '&season=' + currentseason + '&date=' + today,
            "method": "GET",
            "timeout": 0,
        };

        $.ajax(settings2).done(function (response) {
                //     console.log(response);
            $.each(response.data.response, function (index, item) {
                var fixid = item.fixture.id;
                var rawbookmakers = item.bookmakers;
                var thisgamedata = [];

              //  console.log(rawbookmakers);
                function alltahtis() {
                    function sortBetsById(bets) {
                        return bets.sort((a, b) => a.id - b.id);
                    }

                    var filteredBookmakers = $.grep(rawbookmakers, function (bookmaker) {
                        return $.inArray(bookmaker.id, betters_list) !== -1;
                    }).map(function (bookmaker) {
                        return {
                            ...bookmaker,
                            bets: sortBetsById(bookmaker.bets) // Use the sorting function here
                        };
                    });

                   // console.log(filteredBookmakers);
                }

                function onlycommon() {
                    var filteredBookmakers = $.grep(rawbookmakers, function (bookmaker) {
                        return $.inArray(bookmaker.id, betters_list) !== -1;
                    });
                    var allBetIds = $.map(filteredBookmakers, function (bookmaker) {
                        return $.map(bookmaker.bets, function (bet) {
                            return bet.id;
                        });
                    });
                    var uniqueBetIds = Array.from(new Set(allBetIds));
                    var betIdCount = uniqueBetIds.reduce(function (acc, betId) {
                        acc[betId] = filteredBookmakers.every(function (bookmaker) {
                            return $.grep(bookmaker.bets, function (bet) {
                                return bet.id === betId;
                            }).length > 0;
                        });
                        return acc;
                    }, {});

                    var commonBetIds = $.map(betIdCount, function (value, id) {
                        return value ? parseInt(id) : null;
                    }).filter(Boolean);
                    var result = $.map(filteredBookmakers, function (bookmaker) {
                        return $.extend({}, bookmaker, {
                            bets: $.grep(bookmaker.bets, function (bet) {
                                return $.inArray(bet.id, commonBetIds) !== -1;
                            })
                        });
                    });

                //    console.log(result);
                    thisgamedata = result;
                }

                // alltahtis();
                onlycommon();
                var thisgame = $('.lgamerow[data-lg-id="' + league + '"]').find('.gamerow[data-fixid="' + fixid + '"]');
                var liveodds = '';
                var liveoddstxt = '';
                var fstat = thisgame.data('status');
                if (fstat === 'LIVE' || fstat === '1H' || fstat === 'HT' || fstat === '2H' || fstat === 'ET' || fstat === 'P'){
                  //  console.log(fixid+ '- is LIVE');
                    thisgame.addClass('live-live');
                    var settings3 = {
                        "url": apibase+'/odds/live?fixture=' + fixid,
                        "method": "GET",
                        "timeout": 0,
                    };

                    $.ajax(settings3).done(function (response) {
                        liveodds = response;
                       // console.log(liveodds);
                        liveoddstxt += '<div class="live-odds">';
                        liveoddstxt += '<div class="singlebet active">';
                        $.each(liveodds.response[0].odds, function (index, singleodd) {
                            liveoddstxt += '<div class="liveblockname">'+singleodd.name+'</div>';


                            $.each(singleodd.values, function (index, bet_item) {
                                var suspended = '';
                                var handi = '';
                                if(bet_item.suspended != false){
                                    suspended = 'suspended';
                                }
                                if(bet_item.handicap){
                                    handi = 'Handicap: '+bet_item.handicap;
                                }
                                liveoddstxt  += '<div class="singleodd">';
                                liveoddstxt  += ' <div class="ratebadge"><p class="handic">' + handi + '</p><p>' + bet_item.value + '</p>\n' +
                                    '                        <p class="rate">' + bet_item.odd + '</p><p class="susp">' + suspended + '</p></div>';
                                liveoddstxt += '</div>';
                            });

                        });
                        liveoddstxt += '</div></div>';
                        thisgame.find('.endgameinfo').after(liveoddstxt);
                    });


                }


                var betlist = '<div class="betters-info">';
                $.each(thisgamedata, function (index, better) {
                    var better_name = better.name;
                    var better_id = better.id;

                    $.each(better.bets, function (index, bet_item) {
                        var betteractive = '';
                        // console.log(better_id );
                        if (activebetters.includes(better_id) || activebetters[0] === 0) {
                            //console.log(better_id + ' is in the array.');
                            betteractive = ' active';
                        }
                        betlist += '<div class="singlebet' + betteractive + '" data-better-id="' + better_id + '" data-better-name="' + better_name + '" data-bet-id="' + bet_item.id + '" data-bet-name="' + bet_item.name + '">';

                        betlist += '<div class="ratebadge btimg"><span><p>' + better_name + '</p></div>';
                        $.each(bet_item.values, function (index, singleodd) {
                            betlist += '<div class="singleodd">';
                            betlist += ' <div class="ratebadge"><p>' + singleodd.value + '</p>\n' +
                                '                        <p class="rate">' + singleodd.odd + '</p></div>';
                            betlist += '</div>';
                        });
                        betlist += '</div>';

                    });
                });
                betlist += '</div>';

                // Convert the HTML string into a jQuery object
                var $tempContainer = $('<div>').html(betlist);

// Find and extract elements
                var $items = $tempContainer.find('.singlebet').get();

// Sort elements by 'data-bet-id'
                $items.sort(function (a, b) {
                    return $(a).data('bet-id') - $(b).data('bet-id');
                });

// Group elements by 'data-bet-id'
                var grouped = {};
                $.each($items, function (index, item) {
                    var betId = $(item).data('bet-id');

                    if (!grouped[betId]) {
                        grouped[betId] = [];
                    }
                    grouped[betId].push($(item).prop('outerHTML'));
                });

// Build the new HTML string with grouped elements

                var newHtmlString = '<div>';
                $.each(grouped, function (betId, itemsHtml) {
                    // Optionally, you could add a wrapper or heading for each group
                    var groupshow = '';
                    if (activegroup === betId) {
                        groupshow = ' active';
                    }
                    newHtmlString += '<div class="bet-group' + groupshow + '" data-bet-id="' + betId + '">';
                    $.each(itemsHtml, function (index, html) {
                        newHtmlString += html;
                    });
                    newHtmlString += '</div>';
                });
                newHtmlString += '</div>';

// Output the new HTML string
                var groupedbets = newHtmlString;


                thisgame.append(groupedbets + '<div class="btn allbets" data-fix-id="' + fixid + '">All bets</div>');

            });
            $('.bet-group').each(function (index, element) {
                $(this).addClass('prematch');
                var groupname = $(this).find('.singlebet:first-child').data('bet-name');
                if (typeof groupname !== 'undefined') {
                    $(this).prepend('<div class="blockname">' + groupname + '</div>');
                }
            });
        });


    }
    function refresh_data(data) {
        var decoded_data = data;

        // Group fixtures by league ID
        var grouped_by_league = {};
        var other_leagues = [];
        decoded_data.response.forEach(function (fixture) {
            if (fixture.league && fixture.league.id) {
                if (!grouped_by_league[fixture.league.id]) {
                    grouped_by_league[fixture.league.id] = [];
                }
                grouped_by_league[fixture.league.id].push(fixture);
            }
        });

        // Iterate over allowed leagues
        $.each(allowed_league_ids, function (_, league_id) {
            if (grouped_by_league[league_id]) {
                renderLeague(grouped_by_league[league_id], true);
            }
        });

        var firstleaguedone = false;

        function renderLeague(fixtures, isAllowedLeague) {
            // Create a spoiler div for the league
            var firsttogled = "";
            var spoiltogled = "";
            var gcontent = "";
            if (isAllowedLeague) {
                var istop = '';
                var lcountry = '<div class="badge">' + fixtures[0].league.country + '</div>';
                if (fixtures[0].league.country === 'World') {
                    istop = '<div class="badge hot"><i class="fas fa-fire"></i>Top</div>';
                    lcountry = '<div class="badge int"><i class="fas fa-globe"></i>' + fixtures[0].league.country + '</div>';
                }

                if (!firstleaguedone) {
                    firsttogled = ' betloaded';
                    spoiltogled = ' toggled';
                    gcontent = ' style="display: block;"';
                }
                var leagueSpoiler =
                    '<div class="gameheader spoiler' + firsttogled + '"  data-lg-id="' + fixtures[0].league.id + '">' + istop + lcountry +
                    '<div class="badge league"><i><img src="' + fixtures[0].league.logo + '"></i><span>' + fixtures[0].league.name + '</span></div>' +
                    '</div>';


                var leagueData =
                    '<div class="lgamerow' + spoiltogled + '"  data-lg-id="' + fixtures[0].league.id + '">' + leagueSpoiler + '<div class="gamecontent"' + gcontent + '>' +
                    '<div class="league-row"><div class="badge league standings load-standng-widget" data-league="' + fixtures[0].league.id + '"><i><img src="' + fixtures[0].league.logo + '"></i><span>Standings</span><i class="afterbadge fas fa-external-link-alt"></i></div></div>';


                fixtures.forEach(function (fixture) {
                    var fixt_id = fixture.fixture.id;
                    var league_id = fixture.league.id;
                    var league_name = fixture.league.name;
                    var away_team_name = fixture.teams.away.name;
                    var home_team_name = fixture.teams.home.name;
                    var away_team_flag = fixture.teams.away.logo;
                    var home_team_flag = fixture.teams.home.logo;
                    var goals_away = fixture.goals.away === null ? 0 : fixture.goals.away;
                    var goals_home = fixture.goals.home === null ? 0 : fixture.goals.home;
                    var fstat = fixture.fixture.status.short;
                    var fstatlong = fixture.fixture.status.long;
                    var fstatelap = fixture.fixture.status.elapsed;
                    var starttime = tstotime(fixture.fixture.timestamp);
                    var showtime = '';
                    var matchstat = '';
                    var matchtime = '';

                    if (fstat === 'FT' || fstat === 'AET' || fstat === 'PEN') {
                        matchstat = "";//'<div data-fixid="'+fixture.fixture.id+'" class="badge live">live</div>';
                        showtime = '<div class="badge timer"><i class="fas fa-clock"></i>' + fstatlong + '</div>';
                        matchtime = '<div class="badge timer"><i class="fas fa-stopwatch"></i>' + fstatelap + '</div>';
                    }

                    if (fstat === 'LIVE' || fstat === '1H' || fstat === 'HT' || fstat === '2H' || fstat === 'ET' || fstat === 'P') {
                        matchstat = '<div data-fixid="' + fixture.fixture.id + '" class="badge live">live</div>';
                        showtime = '<div class="badge timer"><i class="fas fa-clock"></i>' + fstatlong + '</div>';
                        matchtime = '<div class="badge timer"><i class="fas fa-stopwatch"></i>' + fstatelap + '</div>';
                    }

                    if (fstat === 'NS') {
                        matchstat = '<div data-fixid="' + fixture.fixture.id + '" class="badge">Not started</div>';
                        showtime = '<div class="badge timer"><i class="fas fa-clock"></i>' + starttime + '</div>';
                    }
                    if (fstat === 'CANC') {
                        matchstat = '<div data-fixid="' + fixture.fixture.id + '" class="badge">CANCELED</div>';
                        showtime = '';
                    }

                    var fixture_row =
                        '<div class="gamerow" data-status="'+fstat+'" data-start-time="'+starttime+'" data-fixid="' + fixture.fixture.id + '"><div class="gameshortinfo">' +
                        '<div class="gamebadges">' + matchstat + showtime + matchtime + '</div>' +
                        '<div class="game-stat">' +
                        '<div class="team thome">' + home_team_name + '</div>' +
                        '<div class="results">' + goals_home + ':' + goals_away + '</div>' +
                        '<div class="team tguest">' + away_team_name + '</div>' +
                        '</div>';


                    var nextgame = '<div class="gamebadges ginfo" data-fixid="' + fixture.fixture.id + '"><div class="badge"><i class="fas fa-info-circle"></i>Game info</div></div></div><div class="endgameinfo"></div></div>';
                    leagueData += fixture_row + nextgame;
                });

                leagueData += '</div></div>'; // END league-data
                if (!firstleaguedone) {
                    getLeagueOdds(fixtures[0].league.id, false);
                    firstleaguedone = true;
                }
            }
            $('.gamescontainer').append(leagueData);
        }
        var totalcoccer = $('.gamescontainer .gamerow').length;
        $('.menu-item[data-sport="soccer"] .activeevents').remove();
        $('.menu-item[data-sport="soccer"]').append('<div class="activeevents">'+totalcoccer+'</div>');
        // console.log(grouped_by_league);
    }
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
        standings.attr('data-season', currentseason);
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
            getLeagueOdds(thisleagueid, false);
            $(this).addClass('betloaded');
        }

        $(this).parent().toggleClass('toggled');
        $(this).next('.gamecontent').slideToggle();
    });
})(jQuery);