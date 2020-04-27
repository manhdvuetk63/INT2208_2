$(document).ready(function() {
    var healthA = 3;
    var healthB = 3;
    var healthC = 3;

    var mangA = [
        [200, 350],
        [80, 300],
        [60, 220],
        [170, 200]
    ];
    var countA = 0;
    var mangB = [
        [770, 350],
        [690, 300],
        [800, 220],
        [700, 190],
    ];
    var countB = 0;
    var countC = 0;
    var countD = 0;
    var countE = 0;
    var mangC = [
        [200, 350],
        [80, 350],
        [60, 250],
        [200, 250],
        [100, 200]
    ];
    $('.sence-1 .openhand.circle,.sence-1 .openhand.square').draggable({
        scroll: true,
        containment: ".boxgame",
        revert: "invalid",
        disable: true,
        start: function(event, ui) {},
        drag: function(event, ui) {},
        stop: function(event, ui) {
            $('div.figure').removeClass("active-draggable");
            $(ui.draggable).draggable("option", "revert", "invalid");
        }
    });
    $('.sence-1 .openhand.khac').draggable({
        scroll: true,
        containment: ".boxgame",
        revert: true,
        disable: true,
        start: function(event, ui) {},
        drag: function(event, ui) {},
        stop: function(event, ui) {
            $('.sence-1 div.figure').removeClass("active-draggable");
        }
    });
    $('.sence-1 .monster_holder.left').droppable({
        class: {
            "ui-droppable-active": "ac",
            "ui-droppable-hover": "hv"
        },
        over: function(event, ui) {
            if (countA < 4) {
                $('.sence-1 .monster_holder.left .monster.active').addClass('eat');
            }
        },
        out: function(event, ui) {
            if (countA < 4) {
                $('.sence-1 .monster_holder.left .monster.active').removeClass('eat');
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
                    $(ui.draggable).draggable("option", "revert", "invalid");
                    addcircle(ui.draggable, mangA, countA);
                    countA++;
                }
                setTimeout(function() {
                    $('.sence-1 .monster_holder.left .monster.active').removeClass('eat');
                }, 600);
                if (!$(ui.draggable).hasClass('square')) {
                    setTimeout(function() {
                        $('.sence-1 .monster_holder.left .red').css('opacity', '1');
                        $('.sence-1 .monster_holder.left .nose').css('opacity', '0');
                    }, 200);
                    setTimeout(function() {
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

            if (countA == 4) {
                setTimeout(function() {
                    $('.sence-1 .monster_holder.left .active,.sence-1 .monster_holder.left .red,.sence-1 .monster_holder.left .mouth,.sence-1 .monster_holder.left .nose').css("opacity", "0");
                    $('.sence-1 .monster_holder.left .sleep').css('opacity', '1');
                    $('.sence-1 .square').css('opacity', '0');
                    $('.sence-1 .table_place.left,.sence-1 .label_table.left').css('opacity', '0');
                }, 4000)
            };
            if (countA == 4 && countB == 4) {
                setTimeout(function() {
                    $('.sence-1').css('display', 'none');
                    $('.sence-2').css('display', 'block');
                    $('#bead2').animate({ left: '440px' }, 1000);
                }, 7000);
            };
        }
    });
    $('.sence-1 .monster_holder.right').droppable({
        //accept: " .circle,.khac",
        class: {
            "ui-droppable-active": "ac",
            "ui-droppable-hover": "hv"
        },
        over: function(event, ui) {
            if (countB < 4) {
                $('.sence-1 .monster_holder.right .monster.active').addClass('eat');
            }
        },
        out: function(event, ui) {
            if (countB < 4) {
                $('.sence-1 .monster_holder.right .monster.active').removeClass('eat');
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
                    $(ui.draggable).draggable("option", "revert", "invalid");
                    addcircle(ui.draggable, mangB, countB);
                    countB++;
                }
                setTimeout(function() {
                    $('.sence-1 .monster_holder.right .monster.active').removeClass('eat');
                }, 600);
                if (!$(ui.draggable).hasClass('circle')) {
                    setTimeout(function() {
                        $('.sence-1 .monster_holder.right .red').css('opacity', '1');
                        $('.monster_holder.right .nose').css('opacity', '0');
                    }, 200);
                    setTimeout(function() {
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
            if (countB == 4) {
                setTimeout(function() {
                    $('.sence-1 .monster_holder.right .active,.sence-1 .monster_holder.right .red,.sence-1 .monster_holder.right .mouth,.sence-1 .monster_holder.right .nose').css("opacity", "0");
                    $('.sence-1 .monster_holder.right .sleep').css('opacity', '1');
                    $('.sence-1 .circle').css('opacity', '0');
                    $('.sence-1 .table_place.right,.sence-1 .label_table.right').css('opacity', '0');
                }, 4000)
            };
            if (countA == 4 && countB == 4) {
                setTimeout(function() {
                    $('.sence-1').css('display', 'none');
                    $('.sence-2').css('display', 'block');
                    $('#bead2').animate({ left: '440px' }, 1000);
                    
                }, 7000);
            }
        }
    });

    //sence 2
    $('.sence-2 .openhand.circle,.sence-2 .openhand.square').draggable({
        scroll: true,
        containment: ".boxgame",
        revert: "invalid",
        disable: true,
        start: function(event, ui) {
            $(ui.draggable).draggable("option", "revert", "invalid");
        },
        drag: function(event, ui) {},
        stop: function(event, ui) {
            $('.sence-2 div.figure').removeClass("active-draggable");
            $(ui.draggable).draggable("option", "revert", "invalid");
        }
    });
    $('.sence-2 .openhand.khac').draggable({
        scroll: true,
        containment: ".boxgame",
        revert: true,
        disable: true,
        start: function(event, ui) {
            $(ui.draggable).draggable("option", "revert", "invalid");
        },
        drag: function(event, ui) {},
        stop: function(event, ui) {
            $('div.figure').removeClass("active-draggable");
        }
    });
    $('.sence-2 .monster_holder.left').droppable({
        over: function(event, ui) {
            if (countC < 5) {
                $('.sence-2 .monster_holder.left .monster.active').addClass('eat');
            }
        },
        out: function(event, ui) {
            if (countC < 5) {
                $('.sence-2 .monster_holder.left .monster.active').removeClass('eat');
            }
        },
        deactivate: function(event, ui) {

        },
        drop: function(event, ui) {
            if (countC < 5) {
                $(ui.draggable).animate({
                    left: '50',
                    top: '100',
                    opacity: '1'
                }, 500);
                if ($(ui.draggable).hasClass('square')) {
                    $(ui.draggable).draggable("option", "revert", "invalid");
                    addcircle(ui.draggable, mangC, countC);
                    countC++;
                }
                setTimeout(function() {
                    $('.sence-2 .monster_holder.left .monster.active').removeClass('eat');
                }, 600);
                if (!$(ui.draggable).hasClass('square')) {
                    setTimeout(function() {
                        $('.sence-2 .monster_holder.left .red').css('opacity', '1');
                        $('.sence-2 .monster_holder.left .nose').css('opacity', '0');
                    }, 200);
                    setTimeout(function() {
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
                setTimeout(function() {
                    $('.sence-2 .monster_holder.left .active,.sence-2 .monster_holder.left .red,.sence-2 .monster_holder.left .mouth,.sence-2 .monster_holder.left .nose').css("opacity", "0");
                    $('.sence-2 .monster_holder.left .sleep').css('opacity', '1');
                    $('.sence-2 .square').css('opacity', '0');
                    $('.sence-2 .table_place.left,.sence-2 .label_table.left').css('opacity', '0');
                    $('.sence-2 .khac,.sence-2 .circle').css('opacity', '0');
                }, 4000);
                setTimeout(function() {
                    $('.sence-1').css('display', 'none');
                    $('.sence-2').css('display', 'none');
                    $('.sence-3').css('display', 'block');
                    $('#bead1').animate({ left: '416px' }, 1000);
                }, 7000)
            };
        }
    })

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
            }, 1000);
        }, 1000)
    }


    // sence 3 
    $('.sence-3 .openhand.circle,.sence-3 .openhand.square').draggable({
        scroll: true,
        containment: ".boxgame",
        revert: "invalid",
        disable: true,
        start: function(event, ui) {},
        drag: function(event, ui) {},
        stop: function(event, ui) {
            $('div.figure').removeClass("active-draggable");
            $(ui.draggable).draggable("option", "revert", "invalid");
        }
    });
    $('.sence-3 .openhand.khac').draggable({
        scroll: true,
        containment: ".boxgame",
        revert: true,
        disable: true,
        start: function(event, ui) {},
        drag: function(event, ui) {},
        stop: function(event, ui) {
            $('.sence-3 div.figure').removeClass("active-draggable");
        }
    });
    $('.sence-3 .monster_holder.left').droppable({
        class: {
            "ui-droppable-active": "ac",
            "ui-droppable-hover": "hv"
        },
        over: function(event, ui) {
            if (countD < 4) {
                $('.sence-3 .monster_holder.left .monster.active').addClass('eat');
            }
        },
        out: function(event, ui) {
            if (countD < 4) {
                $('.sence-3 .monster_holder.left .monster.active').removeClass('eat');
            }
        },
        deactivate: function(event, ui) {

        },
        drop: function(event, ui) {
            if (countD < 4) {
                $(ui.draggable).animate({
                    left: '50',
                    top: '100',
                    opacity: '1'
                }, 500);
                if ($(ui.draggable).hasClass('circle')) {
                    $(ui.draggable).draggable("option", "revert", "invalid");
                    addcircle(ui.draggable, mangA, countD);
                    countD++;
                }
                setTimeout(function() {
                    $('.sence-3 .monster_holder.left .monster.active').removeClass('eat');
                }, 600);
                if (!$(ui.draggable).hasClass('circle')) {
                    setTimeout(function() {
                        $('.sence-3 .monster_holder.left .red').css('opacity', '1');
                        $('.sence-3 .monster_holder.left .nose').css('opacity', '0');
                    }, 200);
                    setTimeout(function() {
                        $('.sence-3 .monster_holder.left .red').css('opacity', '0');
                        $('.sence-3 .monster_holder.left .nose').css('opacity', '1');
                    }, 2000);
                    $(ui.draggable).draggable("option", "revert", true);
                    $('.sence-3 .life.life_3:last-child').remove();
                    healthC--;
                    if (healthC == 0) {
                        $('.sence-3 .figure').css('display', 'none');
                        $('.sence-3 .lose_label').css('display', 'block');
                    }
                }
            }

            if (countD == 4) {
                setTimeout(function() {
                    $('.sence-3 .monster_holder.left .active,.sence-3 .monster_holder.left .red,.sence-3 .monster_holder.left .mouth,.sence-3 .monster_holder.left .nose').css("opacity", "0");
                    $('.sence-3 .monster_holder.left .sleep').css('opacity', '1');
                    $('.sence-3 .circle').css('opacity', '0');
                    $('.sence-3 .table_place.left,.sence-3 .label_table.left').css('opacity', '0');
                }, 4000)
            };
            if (countD == 4 && countE == 3) {
                setTimeout(function() {
                    $('.sence-1').css('display', 'none');
                    $('.sence-3').css('display', 'none');
                    $('.sence-2').css('display', 'none');
                    $('#bead0').animate({ left: '392px' }, 1000);
                }, 7000);
                setTimeout(function () {
                    window.location=  window.location = "../Thangthua/Thang/win.html";
                    console.log("ok");
                },8000);
            };
        }
    });
    $('.sence-3 .monster_holder.right').droppable({
        class: {
            "ui-droppable-active": "ac",
            "ui-droppable-hover": "hv"
        },
        over: function(event, ui) {
            if (countE < 3) {
                $('.sence-3 .monster_holder.right .monster.active').addClass('eat');
            }
        },
        out: function(event, ui) {
            if (countE < 3) {
                $('.sence-3 .monster_holder.right .monster.active').removeClass('eat');
            }
        },
        drop: function(event, ui) {
            if (countE < 3) {
                $(ui.draggable).animate({
                    left: '810',
                    top: '100',
                    opacity: '1'
                }, 500);
                if ($(ui.draggable).hasClass('square')) {
                    $(ui.draggable).draggable("option", "revert", "invalid");
                    addcircle(ui.draggable, mangB, countE);
                    countE++;
                }
                setTimeout(function() {
                    $('.sence-3 .monster_holder.right .monster.active').removeClass('eat');
                }, 600);
                if (!$(ui.draggable).hasClass('square')) {
                    setTimeout(function() {
                        $('.sence-3 .monster_holder.right .red').css('opacity', '1');
                        $('.monster_holder.right .nose').css('opacity', '0');
                    }, 200);
                    setTimeout(function() {
                        $('.sence-3 .monster_holder.right .red').css('opacity', '0');
                        $('.sence-3 .monster_holder.right .nose').css('opacity', '1');
                    }, 2000);
                    $(ui.draggable).draggable("option", "revert", true);
                    $('.sence-3 .life.life_3:last-child').remove();
                    healthC--;
                    if (healthC == 0) {
                        $('.sence-3 .figure').css('display', 'none');
                        $('.sence-3 .lose_label').css('display', 'block');
                    }
                }
            }
            if (countE == 3) {
                setTimeout(function() {
                    $('.sence-3 .monster_holder.right .active,.sence-3 .monster_holder.right .red,.sence-3 .monster_holder.right .mouth,.sence-3 .monster_holder.right .nose').css("opacity", "0");
                    $('.sence-3 .monster_holder.right .sleep').css('opacity', '1');
                    $('.sence-3 .square').css('opacity', '0');
                    $('.sence-3 .table_place.right,.sence-3 .label_table.right').css('opacity', '0');
                }, 4000)
            };
            if (countD == 4 && countE == 3) {
                setTimeout(function() {
                    $('.sence-1').css('display', 'none');
                    $('.sence-2').css('display', 'none');
                    $('.sence-3').css('display', 'none');
                    $('#bead0').animate({ left: '392px' }, 1000);
                }, 7000);
                setTimeout(function () {
                    window.location=  window.location = "../Thangthua/Thang/win.html";
                },8000);


            }
        }
    });
    
});