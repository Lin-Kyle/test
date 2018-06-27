const render = function(template, data) {
    _.template(template, data);
};
$.get("template", template => {
    $.get("data", data => {});
});
