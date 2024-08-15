// Function to save checkbox state to localStorage
function saveCheckboxState(id, state) {
    localStorage.setItem(id, state);
}

// Function to restore checkbox state from localStorage
function restoreCheckboxState(id) {
    const state = localStorage.getItem(id);
    if (state !== null) {
        document.getElementById(id).checked = (state === 'true');
        // Apply dark mode class based on restored state
        if (state === 'true') {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }
}

// Restore checkbox state and apply dark mode class on page load
document.addEventListener('DOMContentLoaded', function () {
    restoreCheckboxState('themeToggle');
});

// Save checkbox state and apply dark mode class when clicked
document.addEventListener('change', function (event) {
    if (event.target.id === 'themeToggle') {
        saveCheckboxState('themeToggle', event.target.checked);
        // Apply dark mode class based on checkbox state
        if (event.target.checked) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }
});

$(document).ready(function () {
    // Show/hide radio group on button click
    $('.main-bet-but').on('click', function () {
        $('.slidefrombot').toggleClass('show');
        $('body').toggleClass('hasover');
    });

    // Hide radio group on clicking outside or swiping down
    $(document).on('click touchstart', function (e) {
        if (!$(e.target).closest('.slidefrombot, .main-bet-but').length) {
            $('.slidefrombot').removeClass('show');
            $('body').removeClass('hasover');
        }
    });

    // Prevent hiding if clicking inside the radio group container
    $('.slidefrombot').on('click touchstart', function (e) {
        e.stopPropagation(); // Prevent event from bubbling up
    });

    // Swipe down gesture to close radio group
    var startY = 0;
    $(document).on('touchstart', function (e) {
        startY = e.originalEvent.touches[0].pageY;
    });

    $(document).on('touchmove', function (e) {
        var touchY = e.originalEvent.touches[0].pageY;
        if (touchY > startY && (touchY - startY) > 50) { // Swipe down threshold
            $('.slidefrombot').removeClass('show');
            $('body').removeClass('hasover');
        }
    });

    $('#betters input[name="option"]').on('change', function () {
        var radioValue = $('#betters input[name="option"]:checked').val();
        $('.main-bet-but').text(radioValue);
    });

    $(document).on('click', '.upcomebut', function () {
        $('.upcomebut').removeClass('active');
        if ($(this).hasClass('nextfull')) {
            $('.upcomebut').not(('.upcomebut.full')).hide();
            $(this).next('.upcomebut.full').addClass('active').show();
            $('.closeall').addClass('show').show();
        } else {
            $(this).addClass('active');
        }
    });

    $(document).on('click', '.upcomein', function () {
        $('.upcomein:not(.parent)').removeClass('active');
        $(this).addClass('active');
    });
    $(document).on('click', '.closeall', function () {
        $(this).removeClass('show').hide();
        $('.upcomebut.full').removeClass('active').hide();
        $('#upcome>.upcomebut:not(.full)').show();
        $('.upcomebut:first-child').addClass('active');
    });

    $(document).on('click', '.spoiler', function () {
        $(this).parent().toggleClass('toggled');
        $(this).next('.gamecontent').slideToggle();
    });

    $(document).on('click', '.better-rates', function () {
        $('.betters-fullinfo').addClass('active');
    });



    $(document).on('click', '.gameheader.spoiler.singlebetter', function () {
        $(this).toggleClass('active');
    });



    $(document).on('click', '.goback', function () {
        $('.betters-fullinfo').removeClass('active');
    });

});

// FOOTBALL API
(function ($) {
    var currentDate = new Date();
    var today = formatDate(currentDate);
const apikey = '6b595851d5eefee94b1a6113b126e089';
    var data = '';
var settings = {
    "url": "https://v3.football.api-sports.io/fixtures?timezone=339&date="+today,
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

    var settings2 = {
        "url": "https://v3.football.api-sports.io/odds?league=2&season=2024&fixture=1273688",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "x-rapidapi-key": apikey,
            "x-rapidapi-host": "v3.football.api-sports.io"
        },
    };

    $.ajax(settings2).done(function (response) {
        console.log(response);
    });

    function refresh_data(data) {
        var decoded_data = data;
        //var allowed_league_ids = [2, 3, 39, 140, 78, 71, 61, 91, 119, 1, 13, 12];
        var allowed_league_ids = [2, 3, 39, 140, 78, 71, 61, 91, 119, 1, 13, 12,48,660,772,906,932,931,933,939,1020,1128];
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

        function renderLeague(fixtures, isAllowedLeague) {
            // Create a spoiler div for the league
            if(isAllowedLeague) {
                var istop = '';
                var lcountry = '<div class="badge">'+fixtures[0].league.country+'</div>';
                if(fixtures[0].league.country === 'World') {
                    istop = '<div class="badge hot"><i class="fas fa-fire"></i>Top</div>';
                    lcountry = '<div class="badge int"><i class="fas fa-globe"></i>'+fixtures[0].league.country+'</div>';
                }
                var leagueSpoiler =
                    '<div class="gameheader spoiler"  data-lg-id="'+fixtures[0].league.id+'">' +istop+lcountry+
                    '<div class="badge league"><i><img src="'+fixtures[0].league.logo+'"></i><span>'+fixtures[0].league.name +'</span></div>'+
                    '</div>';

                var leagueData =
                    '<div class="gamerow' + (isAllowedLeague ? ' pinned' : '') + '"  data-lg-id="' + fixtures[0].league.id + '">'+leagueSpoiler+'<div class="gamecontent">' +
                    '<div class="league-row"><div class="badge league standings load-standng-widget" data-league="'+fixtures[0].league.id+'"><i><img src="'+fixtures[0].league.logo+'"></i><span>Standings</span><i class="afterbadge fas fa-external-link-alt"></i></div></div>';

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
                        matchstat = '<div data-fixid="'+fixture.fixture.id+'" class="badge live">live</div>';
                        showtime = '<div class="badge timer"><i class="fas fa-clock"></i>'+fstatlong+'</div>';
                        matchtime = '<div class="badge timer"><i class="fas fa-stopwatch"></i>'+fstatelap+'</div>';
                    }

                    if (fstat === 'LIVE' || fstat === '1H' || fstat === 'HT' || fstat === '2H' || fstat === 'ET' || fstat === 'P') {
                        matchstat = '<div data-fixid="'+fixture.fixture.id+'" class="badge live">live</div>';
                        showtime = '<div class="badge timer"><i class="fas fa-clock"></i>'+fstatlong+'</div>';
                        matchtime = '<div class="badge timer"><i class="fas fa-stopwatch"></i>'+fstatelap+'</div>';
                    }

                    if (fstat === 'NS') {
                        matchstat = '<div data-fixid="'+fixture.fixture.id+'" class="badge">Not started</div>';
                        showtime = '<div class="badge timer"><i class="fas fa-clock"></i>'+ starttime+'</div>';
                    }

                    var codd = '';
                    for (var i = 0; i < 3; i++) {
                        var randomNumber = getRandomNumber(0.00, 5.00, 0.01);
                        codd += '<span>' + randomNumber + '</span>';
                    }

                    var number1 = getRandomPerc(1, 98);
                    var number2 = getRandomPerc(1, 99 - number1);
                    var number3 = 100 - number1 - number2;

                    var better = '';
                    var abetter = '';
                    if(number1 > number3){
                        better = ' better';
                    }else{
                        abetter = ' better';
                    }
                    var pred = '<span class="normal'+better+'">'+number1+'%</span><span>'+number2+'%</span><span class="away'+abetter+'">'+number3+'%</span>';

                    var fixture_row =
                       '<div class="gamerow" data-fixid="'+fixture.fixture.id+'">'+
                       '<div class="gamebadges">'+matchstat+showtime+matchtime+'</div>'+
                       '<div class="game-stat">'+
                            '<div class="team thome">'+home_team_name+'</div>'+
                            '<div class="results">'+goals_home+':'+goals_away+'</div>'+
                            '<div class="team tguest">'+away_team_name+'</div>'+
                        '</div>';

                    var betrow = ' <a class="banner full"><img src="img/banner5.png"></a>\n' +
                        '\n' +
                        '                    <div class="gameheader spoiler singlebetter active">\n' +
                        '                        1x2\n' +
                        '                    </div>\n' +
                        '                    <div class="gamecontent" style="display: block">\n' +
                        '                        <div class="betters-info">\n' +
                        '                            <div class="better-rates" data-rate="1x2">\n' +
                        '                                <div class="betterhead"><span>1x2</span></div>\n' +
                        '                                <div class="ratebadge btimg"><span><img src="img/1xbet.png"></span>\n' +
                        '                                    <p>1xBet</p>\n' +
                        '                                </div>\n' +
                        '                                <div class="ratebadge"><p>Brisbone City FC</p>\n' +
                        '                                    <p class="rate">1.92</p></div>\n' +
                        '                                <div class="ratebadge"><p>Draw</p>\n' +
                        '                                    <p class="rate">3.65</p></div>\n' +
                        '                                <div class="ratebadge"><p>Morenton Bay United FC</p>\n' +
                        '                                    <p class="rate">3.5</p></div>\n' +
                        '                            </div>\n' +
                        '                            <div class="better-rates" data-rate="1x2">\n' +
                        '                                <div class="ratebadge btimg"><span><img src="img/betwinner-logo.png"></span>\n' +
                        '                                    <p>BetWinner</p>\n' +
                        '                                </div>\n' +
                        '                                <div class="ratebadge"><p>Brisbone City FC</p>\n' +
                        '                                    <p class="rate">1.82</p></div>\n' +
                        '                                <div class="ratebadge"><p>Draw</p>\n' +
                        '                                    <p class="rate">3.75</p></div>\n' +
                        '                                <div class="ratebadge"><p>Morenton Bay United FC</p>\n' +
                        '                                    <p class="rate">3.56</p></div>\n' +
                        '                            </div>\n' +
                        '                            <div class="better-rates" data-rate="1x2">\n' +
                        '                                <div class="ratebadge btimg"><span><img src="img/Bet365-Logo.png"></span>\n' +
                        '                                    <p>Bet 365</p>\n' +
                        '                                </div>\n' +
                        '                                <div class="ratebadge"><p>Brisbone City FC</p>\n' +
                        '                                    <p class="rate">1.72</p></div>\n' +
                        '                                <div class="ratebadge"><p>Draw</p>\n' +
                        '                                    <p class="rate">3.55</p></div>\n' +
                        '                                <div class="ratebadge"><p>Morenton Bay United FC</p>\n' +
                        '                                    <p class="rate">3.66</p></div>\n' +
                        '                            </div>\n' +
                        '                        </div>\n' +
                        '                    </div>\n' +
                        '\n' +
                        '                    <div class="gameheader spoiler singlebetter active">\n' +
                        '                        1x2 Extra\n' +
                        '                    </div>\n' +
                        '                    <div class="gamecontent" style="display: block">\n' +
                        '                        <div class="betters-info">\n' +
                        '                            <div class="better-rates" data-rate="1x2 Extra">\n' +
                        '                                <div class="betterhead"><span>1x2 Extra</span></div>\n' +
                        '                                <div class="ratebadge btimg"><span><img src="img/1xbet.png"></span>\n' +
                        '                                    <p>1xBet</p>\n' +
                        '                                </div>\n' +
                        '                                <div class="ratebadge"><p>Brisbone City FC</p>\n' +
                        '                                    <p class="rate">1.92</p></div>\n' +
                        '                                <div class="ratebadge"><p>Draw</p>\n' +
                        '                                    <p class="rate">3.65</p></div>\n' +
                        '                                <div class="ratebadge"><p>Morenton Bay United FC</p>\n' +
                        '                                    <p class="rate">3.5</p></div>\n' +
                        '                            </div>\n' +
                        '                            <div class="better-rates" data-rate="1x2">\n' +
                        '                                <div class="ratebadge btimg"><span><img src="img/betwinner-logo.png"></span>\n' +
                        '                                    <p>BetWinner</p>\n' +
                        '                                </div>\n' +
                        '                                <div class="ratebadge"><p>Brisbone City FC</p>\n' +
                        '                                    <p class="rate">1.82</p></div>\n' +
                        '                                <div class="ratebadge"><p>Draw</p>\n' +
                        '                                    <p class="rate">3.75</p></div>\n' +
                        '                                <div class="ratebadge"><p>Morenton Bay United FC</p>\n' +
                        '                                    <p class="rate">3.56</p></div>\n' +
                        '                            </div>\n' +
                        '                            <div class="better-rates" data-rate="1x2">\n' +
                        '                                <div class="ratebadge btimg"><span><img src="img/Bet365-Logo.png"></span>\n' +
                        '                                    <p>Bet 365</p>\n' +
                        '                                </div>\n' +
                        '                                <div class="ratebadge"><p>Brisbone City FC</p>\n' +
                        '                                    <p class="rate">1.72</p></div>\n' +
                        '                                <div class="ratebadge"><p>Draw</p>\n' +
                        '                                    <p class="rate">3.55</p></div>\n' +
                        '                                <div class="ratebadge"><p>Morenton Bay United FC</p>\n' +
                        '                                    <p class="rate">3.66</p></div>\n' +
                        '                            </div>\n' +
                        '                        </div>\n' +
                        '                    </div>\n' +
                        '\n' +
                        '                    <div class="gameheader spoiler singlebetter active">\n' +
                        '                        1x2 Extra Time (1st Half)\n' +
                        '                    </div>\n' +
                        '                    <div class="gamecontent" style="display: block">\n' +
                        '                        <div class="betters-info">\n' +
                        '                            <div class="better-rates" data-rate="1x2 Extra">\n' +
                        '                                <div class="betterhead"><span>1x2 Extra Time (1st Half)</span></div>\n' +
                        '                                <div class="ratebadge btimg"><span><img src="img/1xbet.png"></span>\n' +
                        '                                    <p>1xBet</p>\n' +
                        '                                </div>\n' +
                        '                                <div class="ratebadge"><p>Brisbone City FC</p>\n' +
                        '                                    <p class="rate">1.92</p></div>\n' +
                        '                                <div class="ratebadge"><p>Draw</p>\n' +
                        '                                    <p class="rate">3.65</p></div>\n' +
                        '                                <div class="ratebadge"><p>Morenton Bay United FC</p>\n' +
                        '                                    <p class="rate">3.5</p></div>\n' +
                        '                            </div>\n' +
                        '                            <div class="better-rates" data-rate="1x2">\n' +
                        '                                <div class="ratebadge btimg"><span><img src="img/betwinner-logo.png"></span>\n' +
                        '                                    <p>BetWinner</p>\n' +
                        '                                </div>\n' +
                        '                                <div class="ratebadge"><p>Brisbone City FC</p>\n' +
                        '                                    <p class="rate">1.82</p></div>\n' +
                        '                                <div class="ratebadge"><p>Draw</p>\n' +
                        '                                    <p class="rate">3.75</p></div>\n' +
                        '                                <div class="ratebadge"><p>Morenton Bay United FC</p>\n' +
                        '                                    <p class="rate">3.56</p></div>\n' +
                        '                            </div>\n' +
                        '                            <div class="better-rates" data-rate="1x2">\n' +
                        '                                <div class="ratebadge btimg"><span><img src="img/Bet365-Logo.png"></span>\n' +
                        '                                    <p>Bet 365</p>\n' +
                        '                                </div>\n' +
                        '                                <div class="ratebadge"><p>Brisbone City FC</p>\n' +
                        '                                    <p class="rate">1.72</p></div>\n' +
                        '                                <div class="ratebadge"><p>Draw</p>\n' +
                        '                                    <p class="rate">3.55</p></div>\n' +
                        '                                <div class="ratebadge"><p>Morenton Bay United FC</p>\n' +
                        '                                    <p class="rate">3.66</p></div>\n' +
                        '                            </div>\n' +
                        '                        </div>\n' +
                        '                    </div>\n' +
                        '\n' +
                        '                    <div class="gameheader spoiler singlebetter active">\n' +
                        '                        1x2 - 10...80 minutes\n' +
                        '                    </div>\n' +
                        '                    <div class="gamecontent" style="display: block">\n' +
                        '                        <div class="betters-info">\n' +
                        '                            <div class="better-rates" data-rate="1x2 Extra">\n' +
                        '                                <div class="betterhead"><span>1x2 - 10 minutes</span></div>\n' +
                        '                                <div class="ratebadge btimg"><span><img src="img/1xbet.png"></span>\n' +
                        '                                    <p>1xBet</p>\n' +
                        '                                </div>\n' +
                        '                                <div class="ratebadge"><p>Brisbone City FC</p>\n' +
                        '                                    <p class="rate">1.92</p></div>\n' +
                        '                                <div class="ratebadge"><p>Draw</p>\n' +
                        '                                    <p class="rate">3.65</p></div>\n' +
                        '                                <div class="ratebadge"><p>Morenton Bay United FC</p>\n' +
                        '                                    <p class="rate">3.5</p></div>\n' +
                        '                            </div>\n' +
                        '                            <div class="better-rates" data-rate="1x2">\n' +
                        '                                <div class="ratebadge btimg"><span><img src="img/betwinner-logo.png"></span>\n' +
                        '                                    <p>BetWinner</p>\n' +
                        '                                </div>\n' +
                        '                                <div class="ratebadge"><p>Brisbone City FC</p>\n' +
                        '                                    <p class="rate">1.82</p></div>\n' +
                        '                                <div class="ratebadge"><p>Draw</p>\n' +
                        '                                    <p class="rate">3.75</p></div>\n' +
                        '                                <div class="ratebadge"><p>Morenton Bay United FC</p>\n' +
                        '                                    <p class="rate">3.56</p></div>\n' +
                        '                            </div>\n' +
                        '                            <div class="better-rates" data-rate="1x2">\n' +
                        '                                <div class="ratebadge btimg"><span><img src="img/Bet365-Logo.png"></span>\n' +
                        '                                    <p>Bet 365</p>\n' +
                        '                                </div>\n' +
                        '                                <div class="ratebadge"><p>Brisbone City FC</p>\n' +
                        '                                    <p class="rate">1.72</p></div>\n' +
                        '                                <div class="ratebadge"><p>Draw</p>\n' +
                        '                                    <p class="rate">3.55</p></div>\n' +
                        '                                <div class="ratebadge"><p>Morenton Bay United FC</p>\n' +
                        '                                    <p class="rate">3.66</p></div>\n' +
                        '                            </div>\n' +
                        '                        </div>\n' +
                        '                    </div>\n' +
                        '\n' +
                        '                    <div class="gameheader spoiler singlebetter active">\n' +
                        '                        Double Chance\n' +
                        '                    </div>\n' +
                        '                    <div class="gamecontent" style="display: block">\n' +
                        '                        <div class="betters-info">\n' +
                        '                            <div class="better-rates" data-rate="1x2 Extra">\n' +
                        '                                <div class="betterhead"><span>Double Chance</span></div>\n' +
                        '                                <div class="ratebadge btimg"><span><img src="img/1xbet.png"></span>\n' +
                        '                                    <p>1xBet</p>\n' +
                        '                                </div>\n' +
                        '                                <div class="ratebadge"><p>Brisbone City FC</p>\n' +
                        '                                    <p class="rate">1.92</p></div>\n' +
                        '\n' +
                        '                                <div class="ratebadge"><p>Morenton Bay United FC</p>\n' +
                        '                                    <p class="rate">3.5</p></div>\n' +
                        '                            </div>\n' +
                        '                            <div class="better-rates" data-rate="1x2">\n' +
                        '                                <div class="ratebadge btimg"><span><img src="img/betwinner-logo.png"></span>\n' +
                        '                                    <p>BetWinner</p>\n' +
                        '                                </div>\n' +
                        '                                <div class="ratebadge"><p>Brisbone City FC</p>\n' +
                        '                                    <p class="rate">1.82</p></div>\n' +
                        '\n' +
                        '                                <div class="ratebadge"><p>Morenton Bay United FC</p>\n' +
                        '                                    <p class="rate">3.56</p></div>\n' +
                        '                            </div>\n' +
                        '                            <div class="better-rates" data-rate="1x2">\n' +
                        '                                <div class="ratebadge btimg"><span><img src="img/Bet365-Logo.png"></span>\n' +
                        '                                    <p>Bet 365</p>\n' +
                        '                                </div>\n' +
                        '                                <div class="ratebadge"><p>Brisbone City FC</p>\n' +
                        '                                    <p class="rate">1.72</p></div>\n' +
                        '\n' +
                        '                                <div class="ratebadge"><p>Morenton Bay United FC</p>\n' +
                        '                                    <p class="rate">3.66</p></div>\n' +
                        '                            </div>\n' +
                        '                        </div>\n' +
                        '                    </div>\n' +
                        '\n' +
                        '\n' +
                        '                    <div class="gameheader spoiler singlebetter active">\n' +
                        '                        Draw No Bet\n' +
                        '                    </div>\n' +
                        '                    <div class="gamecontent" style="display: block">\n' +
                        '                        <div class="betters-info">\n' +
                        '                            <div class="better-rates" data-rate="1x2 Extra">\n' +
                        '                                <div class="betterhead"><span>Draw No Bet</span></div>\n' +
                        '                                <div class="ratebadge btimg"><span><img src="img/1xbet.png"></span>\n' +
                        '                                    <p>1xBet</p>\n' +
                        '                                </div>\n' +
                        '                                <div class="ratebadge"><p>Brisbone City FC</p>\n' +
                        '                                    <p class="rate">1.92</p></div>\n' +
                        '\n' +
                        '                                <div class="ratebadge"><p>Morenton Bay United FC</p>\n' +
                        '                                    <p class="rate">3.5</p></div>\n' +
                        '                            </div>\n' +
                        '                            <div class="better-rates" data-rate="1x2">\n' +
                        '                                <div class="ratebadge btimg"><span><img src="img/betwinner-logo.png"></span>\n' +
                        '                                    <p>BetWinner</p>\n' +
                        '                                </div>\n' +
                        '                                <div class="ratebadge"><p>Brisbone City FC</p>\n' +
                        '                                    <p class="rate">1.82</p></div>\n' +
                        '\n' +
                        '                                <div class="ratebadge"><p>Morenton Bay United FC</p>\n' +
                        '                                    <p class="rate">3.56</p></div>\n' +
                        '                            </div>\n' +
                        '                            <div class="better-rates" data-rate="1x2">\n' +
                        '                                <div class="ratebadge btimg"><span><img src="img/Bet365-Logo.png"></span>\n' +
                        '                                    <p>Bet 365</p>\n' +
                        '                                </div>\n' +
                        '                                <div class="ratebadge"><p>Brisbone City FC</p>\n' +
                        '                                    <p class="rate">1.72</p></div>\n' +
                        '\n' +
                        '                                <div class="ratebadge"><p>Morenton Bay United FC</p>\n' +
                        '                                    <p class="rate">3.66</p></div>\n' +
                        '                            </div>\n' +
                        '                        </div>\n' +
                        '                    </div>\n' +
                        '\n' +
                        '                    <div class="gameheader spoiler singlebetter active">\n' +
                        '                        Fulltime Result\n' +
                        '                    </div>\n' +
                        '                    <div class="gamecontent" style="display: block">\n' +
                        '                        <div class="betters-info">\n' +
                        '                            <div class="better-rates" data-rate="1x2 Extra">\n' +
                        '                                <div class="betterhead"><span>Fulltime Result</span></div>\n' +
                        '                                <div class="ratebadge btimg"><span><img src="img/1xbet.png"></span>\n' +
                        '                                    <p>1xBet</p>\n' +
                        '                                </div>\n' +
                        '                                <div class="ratebadge"><p>Brisbone City FC</p>\n' +
                        '                                    <p class="rate">1.92</p></div>\n' +
                        '                                <div class="ratebadge"><p>Draw</p>\n' +
                        '                                    <p class="rate">3.65</p></div>\n' +
                        '                                <div class="ratebadge"><p>Morenton Bay United FC</p>\n' +
                        '                                    <p class="rate">3.5</p></div>\n' +
                        '                            </div>\n' +
                        '                            <div class="better-rates" data-rate="1x2">\n' +
                        '                                <div class="ratebadge btimg"><span><img src="img/betwinner-logo.png"></span>\n' +
                        '                                    <p>BetWinner</p>\n' +
                        '                                </div>\n' +
                        '                                <div class="ratebadge"><p>Brisbone City FC</p>\n' +
                        '                                    <p class="rate">1.82</p></div>\n' +
                        '                                <div class="ratebadge"><p>Draw</p>\n' +
                        '                                    <p class="rate">3.75</p></div>\n' +
                        '                                <div class="ratebadge"><p>Morenton Bay United FC</p>\n' +
                        '                                    <p class="rate">3.56</p></div>\n' +
                        '                            </div>\n' +
                        '                            <div class="better-rates" data-rate="1x2">\n' +
                        '                                <div class="ratebadge btimg"><span><img src="img/Bet365-Logo.png"></span>\n' +
                        '                                    <p>Bet 365</p>\n' +
                        '                                </div>\n' +
                        '                                <div class="ratebadge"><p>Brisbone City FC</p>\n' +
                        '                                    <p class="rate">1.72</p></div>\n' +
                        '                                <div class="ratebadge"><p>Draw</p>\n' +
                        '                                    <p class="rate">3.55</p></div>\n' +
                        '                                <div class="ratebadge"><p>Morenton Bay United FC</p>\n' +
                        '                                    <p class="rate">3.66</p></div>\n' +
                        '                            </div>\n' +
                        '                        </div>\n' +
                        '                    </div>'


                   var nextgame = '<div class="gamebadges ginfo" data-fixid="'+fixture.fixture.id+'"><div class="badge"><i class="fas fa-info-circle"></i>Game info</div></div><div class="endgame"></div></div>';
                    leagueData += fixture_row +nextgame;
                });

                leagueData += '</div></div>'; // END league-data
            }
            $('.gamescontainer').append(leagueData);
        }
       // console.log(grouped_by_league);
    }


    function tstotime(timestamp){
        var date = new Date(timestamp * 1000);
        var hours = date.getUTCHours();
        var minutes = date.getUTCMinutes();
        var formattedTime = (hours < 10 ? '0' : '') + hours + ':' + (minutes < 10 ? '0' : '') + minutes;
        return formattedTime;
    }

    function formatDate(date) {
        var year = date.getFullYear();
        var month = ('0' + (date.getMonth() + 1)).slice(-2);
        var day = ('0' + date.getDate()).slice(-2);
        return year + '-' + month + '-' + day;
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
})(jQuery);