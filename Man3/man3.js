$(document).ready(function () {

    var countA = 0; // đếm số lượng hình vuông
    var countB = 0; //đếm số lượng hình tròn
    var countC = 0;
    var countD = 0;
    var mangA = [
        [200, 350],
        [80, 300],
        [60, 220],
        [170, 200],
        [140, 320]
    ];

    var healthA = 3;
    var healthB = 3;
    var mangB = [
        [770, 350],
        [690, 300],
        [800, 220],
        [850, 250],
        [700, 190]
    ];

    //sence 1
    // Xử lý kéo thả các khối vuông-tròn
    $('.sence-1 .openhand.circle,.sence-1 .openhand.square').draggable({
        scroll: true,
        containment: ".boxgame",
        revert: "invalid",
        disable: true,
        stop: function (event, ui) {
            $('div.figure').removeClass("active-draggable");
            $(ui.draggable).draggable("option", "revert", "invalid");
        }
    });
    $('.sence-1 .openhand.khac').draggable({
        scroll: true,
        containment: ".boxgame",
        revert: true,
        disable: true,
        stop: function (event, ui) {
            $('.sence-1 div.figure').removeClass("active-draggable");
        }
    });

    // Xử lý voi bên trái
    $('.sence-1 .monster_holder.left').droppable({
        over: function (event, ui) {
            if (countA < 5) {
                $('.sence-1 .monster_holder.left .monster.active').addClass('eat');
            }
        },
        out: function (event, ui) {
            if (countA < 5) {
                $('.sence-1 .monster_holder.left .monster.active').removeClass('eat');
            }
        },
        drop: function (event, ui) {
            if (countA < 5) {
                $(ui.draggable).animate({
                    left: '50',
                    top: '100',
                    opacity: '1'
                }, 500);
                if ($(ui.draggable).hasClass('square')) {
                    $(ui.draggable).draggable("option", "revert", "invalid");
                    shapeAnimation(ui.draggable, mangA, countA);
                    countA++;
                }
                setTimeout(function () {
                    $('.sence-1 .monster_holder.left .monster.active').removeClass('eat');
                }, 600);
                if (!$(ui.draggable).hasClass('square')) {
                    setTimeout(function () {
                        $('.sence-1 .monster_holder.left .red').css('opacity', '1');
                        $('.sence-1 .monster_holder.left .nose').css('opacity', '0');
                    }, 200);
                    setTimeout(function () {
                        $('.sence-1 .monster_holder.left .red').css('opacity', '0');
                        $('.sence-1 .monster_holder.left .nose').css('opacity', '1');
                    }, 2000);
                    $(ui.draggable).draggable("option", "revert", true);
                    $('.sence-1 .life.life_3:last-child').remove();
                    healthA--;
                    if (healthA == 0) {
                        $('.sence-1 .figure').css('display', 'none');
                        $('.sence-1 .lose_label').css('display', 'block');
                    }
                }
            }
            if (countA == 5) {
                setTimeout(function () {
                    $('.sence-1 .monster_holder.left .active,.sence-1 .monster_holder.left .red,.sence-1 .monster_holder.left .mouth,.sence-1 .monster_holder.left .nose').css("opacity", "0");
                    $('.sence-1 .monster_holder.left .sleep').css('opacity', '1');
                    $('.sence-1 .square').css('opacity', '0');
                    $('.sence-1 .table_place.left,.sence-1 .label_table.left').css('opacity', '0');
                }, 4000)
            }
            if (countA == 5 && countB == 5) {
                setTimeout(function () {
                    $('.sence-1').css('display', 'none');
                    $('.sence-2').css('display', 'block');
                    $('#bead1').animate({left: '440px'}, 1000);
                }, 7000);
            }
            ;
        }
    });

    // Xử lý con voi bên phải
    $('.sence-1 .monster_holder.right').droppable({
        over: function (event, ui) {
            if (countB < 5) {
                $('.sence-1 .monster_holder.right .monster.active').addClass('eat');
            }
        },
        out: function (event, ui) {
            if (countB < 5) {
                $('.sence-1 .monster_holder.right .monster.active').removeClass('eat');
            }
        },
        drop: function (event, ui) {
            if (countB < 5) {
                $(ui.draggable).animate({
                    left: '810',
                    top: '100',
                    opacity: '1'
                }, 500);
                if ($(ui.draggable).hasClass('circle')) {
                    $(ui.draggable).draggable("option", "revert", "invalid");
                    shapeAnimation(ui.draggable, mangB, countB);
                    countB++;
                }
                setTimeout(function () {
                    $('.sence-1 .monster_holder.right .monster.active').removeClass('eat');
                }, 600);
                if (!$(ui.draggable).hasClass('circle')) {
                    setTimeout(function () {
                        $('.sence-1 .monster_holder.right .red').css('opacity', '1');
                        $('.sence-1 .monster_holder.right .nose').css('opacity', '0');
                    }, 200);
                    setTimeout(function () {
                        $('.sence-1 .monster_holder.right .red').css('opacity', '0');
                        $('.sence-1 .monster_holder.right .nose').css('opacity', '1');
                    }, 2000);
                    $(ui.draggable).draggable("option", "revert", true);
                    $('.sence-1 .life.life_3:last-child').remove();
                    healthA--;
                    if (healthA == 0) {
                        $('.sence-1 .figure').css('display', 'none');
                        $('.sence-1 .lose_label').css('display', 'block');
                    }
                }
            }
            if (countB == 5) {
                setTimeout(function () {
                    $('.sence-1 .monster_holder.right .active,.sence-1 .monster_holder.right .red,.sence-1 .monster_holder.right .mouth,.sence-1 .monster_holder.right .nose').css("opacity", "0");
                    $('.sence-1 .monster_holder.right .sleep').css('opacity', '1');
                    $('.sence-1 .circle').css('opacity', '0');
                    $('.sence-1 .table_place.right,.sence-1 .label_table.right').css('opacity', '0');
                }, 4000)
            }
            ;
            if (countA == 5 && countB == 5) {
                setTimeout(function () {
                    $('.sence-1').css('display', 'none');
                    $('.sence-2').css('display', 'block');
                    $('#bead1').animate({left: '440px'}, 1000);
                }, 7000);
            }
        }
    });


    // sence 2

    // Xử lý kéo thả các khối vuông-tròn
    $('.sence-2 .openhand.circle,.sence-2 .openhand.square').draggable({
        scroll: true,
        containment: ".boxgame",
        revert: "invalid",
        disable: true,
   
        stop: function (event, ui) {
            $('div.figure').removeClass("active-draggable");
            $(ui.draggable).draggable("option", "revert", "invalid");
        }
    });
    $('.sence-2 .openhand.khac').draggable({
        scroll: true,
        containment: ".boxgame",
        revert: true,
        disable: true,
        stop: function (event, ui) {
            $('.sence-2 div.figure').removeClass("active-draggable");
        }
    });

    // Xử lý voi bên trái
    $('.sence-2 .monster_holder.left').droppable({
        over: function (event, ui) {
            if (countC < 5) {
                $('.sence-2 .monster_holder.left .monster.active').addClass('eat');
            }
        },
        out: function (event, ui) {
            if (countC < 5) {
                $('.sence-2 .monster_holder.left .monster.active').removeClass('eat');
            }
        },
        drop: function (event, ui) {
            if (countC < 5) {
                $(ui.draggable).animate({
                    left: '50',
                    top: '100',
                    opacity: '1'
                }, 500);
                if ($(ui.draggable).hasClass('square')) {
                    $(ui.draggable).draggable("option", "revert", "invalid");
                    shapeAnimation(ui.draggable, mangA, countC);
                    countC++;
                }
                setTimeout(function () {
                    $('.sence-2 .monster_holder.left .monster.active').removeClass('eat');
                }, 600);
                if (!$(ui.draggable).hasClass('square')) {
                    setTimeout(function () {
                        $('.sence-2 .monster_holder.left .red').css('opacity', '1');
                        $('.sence-2 .monster_holder.left .nose').css('opacity', '0');
                    }, 200);
                    setTimeout(function () {
                        $('.sence-2 .monster_holder.left .red').css('opacity', '0');
                        $('.sence-2 .monster_holder.left .nose').css('opacity', '1');
                    }, 2000);
                    $(ui.draggable).draggable("option", "revert", true);
                    $('.sence-2 .life.life_3:last-child').remove();
                    healthB--;
                    if (healthB == 0) {
                        $('.sence-2 .figure').css('display', 'none');
                        $('.sence-2 .lose_label').css('display', 'block');
                    }
                }
            }
            if (countC == 5) {
                setTimeout(function () {
                    $('.sence-2 .monster_holder.left .active,.sence-2 .monster_holder.left .red,.sence-1 .monster_holder.left .mouth,.sence-1 .monster_holder.left .nose').css("opacity", "0");
                    $('.sence-2 .monster_holder.left .sleep').css('opacity', '1');
                    $('.sence-2 .square').css('opacity', '0');
                    $('.sence-2 .table_place.left,.sence-2 .label_table.left').css('opacity', '0');
                }, 4000)
            }
            if (countC == 5 && countD == 5) {
                setTimeout(function () {
                    $('.sence-1').css('display', 'none');
                    // $('.sence-2').css('display', 'none');
                    $('#bead0').animate({left: '416px'}, 1000);
                }, 7000);
                setTimeout(function () {
                    window.location = window.location = "../Thangthua/Thang/win.html";

                }, 9000);
            }
            ;
        }
    });

    function shapeAnimation($item, mang, count) {
        console.log(mang[count]);
        setTimeout(function () {
            $item.animate({opacity: '0'})
        }, 500);
        setTimeout(function () {
            $item.animate({
                opacity: 1,
                left: mang[count][0],
                top: mang[count][1]
            }, 1000);
        }, 1000)
    }
    // Xử lý con voi bên phải
    $('.sence-2 .monster_holder.right').droppable({
        over: function (event, ui) {
            if (countD < 5) {
                $('.sence-2 .monster_holder.right .monster.active').addClass('eat');
            }
        },
        out: function (event, ui) {
            if (countD < 5) {
                $('.sence-2 .monster_holder.right .monster.active').removeClass('eat');
            }
        },
        drop: function (event, ui) {
            if (countD < 5) {
                $(ui.draggable).animate({
                    left: '810',
                    top: '100',
                    opacity: '1'
                }, 500);
                if ($(ui.draggable).hasClass('circle')) {
                    $(ui.draggable).draggable("option", "revert", "invalid");
                    shapeAnimation(ui.draggable, mangB, countD);
                    countD++;
                }
                setTimeout(function () {
                    $('.sence-2 .monster_holder.right .monster.active').removeClass('eat');
                }, 600);
                if (!$(ui.draggable).hasClass('circle')) {
                    setTimeout(function () {
                        $('.sence-2 .monster_holder.right .red').css('opacity', '1');
                        $('.monster_holder.right .nose').css('opacity', '0');
                    }, 200);
                    setTimeout(function () {
                        $('.sence-2 .monster_holder.right .red').css('opacity', '0');
                        $('.sence-2 .monster_holder.right .nose').css('opacity', '1');
                    }, 2000);
                    $(ui.draggable).draggable("option", "revert", true);
                    $('.sence-2 .life.life_3:last-child').remove();
                    healthB--;
                    if (healthB == 0) {
                        $('.sence-2 .figure').css('display', 'none');
                        $('.sence-2 .lose_label').css('display', 'block');
                    }
                }
            }
            if (countD == 5) {
                setTimeout(function () {
                    $('.sence-2 .monster_holder.right .active,.sence-2 .monster_holder.right .red,.sence-1 .monster_holder.right .mouth,.sence-1 .monster_holder.right .nose').css("opacity", "0");
                    $('.sence-2 .monster_holder.right .sleep').css('opacity', '1');
                    $('.sence-2 .circle').css('opacity', '0');
                    $('.sence-2 .table_place.right,.sence-2 .label_table.right').css('opacity', '0');
                }, 4000)
            }
            ;
            if (countC == 5 && countD == 5) {
                setTimeout(function () {
                    $('.sence-1').css('display', 'none');
                    //$('.sence-2').css('display', 'none');
                    $('#bead0').animate({left: '416px'}, 1000);

                }, 7000);
                setTimeout(function () {
                    window.location = window.location = "../Thangthua/Thang/win.html";
                    console.log("ok");
                }, 8000);
            }
        }
    });
});