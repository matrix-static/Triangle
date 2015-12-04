$("#commentFormx").validate({
    rules: {
        password: "required",
        password_again: {
            equalTo: "#password"
        }
    }
});