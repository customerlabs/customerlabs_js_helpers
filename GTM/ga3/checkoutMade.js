/**
 * wrap this code inside a script tag <script> [CODE] </script>
 */

function trigger() {
    var cdl = dataLayer || {};
    var hasEvent = false;
    for (var i in cdl) {
        obj = cdl[i];
        if (obj.event == "checkout") {
            var checkout_event = obj.ecommerce.checkout;
            var properties = {};
            properties["customProperties"] = genCustomProps(checkout_event.actionField);
            properties["productProperties"] = genProductProps(checkout_event.products);
            _cl.trackClick("Checkout made", properties);
            hasEvent = true;
        }
    };
    if (!hasEvent) {
        setTimeout(function () { trigger() }, 1000)
    }
    function genCustomProps(actionField) {
        var cfields = {}
        for (var clkey in actionField) {
            if (clkey != "content_ids" && clkey != "id" && clkey != "action") {
                cfields[clkey] = {
                    "t": typeof actionField[clkey],
                    "v": actionField[clkey]
                }
            }
            if (clkey == "revenue") {
                var value;
                if (typeof actionField[clkey] == "number") {
                    value = actionField[clkey];
                } else if (typeof actionField[clkey == "string"]) {
                    value = Number(actionField[clkey].replace(/[^0-9.]+/g, ""));
                }

                cfields["value"] = {
                    "t": "number",
                    "v": value
                }
            }
        }
        return cfields;
    };
    function genProductProps(productsData) {
        var products = [];
        for (var cli in productsData) {
            var product = productsData[cli];
            var newproduct = {};
            for (prodkey in product) {
                switch (prodkey) {
                    case "id":
                        newproduct["product_id"] = {
                            "t": "string",
                            "v": product[prodkey]
                        };
                        break;
                    case "name":
                        newproduct["product_name"] = {
                            "t": "string",
                            "v": product[prodkey]
                        };
                        break;
                    case "price":
                        newproduct["product_price"] = {
                            "t": "number",
                            "v": product[prodkey]
                        };
                        break;
                    case "quantity":
                        newproduct["product_quantity"] = {
                            "t": "number",
                            "v": product[prodkey]
                        };
                        break;
                    case "brand":
                        newproduct["product_brand"] = {
                            "t": "string",
                            "v": product[prodkey]
                        };
                        break;
                    case "category":
                        newproduct["product_category"] = {
                            "t": "string",
                            "v": product[prodkey]
                        };
                        break;
                    case "variant":
                        newproduct["product_variant"] = {
                            "t": "string",
                            "v": product[prodkey]
                        };
                        break;
                    default:
                        newproduct["product_" + prodkey] = {
                            "t": typeof product[prodkey],
                            "v": product[prodkey]
                        };
                        break;
                }
            }
            products.push(newproduct);
        }
        return products;
    };
};

setTimeout(function () { trigger() }, 2000);