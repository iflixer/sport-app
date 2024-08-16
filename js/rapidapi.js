// FOOTBALL API
const betters_list = [8, 11, 32];
const bet_list = [8, 11, 32];
(function ($) {
    var timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    var currentDate = new Date();
    var today = formatDate(currentDate);
    var currentseason = formatSeason(currentDate);
    const apikey = '6b595851d5eefee94b1a6113b126e089';

    var data = '';
    var settings = {
        "url": "https://v3.football.api-sports.io/fixtures?season=" + currentseason + "&date=" + today,
        "method": "GET",
        "timeout": 0,
        "headers": {
            "x-rapidapi-key": apikey,
            "x-rapidapi-host": "v3.football.api-sports.io"
        },
    };

    $.ajax(settings).done(function (response) {
        data = response;
        refresh_data(data);
        // console.log(data);
    });

    function getLeagueOdds(league, inplay) {
        var settings2 = {
            "url": 'https://v3.football.api-sports.io/odds?league=' + league + '&season=' + currentseason + '&date=' + today,
            "method": "GET",
            "timeout": 0,
            "headers": {
                "x-rapidapi-key": apikey,
                "x-rapidapi-host": "v3.football.api-sports.io"
            },
        };

        $.ajax(settings2).done(function (response) {
   //         console.log(response);
            $.each(response.response, function (index,item) {
              var fixid = item.fixture.id;
              var rawbookmakers = item.bookmakers;
              var thisgamedata = [];
              //console.log(rawbookmakers);
                function alltahtis(){
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

                    console.log(filteredBookmakers);
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

                    console.log(result);
                    thisgamedata = result;
                }

                // alltahtis();
                onlycommon();
               var thisgame = $('.gamerow[data-lg-id="'+league+'"]').find('.gamerow[data-fixid="'+ fixid+'"]');
                var betlist = '<div class="betters-info">';
                $.each(thisgamedata, function(index, better){
                var better_name = better.name;
                var better_id = better.id;

                    $.each(better.bets, function(index, bet_item){
                        betlist += '<div class="singlebet" data-better-id="'+better_id+'" data-better-name="'+better_name+'" data-bet-id="'+bet_item.id+'" data-bet-name="'+bet_item.name+'">';
                        var betitemname = bet_item.name;
                        betlist += '<p>'+betitemname+'</p>';
                        betlist += '<div class="ratebadge btimg"><span><p>'+better_name+'</p></div>';
                        $.each(bet_item.values, function(index, singleodd){
                            betlist += '<div class="singleodd">';
                            betlist += ' <div class="ratebadge"><p>'+singleodd.value+'</p>\n' +
                                '                        <p class="rate">'+singleodd.odd+'</p></div>';
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
                $items.sort(function(a, b) {
                    return $(a).data('bet-id') - $(b).data('bet-id');
                });

// Group elements by 'data-bet-id'
                var grouped = {};
                $.each($items, function(index, item) {
                    var betId = $(item).data('bet-id');
                    if (!grouped[betId]) {
                        grouped[betId] = [];
                    }
                    grouped[betId].push($(item).prop('outerHTML'));
                });

// Build the new HTML string with grouped elements
                var newHtmlString = '<div>';
                $.each(grouped, function(betId, itemsHtml) {
                    // Optionally, you could add a wrapper or heading for each group
                    newHtmlString += '<div class="bet-group" data-bet-id="' + betId + '">';
                    $.each(itemsHtml, function(index, html) {
                        newHtmlString += html;
                    });
                    newHtmlString += '</div>';
                });
                newHtmlString += '</div>';

// Output the new HTML string
                var groupedbets = newHtmlString;


               thisgame.append(groupedbets+'<div class="endgame"></div>');


        });
        });
    }

    function refresh_data(data) {
        var decoded_data = data;
        //var allowed_league_ids = [2, 3, 39, 140, 78, 71, 61, 91, 119, 1, 13, 12];
        var allowed_league_ids = [2, 3, 39, 140, 78, 71, 61, 91, 119, 1, 13, 12, 48, 660, 772, 906, 932, 931, 933, 939, 1020, 1128];
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
                    '<div class="gameheader spoiler'+firsttogled+'"  data-lg-id="' + fixtures[0].league.id + '">' + istop + lcountry +
                    '<div class="badge league"><i><img src="' + fixtures[0].league.logo + '"></i><span>' + fixtures[0].league.name + '</span></div>' +
                    '</div>';



                var leagueData =
                    '<div class="gamerow'+spoiltogled+'"  data-lg-id="' + fixtures[0].league.id + '">' + leagueSpoiler + '<div class="gamecontent"'+gcontent+'>' +
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

                    var fixture_row =
                        '<div class="gamerow" data-fixid="' + fixture.fixture.id + '">' +
                        '<div class="gamebadges">' + matchstat + showtime + matchtime + '</div>' +
                        '<div class="game-stat">' +
                        '<div class="team thome">' + home_team_name + '</div>' +
                        '<div class="results">' + goals_home + ':' + goals_away + '</div>' +
                        '<div class="team tguest">' + away_team_name + '</div>' +
                        '</div>';


                    var nextgame = '<div class="gamebadges ginfo" data-fixid="' + fixture.fixture.id + '"><div class="badge"><i class="fas fa-info-circle"></i>Game info</div></div><div class="endgame"></div></div>';
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

        // console.log(grouped_by_league);
    }


    function tstotime(timestamp) {
        var date = new Date(timestamp * 1000);
        var options = {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        };
        var localTimeString = date.toLocaleTimeString(undefined, options);
        return localTimeString;
    }

    function formatDate(date) {
        var year = date.getFullYear();
        var month = ('0' + (date.getMonth() + 1)).slice(-2);
        var day = ('0' + date.getDate()).slice(-2);
        return year + '-' + month + '-' + day;
    }

    function formatSeason(date) {
        var year = date.getFullYear();
        return year;
    }

    function getRandomNumber(min, max, step) {
        return (Math.floor(Math.random() * ((max - min) / step + 1)) * step + min).toFixed(2);
    }

    function getRandomPerc(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
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

    $(document).on('click', '.uniclose', function () {
        $('.wg-api-widget').html('').removeClass('active');
        $('body').removeClass('noscroll');
        $('body .uniclose').remove();
    });

    $(document).on('click', '.spoiler', function () {
        if(!$(this).hasClass('betloaded')){
            var thisleagueid = $(this).data('lg-id');
            getLeagueOdds(thisleagueid,false);
            $(this).addClass('betloaded');
        }

        $(this).parent().toggleClass('toggled');
        $(this).next('.gamecontent').slideToggle();
    });

})(jQuery);