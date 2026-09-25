const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const dom = new JSDOM(`<!DOCTYPE html><span class="item trn" title="Select" id="select"></span>`);
const $ = require("jquery")(dom.window);

// mock jquery.translate.js
$.fn.translate = function (options) {
    var that = this;
    var settings = {
        css: "trn",
        attrs: ["alt", "placeholder", "title"],
        lang: "en",
        langDefault: "en",
        t: {}
    };
    settings = $.extend(settings, options || {});
    this.get = function (index) { return index; };
    
    this.each(function (i) {
        var $this = $(this);
        var trn_key = $this.attr("data-trn-key");
        if (!trn_key) {
            trn_key = $this.html();
            $this.attr("data-trn-key", trn_key);
        }
        $.each(this.attributes, function () {
            if ($.inArray(this.name, settings.attrs) !== -1) {
                var trn_attr_key = $this.attr("data-trn-attr");
                if (!trn_attr_key) {
                    trn_attr_key = $this.attr(this.name);
                    $this.attr("data-trn-attr", trn_attr_key);
                }
                $this.attr(this.name, that.get(trn_attr_key));
            }
        });
        $this.html(that.get(trn_key));
    });
    return this;
};

$("span").translate();
console.log("HTML:", $("body").html());
