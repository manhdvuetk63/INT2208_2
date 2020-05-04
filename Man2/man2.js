$(document).ready(function () {
    var status = 0;
    var scene = $('.scene');
    var shape = $('.scene .figure');
    var ball = $('.inner_progress i');
    var vitri = 0;
    var status_game = 0;

    scene.fadeIn(1000);
    $(shape[status]).fadeIn(1000);
    function chuyenman() {
        vitri = 440 - (status) * 24;
        $(ball[5 - status]).animate({left: vitri}, 1000);
        status++;
        if (status == 6) {
            setTimeout(function () {
                window.location=  window.location = "../Thangthua/Thang/win.html";
            },2000);
        } else {
            setTimeout(function () {
                revert();
                scene.fadeOut();
                $(shape[status_game]).fadeOut();
                scene.fadeIn(1000);
                if (status_game >= 7) status_game = 0;
                $(shape[++status_game]).fadeIn(1000);
            }, 1000);
            console.log('statusgame' + status_game);
        }
    };
    function animationForTrueSquare() {
        $('.button-ok').css('opacity', '0');
        $('.stick_fly_1').css('backgroundImage', 'url(img/39.png)',);
        $('.stick_fly_1').animate({
            left: '90px',
            top: '370px'
        }, 1500);
        setTimeout(function () {
            $('.stick_fly_1').css('backgroundImage', 'url(img/41.png)',)
        }, 1500);
    }

    function animationForTrueCircle() {
        $('.button-ok').css('opacity', '0');
        $('.stick_fly_2').css('backgroundImage', 'url(img/39.png)',);
        $('.stick_fly_2').animate({
            left: '90px',
            top: '370px'
        }, 1500);
        setTimeout(function () {
            $('.stick_fly_2').css('backgroundImage', 'url(img/41.png)',)
        }, 1500);
    }
    function revert() {
        $('.button-ok').css('opacity', '1');
        $('.stick_fly').css({
            left: "",
            top: "",
            backgroundImage: ""
        });
    }
    function err() {
        vitri = (5 - status) * 24 + 4;
        $(ball[5 - status]).animate({left: vitri}, 1000);
        console.log(status);
    };
    $('.stick_fly_2 .button-ok').click(function () {
        if ($(shape[status_game]).hasClass('circle')) {
            animationForTrueCircle();
            setTimeout(function () {
                chuyenman(status);
            }, 2200);
            console.log(status);
        } else {
            status--;
            $('.stick_fly_2 .button-ok__wrong').css('opacity', '1');
            setTimeout(function () {
                $('.stick_fly_2 .button-ok__wrong').css('opacity', '0');
            }, 200);
            err();
        }
    })
    $('.stick_fly_1 .button-ok').click(function () {
        if ($(shape[status_game]).hasClass('square')) {
            animationForTrueSquare();
            setTimeout(function () {
                chuyenman(status);
            }, 2200);
            console.log(status);
        } else {
            status--;
            $('.stick_fly_1 .button-ok__wrong').css('opacity', '1');
            setTimeout(function () {
                $('.stick_fly_1 .button-ok__wrong').css('opacity', '0');
            }, 200);
            err();
        }
    });

});