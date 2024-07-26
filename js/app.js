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
    $(document).on('click', '.goback', function () {
        $('.betters-fullinfo').removeClass('active');
    });

});