// var submitted = false;

$("#commentFormx").validate2({
    rules: {
        name: {
            // required: true,
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
        remote: {
            required: true,
            minlength: 5,
            remote: '/demo/components/validator/remote.html'
        },
        // agree: "required",
        agree: {
            required: true
        },
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
        password_again: {
            required: "请输入一个密码",
            minlength: "密码至少需要5个字符",
            equalTo: "两次输入的密码不一致"
        },
        email: "请输入一个有效的邮箱地址",
        remote: {
            required: "请输入一个Remote",
            minlength: "Remote至少需要5个字符",
            remote: 'Remote服务器校验失败！'
        },
        agree: "请接受我们的服务条款"
    },
    // errorContainer: '#ErrorsSummary, #ErrorsSummary2',
    // errorLabelContainer: "#ErrorsSummary ul",
    // wrapper: "li", 
    // invalidHandler: function() {
    //     $( "#ErrorsSummary" ).text( this.numberOfInvalids() + " field(s) are invalid" );
    // },
    focusCleanup: true,
    submitHandler: function() { alert("Submitted!") }

    // showErrors: function(errorMap, errorList) {
    //     if (submitted) {
    //         var summary = "You have the following errors: \n";
    //         $.each(errorList, function() { summary += " * " + this.message + "\n"; });
    //         alert(summary);
    //         submitted = false;
    //     }
    //     this.defaultShowErrors();
    // },          
    // invalidHandler: function(form, validator) {
    //     submitted = true;
    // }
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


$("#commentForm2").validate2({
    rules: {
        name2: {
            // required: true,
            minlength: 4
        },
        email2: {
            required: true,
            email: true
        }
    },
    messages: {
        name2: {
            required: "请输入一个名称",
            minlength: "名称至少需要4个字符"
        },
        email2: "请输入一个有效的邮箱地址"
    },
    errorContainer: '#ErrorsSummary',
    // errorLabelContainer: "ul",
    // errorLabelWrapper: "li", 
    // invalidHandler: function() {
    //     $( "#ErrorsSummary" ).text( this.numberOfInvalids() + " field(s) are invalid" );
    // },
    submitHandler: function() { alert("Submitted!") }

    // showErrors: function(errorMap, errorList) {
    //     if (submitted) {
    //         var summary = "You have the following errors: \n";
    //         $.each(errorList, function() { summary += " * " + this.message + "\n"; });
    //         alert(summary);
    //         submitted = false;
    //     }
    //     this.defaultShowErrors();
    // },          
    // invalidHandler: function(form, validator) {
    //     submitted = true;
    // }
});