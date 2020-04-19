$(document).ready(function () {
    var status = 0;
    var scene = $('.scene');
    var shape = $('.scene .figure');
    var ball = $('.inner_progress i');
    var vitri = 0;
    scene.fadeIn(1000);

    $(shape[status]).fadeIn(1000);

    function chuyenman() {
        vitri = 440 - (status) * 24;
        $(ball[5 - status]).animate({left: vitri}, 1000);
        setTimeout(function () {
            scene.fadeOut();
            $(shape[status]).fadeOut();
            scene.fadeIn(1000);
            $(shape[++status]).fadeIn(1000);
        }, 1000);
    };

    $('.stick_fly_2 .button-ok').click(function () {
        if ($(shape[status]).hasClass('circle')) {
            chuyenman(status);
            console.log(status);
        } else {
            $('.button-ok__wrong').css('opacity','1');
        }
    })
    $('.stick_fly_1 .button-ok').click(function () {

        if ($(shape[status]).hasClass('square')) {

            chuyenman();
            console.log(status);
        } else {
            err();
        }
    });
});