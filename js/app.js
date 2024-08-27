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
        $(this).next('.slidefrombot').toggleClass('show');
        $('body').toggleClass('hasover');
    });

    $('input[name="betoption"]').on('change', function() {
        if ($(this).val() === '0' && $(this).is(':checked')) {
            $('input[name="betoption"]').not(this).prop('checked', false);
            $('.singlebet').addClass('active');
        }else{
            $('input[name="betoption"][value="0"]').prop('checked', false);
            var activebetters = [];
            $('input[name="betoption"]:checked').each(function() {
                activebetters.push(parseInt($(this).val(), 10));
            });
            $('.singlebet').removeClass('active');
            $.each( activebetters, function(index, id) {
                $('.singlebet[data-better-id="'+id+'"]').addClass('active');
            });
        }
    });

    $('input[name="bettype"]').on('change', function() {
        var newopt = $(this).val();
        $('.bet-group').removeClass('active');
        $('.bet-group[data-bet-id="'+newopt+'"]').addClass('active');
    });


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


    $(document).on('click', '.btn.allbets', function () {
        $('body').addClass('noscroll');
        $('.betters-fullinfo .gamebetfulldata').html('');
        var thisfix = $(this).parents('.lgamerow').data('fixid');
        var thishtml = $(this).parents('.gamerow').html();
        $('.betters-fullinfo .gamebetfulldata').html(thishtml);
        $('.betters-fullinfo').addClass('active');
        $('.goback').fadeIn('slow');
    });

    $(document).on('click', '.goback', function () {
        $('.betters-fullinfo').removeClass('active');
        $('body').removeClass('noscroll');
        $('.betters-fullinfo .gamebetfulldata').html('');
        $('.goback').hide();
    });

    $(document).on('click', '.upcomebut.live', function () {
        $('.gamerow').each(function(index) {
            $(this).removeClass('notstarted');
            var fstat = $(this).data('status');
            if (fstat === 'LIVE' || fstat === '1H' || fstat === 'HT' || fstat === '2H' || fstat === 'ET' || fstat === 'P'){
                $(this).show().addClass('livenow');
                }else{
                $(this).hide();
            }
    });
        $('.lgamerow').each(function() {
            if ($(this).find('.livenow').length > 0) {
                if ($(this).index() > 0) {
                    $(this).find('.gameheader.spoiler').trigger('click');
                }
            }else{
                $(this).hide();
            }
        });
    });

    $(document).on('click', '.upcomebut.allupcome, .upcomein.s24h', function () {
        $('.gamerow').each(function(index) {
            var fstat = $(this).data('status');
            $(this).removeClass('livenow');
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
        var uptime = parseInt($(this).data('upcome'));
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
                $(this).show();
            }else{
                $(this).hide();
            }

           });
    });



    $(document).on('click', '.upcomebut.allgames, .upcomeclose', function () {
        $('.gamerow').each(function(index) {
                $(this).removeClass('livenow');
                $(this).show();
             });
        $('.lgamerow').show();
    });



});
