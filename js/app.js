const apibase = 'https://api.flashscore.ai';
window.a_t = null;
function getAT(tgid,tgname,mail,register, reverify, skip) {
    var sdata =  sdata = JSON.stringify({peer_id: tgid,username: tgname});
    if(register && reverify){
        sdata = JSON.stringify({peer_id: tgid,username: tgname,email:mail,new_email:true});
    }
    if(skip){
        sdata = JSON.stringify({peer_id: tgid,username: tgname,skip_registration:true});
    }
    $.ajax({
        url: apibase + '/api/auth/login',
        type: 'POST',
        contentType: 'application/json',
        data: sdata,
        success: function (response) {
            a_t = response.data.access_token;
            u_m = response.data.peer_info.email;
            u_mv = response.data.peer_info.email_verified;
            var is_skip = response.data.peer_info.skip_registration;
            console.log(u_m,u_mv);
            $('input[name="email"]').val(u_m);
            $('input[name="username"]').val(tgname);
            $('input[name="tg_id"]').val(tgid);
            $('input[name="tg_id2"]').val(tgid);
            $('input[name="token"]').val(a_t);
            $('#upemail').text(u_m);


            if(is_skip == null || !is_skip) {
                if (u_m == null) {
                    $('#authbut').trigger('click');
                }
                if (!u_mv && u_m !== null) {
                    if (reverify) {
                        sendverify(a_t);
                    }
                    $('#evalid').trigger('click');
                }
            }
            if(!register && !reverify) {
                soccerdata(a_t);
            }

        },
        error: function (xhr, status, error) {
            console.error('Error:', error);
        }
    });
}

function sendverify(token) {
    $.ajax({
        url: apibase + '/api/auth/verify/send',
        type: 'POST',
        contentType: 'application/json',
        data: 1,
        headers: {
            'Authorization': 'Bearer '+ token
        },
        success: function (response) {
        console.log(response);
        },
        error: function (xhr, status, error) {
            console.error('Error:', error);
        }
    });
}

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
    $('.main-bet-but').on('click', function (b) {
        $(this).next('.slidefrombot').toggleClass('show');
        $('body').toggleClass('hasover');
        b.stopImmediatePropagation();
    });

    $('input[name="betoption"]').on('click', function() {
        if ($(this).is(':checked')) {
            var adimg = $(this).data('logo');
            var adlink = $(this).data('href');
            $('.main-bet-but.bettype.adsbut img').attr('src', adimg);
            $('#ads a').attr('href', adlink);
        }
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

});


$(function() {
    $(document).on('click', '#authbut', function (a) {
        $('body').toggleClass('hasover');
        $('#auth').toggleClass('show');
        a.stopImmediatePropagation();
    });
});

let isClickable = true;
$(function() {

    $('#doreg,span.resend').click(function () {
        if (!isClickable) return;
        var tgidf = $('input[name="tg_id"]').val();
        var tgunf = $('input[name="username"]').val();
        var mail = $('input[name="email"]').val();
        isClickable = false;
        getAT(tgidf,tgunf,mail,true,true, false);
        setTimeout(function () {
            isClickable = true;
        }, 1000);
    });

    $('#doregskip').click(function () {
        if (!isClickable) return;
        var tgidf = $('input[name="tg_id"]').val();
        var tgunf = $('input[name="username"]').val();
        var mail = $('input[name="email"]').val();
        isClickable = false;
        getAT(tgidf,tgunf,mail,true,true, true);
        setTimeout(function () {
            $('.slidefrombot').removeClass('show');
            $('body').removeClass('hasover');
            isClickable = true;
        }, 1000);
    });

});
$(function() {
    $(document).on('click', '#evalid', function (c) {
        $('body').toggleClass('hasover');
        $('#evalf').toggleClass('show');
        c.stopImmediatePropagation();
    });
});
$(function() {
    $('#dovalidate').click(function () {
        if (!isClickable) return;
        var token = $('input[name="token"]').val();
        var vcode = $('input[name="valcode"]').val();
        isClickable = false;
        sendvalcode(token,vcode);
        setTimeout(function () {
            isClickable = true;
        }, 1000);
    });
});

function sendvalcode(token,vcode){
    var vdata = JSON.stringify({code: vcode});
    $.ajax({
        url: apibase + '/api/auth/verify',
        type: 'POST',
        contentType: 'application/json',
        data: vdata,
        headers: {
            'Authorization': 'Bearer '+ token
        },
        success: function (response) {
            if (response.success){
                console.log('Verified');
                $('.validateemail .bpop').html('<p class="resendtext">Your email validated.<br> Thank you!</p>');
                setTimeout(function() {
                    $('.slidefrombot').removeClass('show');
                    $('body').removeClass('hasover');
                }, 2000);
             }
        },
        error: function (xhr, status, error) {
            console.error('Error:', error);
        }
    });
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