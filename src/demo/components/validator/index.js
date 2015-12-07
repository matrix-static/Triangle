$("#commentFormx").validate({
    rules: {
        name: {
            required: true,
            minlength: 4
        },
        password: {
            required: true,
            minlength: 5
        },
        password_again: {
            equalTo: "#password"
        },
        email: {
            required: true,
            email: true
        },
        agree: "required",
        topic: {
            required: "#newsletter:checked",
            minlength: 2
        },
        comment: {
            required: true
        }
    },
    messages: {
        name: {
            required: "请输入一个名称",
            minlength: "名称至少需要4个字符"
        },
        password: {
            required: "请输入一个密码",
            minlength: "密码至少需要5个字符"
        },
        confirm_password: {
            required: "请输入一个密码",
            minlength: "密码至少需要5个字符",
            equalTo: "两次输入的密码不一致"
        },
        email: "请输入一个有效的邮箱地址",
        agree: "请接受我们的服务条款"
    }
});

//code to hide topic selection, disable for demo
var newsletter = $("#newsletter");
// newsletter topics are optional, hide at first
var inital = newsletter.is(":checked");
var topics = $("#newsletter_topics")[inital ? "removeClass" : "addClass"]("gray");
var topicInputs = topics.find("input").attr("disabled", !inital);
// show when newsletter is checked
newsletter.click(function() {
    topics[this.checked ? "removeClass" : "addClass"]("gray");
    topicInputs.attr("disabled", !this.checked);
});