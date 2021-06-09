/**
 * wrap this code inside a script tag <script> [CODE] </script>
 */

function trigger() {
    var cdl = dataLayer || {};
    var hasEvent = false;
    for (var i in cdl) {
        obj = cdl[i];
        if (obj.event == "virtualPageview" && isCategory(obj.virtualPageURL)) {
            var properties = {};
            var category;
            if (obj.virtualPageURL.split("/")[2] && obj.virtualPageURL.split("/")[2] !== "") {
                category = obj.virtualPageURL.split("/")[2].split("?")[0];
            }
            properties["customProperties"] = {
                "category_name": {
                    "t": "string",
                    "v": category
                }
            };
            _cl.pageview("Category viewed", properties);
            hasEvent = true;
        }
    };
    if (!hasEvent) {
        setTimeout(function () { trigger() }, 1000)
    }
    function isCategory(virtualPageURL) {
        if (virtualPageURL.split("/")[1] == "categories" && !isSearch(virtualPageURL)) {
            return true;
        }
    
        return false;
    }
    
    function isSearch(virtualPageURL) {
        if (virtualPageURL.split("?")[1] && virtualPageURL.split("?")[1] !== "") {
            var queryParams = virtualPageURL.split("?")[1].split("&");
    
            for (var i = 0; i < queryParams.length; i++) {
                if (queryParams[i].split("=")[0] == "search") {
                    return true;
                }
            }
        }
    
        return false;
    }
};

setTimeout(function () { trigger() }, 2000);