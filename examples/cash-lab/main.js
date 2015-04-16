window.cash = new window.Cash();

var $input = $('#input .copy'),
    $output = $('#output .text'),
    $submit = $('#submit');
$('body').on('click', '#submit', function () {
    var newHTML = $output.html() + '<p>' + cash.tag($input.val()) + '</p>';
    $output.html(newHTML);
    $input.val('');
})
.on('keypress', '.copy', function (e) {
    if (e.which === 13) {
        $submit.click();
    }
});