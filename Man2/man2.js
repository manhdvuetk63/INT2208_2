$(document).ready(function () {
    var status = 0;
    var scene = $('.scene');
    var shape = $('.scene .figure');
    var ball= $('.inner_progress i');
    var vitri=0;
    scene.fadeIn(1000);

    $(shape[status]).fadeIn(1000);

    function chuyenman() {
        vitri=440 -(status)*24;
        $(ball[status]).animate({left: vitri},1000);
        setTimeout(function () {
            scene.fadeIn(1000);
            $(shape[++status]).fadeIn(1000);
        },1000);

}
    $('.stick_fly_2 .button-ok').click(function () {
        if ($(shape[status]).hasClass('circle')){
            scene.fadeOut();
            $(shape[status]).fadeOut();
            chuyenman(status);
            console.log(status);
        }
        else {
        }
    })
    $('.stick_fly_1 .button-ok').click(function () {

        if ($(shape[status]).hasClass('square')){
            scene.fadeOut();
            $(shape[status]).fadeOut();
            chuyenman();
            console.log(status);
        }
        else {
        }
    })


})