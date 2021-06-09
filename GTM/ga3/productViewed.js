/**
 * wrap this code inside a script tag <script> [CODE] </script>
 */

function trigger() {
    var cdl = dataLayer || {};
    var hasEvent = false;
    for (var i in cdl) {
        obj = cdl[i];
        if (obj.event == "productDetailView") {
            var detail_event = obj.ecommerce.detail;
            var properties = {};
            properties["productProperties"] = genProductProps(detail_event.products);
            _cl.pageview("Product viewed", properties);
            hasEvent = true;
        }
    };
    if (!hasEvent) {
        setTimeout(function () { trigger() }, 1000)
    }
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