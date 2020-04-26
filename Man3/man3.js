$(document).ready(function () {
    var healthSence1 = 3;
    var countA = 0; // đếm số lượng hình vuông
    var countB=0; //đếm số lượng hình tròn
    // Tạo hiệu ứng kéo thả các khối

    // Xu ly keo cac khoi
    $('.sence-1 .openhand.circle,.sence-1 .openhand.square').draggable({
        scroll: true,
        containment: ".boxgame",
        revert: "invalid",
        disable: true,
        start: function (event, ui) {
        },
        drag: function (event, ui) {
        },
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
        start: function (event, ui) {
        },
        drag: function (event, ui) {
        },
        stop: function (event, ui) {
            $('.sence-1 div.figure').removeClass("active-draggable");
        }
    });

    // khu vuc con voi ben trai nhan hinh vuong
    $('.sence-1 .monster_holder.left').droppable({
        class: {
            "ui-droppable-active": "ac",
            "ui-droppable-hover": "hv"
        },
        over: function (event, ui) {
            if (countA < 4) {
                $('.sence-1 .monster_holder.left .monster.active').addClass('eat');
            }
        },
        out: function (event, ui) {
            if (countA < 4) {
                $('.sence-1 .monster_holder.left .monster.active').removeClass('eat');
            }
        },
        deactivate: function (event, ui) {

        },
        drop: function (event, ui) {
        }
    });

    // Xu lý con voi bên phải
    $('.sence-1 .monster_holder.right').droppable({
        class: {
            "ui-droppable-active": "ac",
            "ui-droppable-hover": "hv"
        },
        over: function (event, ui) {
            if (countB < 4) {
                $('.sence-1 .monster_holder.right .monster.active').addClass('eat');
            }
        },
        out: function (event, ui) {
            if (countB < 4) {
                $('.sence-1 .monster_holder.right .monster.active').removeClass('eat');
            }
        },
        drop: function (event, ui) {

        }
    });
});