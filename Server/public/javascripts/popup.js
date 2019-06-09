$(document).ready(function () {

$("#showLogIn").click(function(e) {
    e.preventDefault();
    $("#popup-login").addClass("visible");
});

$("#showSignUp").click(function (e) {
   e.preventDefault();
    $("#popup-signup").addClass("visible");
});

$("#user-edit").click(function(e) {
    e.preventDefault();
    $("#popup-edit").addClass("visible");

    var data = {};

    $.ajax({
        type: 'GET',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: '/api/auth/getUser/' + $("#user-edit").data("id")
    }).done((data) => {
        console.log(data);
        $("#signup-email").val(data.user.email);
        $("#userName").val(data.user.nickname);
        $("#userAge").val(data.user.age);
        $("#userWeight").val(data.user.weight);
        $("#userIllness").val(data.user.illness);
    });
});

$(".modal-wrapper .button-close").click(function () {
    $(this).closest(".modal-wrapper").removeClass("visible");
});

$("#signup").click((e) => {
    e.preventDefault();

    var password = $('#signup-password').val();
    var nickname = $('#userName').val();
    var age = $('#userAge').val();
    var weight = $('#userWeight').val();

    if (password.length < 6) {
        $('#signup-password').addClass('error');
    } else if (nickname.length < 3 || nickname.length > 16) {
        $('#signup-password').removeClass('error');
        $('#userName').addClass('error');
        //!/^[a-zA-Z0-9]+$/.test(login)
    } else if (!/^[0-9]+$/.test(age)) {
        $('#userName').removeClass('error');
        $('#userAge').AddClass('error');
    } else if (!/^[0-9]+$/.test(weight)) {
        $('#userAge').removeClass('error');
        $('#userWeight').addClass('error');
    } else {
        $('#userWeight').removeClass('error');
        var data = {
            email: $('#signup-email').val(),
            password,
            nickname,
            age: $('#userAge').val(),
            weight: $('#userWeight').val(),
            illness: $('#userIllness').val()
        };
    
        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/api/auth/register'
        }).done(function (data) {
            if (!data.ok) {
                $('#signup-email').addClass('error');            
            } else {         
                $(location).attr('href', '/');
            }
        });
    }

    
})

$(".logout-button").click((e) => {
    var data = {};
    
    $.ajax({
        type: 'GET',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: '/api/auth/logout'
    }).done(function (data) {
        $(location).attr('href', '/');
    });
})

$("#login").click((e) => {
    e.preventDefault();

    var data = {
        email: $('#login-email').val(),
        password: $('#login-password').val()
    }

    $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: '/api/auth/login'
    }).done(function (data) {
        if (!data.ok) {
            // if (data.fields) {
            //     data.fields.forEach(function (item) {
            //     });
            // }
            console.log("err");
        } else {         
            $(location).attr('href', '/');
        }
    });
})

$(".deal__add").click((e) => {
    var data = {
        name: $("#input-name").val(),
        category: $("#select-category").val(),
        duration: $("#select-duration").val(),
        average: $("#select-average").val()
    }

    $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: '/deal/add/' + $("#user-edit").data("id")
    }).done((data) => {
        console.log(data);
    });
})


$(".deal__edit").click((e) => {
    var data = {
        name: $("#input-name").val(),
        category: $("#select-category").val(),
        duration: $("#select-duration").val(),
        average: $("#select-average").val()
    }

    $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: '/deal/editDealForWeb/' + $("#input-id").val()
    }).done((data) => {
        console.log(data);
    });
})


$(".user_edit").click((e) => {
    var data = {
        email: $("#signup-email").val(),
        nickname: $("#userName").val(),
        age: $("#userAge").val(),
        weight: $("#userWeight").val(),
        illness: $("#userIllness").val()
    }

    $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: '/user/edit/' + $("#userId").val()
    }).done((data) => {
        console.log(data);
    });
})


})