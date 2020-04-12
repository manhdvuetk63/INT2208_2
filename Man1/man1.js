$(document).ready(function() {
    var mangA = [
        [200, 350],
        [80, 300],
        [60, 220],
        [170, 200]
    ];
    let countA = 0;
    var mangB = [
        [770, 350],
        [690, 300],
        [800, 220],
        [700, 190]
    ];
    let countB = 0;
    $('.openhand.circle').draggable({
        scroll: true,
        containment: ".boxgame",
        revert: "invalid",
        disable: true,
        start: function(event, ui) {},
        drag: function(event, ui) {},
        stop: function(event, ui) {
            $('div.figure').removeClass("active-draggable");
        }
    });
    $('.openhand.square').draggable({
        scroll: true,
        containment: ".boxgame",
        revert: "invalid",
        disable: true,
        start: function(event, ui) {},
        drag: function(event, ui) {},
        stop: function(event, ui) {
            $('div.figure').removeClass("active-draggable");
        }
    });
    $('.openhand.khac').draggable({
        scroll: true,
        containment: ".boxgame",
        revert: true,
        disable: true,
        start: function(event, ui) {},
        drag: function(event, ui) {},
        stop: function(event, ui) {
            $('div.figure').removeClass("active-draggable");
        }
    });
    $('.monster_holder.left').droppable({
        accept: " .square,.khac",
        class: {
            "ui-droppable-active": "ac",
            "ui-droppable-hover": "hv"
        },
        over: function(event, ui) {
            if (countA < 4) {
                $('.monster_holder.left .monster.active').addClass('eat');
            }
        },
        out: function(event, ui) {
            if (countA < 4) {
                $('.monster_holder.left .monster.active').removeClass('eat');
            }
        },
        deactivate: function(event, ui) {

        },
        drop: function(event, ui) {
            if (countA < 4) {
                $(ui.draggable).animate({
                    left: '50',
                    top: '100',
                    opacity: '1'
                }, 500);
                if ($(ui.draggable).hasClass('square')) {
                    addcircle(ui.draggable, mangA, countA);
                    countA++;
                }
                setTimeout(function() {
                    $('.monster_holder.left .monster.active').removeClass('eat');
                }, 600);
                if (!$(ui.draggable).hasClass('square')) {
                    setTimeout(function() {
                        $('.monster_holder.left .red').css('opacity', '1');
                        $('.monster_holder.left .nose').css('opacity', '0');
                    }, 200);
                    setTimeout(function() {
                        $('.monster_holder.left .red').css('opacity', '0');
                        $('.monster_holder.left .nose').css('opacity', '1');
                    }, 2000);
                    $('.life.life_3:last-child').remove();
                }
            }
            setTimeout(function() {
                if (countA == 4) {
                    console.log(countA);
                    $('.sence-1 .monster_holder.left .active,.sence-1 .monster_holder.left .red,.sence-1 .monster_holder.left .mouth,.sence-1 .monster_holder.left .nose').css("opacity", "0");
                    $('.sence-1 .monster_holder.left .sleep').css('opacity', '1');
                    $('.sence-1 .square').css('opacity', '0');
                    $('.sence-1 .table_place.left,.sence-1 .label_table.left').css('opacity', '0');
                }
            }, 8000);
        }
    });
    $('.monster_holder.right').droppable({
        accept: " .circle,.khac",
        class: {
            "ui-droppable-active": "ac",
            "ui-droppable-hover": "hv"
        },
        over: function(event, ui) {
            if (countB < 4) {
                $('.monster_holder.right .monster.active').addClass('eat');
            }
        },
        out: function(event, ui) {
            if (countB < 4) {
                $('.monster_holder.right .monster.active').removeClass('eat');
            }
        },
        drop: function(event, ui) {
            if (countB < 4) {
                $(ui.draggable).animate({
                    left: '810',
                    top: '100',
                    opacity: '1'
                }, 500);
                if ($(ui.draggable).hasClass('circle')) {
                    addcircle(ui.draggable, mangB, countB);
                    countB++;
                }
                setTimeout(function() {
                    $('.monster_holder.right .monster.active').removeClass('eat');
                }, 600);
                if (!$(ui.draggable).hasClass('circle')) {
                    setTimeout(function() {
                        $('.monster_holder.right .red').css('opacity', '1');
                        $('.monster_holder.right .nose').css('opacity', '0');
                    }, 200);
                    setTimeout(function() {
                        $('.monster_holder.right .red').css('opacity', '0');
                        $('.monster_holder.right .nose').css('opacity', '1');
                    }, 2000);
                    $('.life.life_3:last-child').remove();

                }
            }
            setTimeout(function() {
                if (countB == 4) {
                    $('.sence-1 .monster_holder.right .active,.sence-1 .monster_holder.right .red,.sence-1 .monster_holder.right .mouth,.sence-1 .monster_holder.right .nose').css("opacity", "0");
                    $('.sence-1 .monster_holder.right .sleep').css('opacity', '1');
                    $('.circle').css('opacity', '0');
                    $('.sence-1 .table_place.right,.sence-1 .label_table.right').css('opacity', '0');
                }
            }, 7500);
        }
    });

    function addcircle($item, mang, count) {
        console.log(mang[count]);
        setTimeout(function() {
            $item.animate({ opacity: '0' })
        }, 500);
        setTimeout(function() {
            $item.animate({
                opacity: 1,
                left: mang[count][0],
                top: mang[count][1]
            }, 2000);
        }, 1000)
    }
    $('body').mousedown(function() {
        if (countA == 4 && countB == 4) {
            setTimeout(function() {
                $('.sence-1').css('display', 'none');
                $('.sence-2').css('display', 'block');
                $('#bead2').animate({ left: '440px' }, 1000);
            }, 5000);
        }
    })
});