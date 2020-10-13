// var map;

// function initMap() {
//     map = new google.maps.Map(document.getElementById('map'), {
//         center: { lat: -34.397, lng: 150.644 },
//         zoom: 8
//     });
// }
$(function() {
    var INDEX = 0;
    var questions = ["Do you have low platelets count?", "Do you experience frequent headaches?", "Do you have joint pains?",
        "Do you get metallic taste?", "Do you have abdominal pain?", "Do you vomit frequently?", "Do you bleed easily?", "Do you have high body temperature?"
    ];
    var answers = [];
    var binAnswer;
    var i = 0;
    var reply;
    generate_message_bot("Hello!", 'user');
    generate_message_bot("Please! Answer following questions to know are you infected or not.", 'user');
    generate_message_bot("Tell us your age( in years).", 'user');

    $("#chat-submit").click(function(e) {
        e.preventDefault();
        var msg = $("#chat-input").val();
        if (msg.trim() == '') {
            return false;
        }
        generate_message(msg, 'self');
        var lowerMsg = msg.toLowerCase();
        if (lowerMsg == "yes") {
            binAnswer = 1;
        } else if (lowerMsg == "no") {
            binAnswer = 0;
        } else {
            binAnswer = parseInt(msg);
        }
        answers.push(binAnswer);
        var buttons = [{
                name: 'Existing User',
                value: 'existing'
            },
            {
                name: 'New User',
                value: 'new'
            }
        ];
        setTimeout(function() {
            if (i < questions.length) {
                generate_message_bot(questions[i], 'user');
                i++;
            } else {
                console.log(answers);
                $.ajax('http://192.168.43.126:5000/predict_dengue', {
                    type: 'POST', // http method
                    contentType: "application/json",
                    data: JSON.stringify({ "resp": answers }), // data to submit
                    success: function(data, status, xhr) {
                        reply = data.pred[0];
                        if (reply == 0) {
                            generate_message_bot("Looks like you are safe ;-)", 'user');
                        } else {
                            generate_message_bot("You seem be infected with dengue, need to go to hospital :-(", 'user');
                        }

                        console.log(reply);
                        // $('p').append('status: ' + status + ', data: ' + data);
                    },
                    error: function(jqXhr, textStatus, errorMessage) {
                        // $('p').append('Error' + errorMessage);
                    }
                });
                clearInterval();
            }
        }, 1000)

    })



    function generate_message(msg, type) {
        INDEX++;
        var str = "";
        str += "<div id='cm-msg-" + INDEX + "' class=\"chat-msg " + type + "\">";
        str += "          <span class=\"msg-avatar\">";
        str += "            <img src=\"https:\/\/image.flaticon.com\/icons\/svg\/1995\/1995875.svg\">";

        str += "          <\/span>";
        str += "          <div class=\"cm-msg-text\">";
        str += msg;
        str += "          <\/div>";
        str += "        <\/div>";
        $(".chat-logs").append(str);
        $("#cm-msg-" + INDEX).hide().fadeIn(300);
        if (type == 'self') {
            $("#chat-input").val('');
        }
        $(".chat-logs").stop().animate({ scrollTop: $(".chat-logs")[0].scrollHeight }, 1000);
    }

    function generate_message_bot(msg, type) {
        INDEX++;
        var str = "";
        str += "<div id='cm-msg-" + INDEX + "' class=\"chat-msg " + type + "\">";
        str += "          <span class=\"msg-avatar\">";
        str += "            <img src=\"https:\/\/image.flaticon.com\/icons\/svg\/921\/921129.svg\">";

        str += "          <\/span>";
        str += "          <div class=\"cm-msg-text\">";
        str += msg;
        str += "          <\/div>";
        str += "        <\/div>";
        $(".chat-logs").append(str);
        $("#cm-msg-" + INDEX).hide().fadeIn(300);
        if (type == 'self') {
            $("#chat-input").val('');
        }
        $(".chat-logs").stop().animate({ scrollTop: $(".chat-logs")[0].scrollHeight }, 1000);
    }

    function generate_button_message(msg, buttons) {
        /* Buttons should be object array 
          [
            {
              name: 'Existing User',
              value: 'existing'
            },
            {
              name: 'New User',
              value: 'new'
            }
          ]
        */
        INDEX++;
        var btn_obj = buttons.map(function(button) {
            return "              <li class=\"button\"><a href=\"javascript:;\" class=\"btn btn-primary chat-btn\" chat-value=\"" + button.value + "\">" + button.name + "<\/a><\/li>";
        }).join('');
        var str = "";
        str += "<div id='cm-msg-" + INDEX + "' class=\"chat-msg user\">";
        str += "          <span class=\"msg-avatar\">";
        str += "            <img src=\"https:\/\/image.flaticon.com\/icons\/svg\/1995\/1995875.svg\">";
        str += "          <\/span>";
        str += "          <div class=\"cm-msg-text\">";
        str += msg;
        str += "          <\/div>";
        str += "          <div class=\"cm-msg-button\">";
        str += "            <ul>";
        str += btn_obj;
        str += "            <\/ul>";
        str += "          <\/div>";
        str += "        <\/div>";
        $(".chat-logs").append(str);
        $("#cm-msg-" + INDEX).hide().fadeIn(300);
        $(".chat-logs").stop().animate({ scrollTop: $(".chat-logs")[0].scrollHeight }, 1000);
        $("#chat-input").attr("disabled", true);
    }

    $(document).delegate(".chat-btn", "click", function() {
        var value = $(this).attr("chat-value");
        var name = $(this).html();
        $("#chat-input").attr("disabled", false);
        generate_message(name, 'self');
    })

    $("#chat-circle").click(function() {
        $("#chat-circle").toggle('scale');
        $(".chat-box").toggle('scale');
    })

    $(".chat-box-toggle").click(function() {
        $("#chat-circle").toggle('scale');
        $(".chat-box").toggle('scale');
    })

})