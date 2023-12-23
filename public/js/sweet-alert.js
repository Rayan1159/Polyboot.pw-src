$((function () {
    "use strict";
    $("#but1").on("click", (function (t) {
        $("body").removeClass("timer-alert");
        var e = $("#message").val();
        "" == e && (e = "Your message"), swal(e)
    })), $("#but2").on("click", (function (t) {
        $("body").removeClass("timer-alert");
        var e = $("#message").val(), o = $("#title").val();
        "" == e && (e = "Your message"), "" == o && (o = "Your message"), swal(o, e)
    })), $("#but3").on("click", (function (t) {
        $("body").removeClass("timer-alert");
        var e = $("#message").val(), o = $("#title").val();
        "" == e && (e = "Your message"), "" == o && (o = "Your message"), swal({
            title: o,
            text: e,
            imageUrl: "http://laravel.spruko.com/flaira/ltr/assets/images/brand/favicon.png"
        })
    })), $("#but4").click((function () {
        $("body").addClass("timer-alert");
        var t = $("#message").val(), e = $("#title").val();
        "" == t && (t = "Your message"), "" == e && (e = "Your message"), t += "(close after 2 seconds)", swal({
            title: e,
            text: t,
            timer: 2e3,
            showConfirmButton: !1
        })
    })), $("#click").on("click", (function (t) {
        $("body").removeClass("timer-alert");
        var e = $("#type").val();
        swal({title: "Notification Styles", text: "New Notification from Flaira", type: e})
    })), $("#prompt").on("click", (function (t) {
        $("body").removeClass("timer-alert"), swal({
            title: "Notification Alert",
            text: "your getting some notification from mail please check it",
            type: "input",
            showCancelButton: !0,
            closeOnConfirm: !1,
            inputPlaceholder: "Your message"
        }, (function (t) {
            "" != t && swal("Input", "You have entered : " + t)
        }))
    })), $("#confirm").on("click", (function (t) {
        $("body").removeClass("timer-alert"), swal({
            title: "Notification Styles",
            text: "New Notification from Flaira",
            type: "warning",
            showCancelButton: !0,
            confirmButtonText: "Exit",
            cancelButtonText: "Stay on the page"
        })
    })), $("#click").on("click", (function (t) {
        $("body").removeClass("timer-alert"), swal("Congratulations!", "Your message has been succesfully sent", "success")
    })), $("#click1").on("click", (function (t) {
        $("body").removeClass("timer-alert"), swal({
            title: "Some Risk File Is Founded",
            text: "Some Virus file is detected your system going to be in Risk",
            type: "warning",
            showCancelButton: !0,
            confirmButtonText: "Exit",
            cancelButtonText: "Stay on the page"
        })
    })), $("#click2").on("click", (function (t) {
        $("body").removeClass("timer-alert"), swal({
            title: "Something Went Wrong",
            text: "Please fix the issue the issue file not loaded & items not found",
            type: "error",
            showCancelButton: !0,
            confirmButtonText: "Exit",
            cancelButtonText: "Stay on the page"
        })
    })), $("#click3").on("click", (function (t) {
        $("body").removeClass("timer-alert"), swal({
            title: "Notification Alert",
            text: "your getting some notification from mail please check it",
            type: "info",
            showCancelButton: !0,
            confirmButtonText: "Exit",
            cancelButtonText: "Stay on the page"
        })
    }))
}));