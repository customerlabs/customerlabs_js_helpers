/**
 * CustomerLabs Tracking code - Custom pixel code for shopify 
* */

!function(t,e,r,c,a,n,s){t.ClAnalyticsObject=a,t[a]=t[a]||[],t[a].methods=["trackSubmit","trackClick","pageview","identify","track"],t[a].factory=function(e){return function(){var r=Array.prototype.slice.call(arguments);return r.unshift(e),t[a].push(r),t[a]}};for(var i=0;i<t[a].methods.length;i++){var o=t[a].methods[i];t[a][o]=t[a].factory(o)}n=e.createElement(r),s=e.getElementsByTagName(r)[0],n.async=1,n.crossOrigin="anonymous",n.src=c,s.parentNode.insertBefore(n,s)}(window,document,"script","//cdn.js.customerlabs.co/CUSTOMELABS_ACCOUNT_ID.js","_cl");_cl.SNIPPET_VERSION="1.0.0";_cl.SANDBOX_ENV=true;

/**
* @variable  __CL__ contains debug and fb_skip_contents
**/
var __CL__ = {
    debug: false, // if true, console messages will be display
    shopify_debug: false, // if true, shopify event console messages will be display
    fb_skip_contents: false,
    //The events will be trigger based on the boolean value 
    product_viewed: true, 
    collection_viewed: true, 
    product_added_to_cart: true, 
    search_submitted: true, 
    cart_viewed: true, 
    checkout_started: true, 
    checkout_address_info_submitted: true, 
    checkout_contact_info_submitted: true, 
    checkout_shipping_info_submitted: true, 
    payment_info_submitted: true, 
    checkout_completed: true
};

/**
 * @function shopify_products_mapping
 * @params items array
**/
function shopify_products_mapping(items, itemGroup) {
   var products = [];
    if(items && itemGroup && items.length > 0){//items  
        for(var i=0;i< items.length;i++){
            var productData = items[i][itemGroup];
            var product = {
                "id"              : productData.product.id,
                "sku"             : productData.sku,
                "name"            : productData.product.title,
                "price"           : productData.price.amount,
                "imageURL"        : productData.image.src, 
                "brand"           : productData.product.vendor,
                "type"            : productData.product.type,
                "quantity"        : items[i].quantity
            }
            products.push(product)
        }
    }
   return products;
}


/**
 * @function clabs_product_mappings
 * @params products array
**/
function clabs_product_mappings(products) {
    var clabs_products = [];
    for(let i = 0 ; i < products.length ; i++) {
        var clabs_product = {}
        for(var key in products[i]) {
            switch(key) {
                case "name":
                case "title":
                    clabs_product.product_name = {"t": "string", "v": products[i][key]}
                    break;
                case "id":
                    clabs_product.product_id = {"t": "string", "v": products[i].id}
                    break;
                case "price":
                    clabs_product.product_price = {"t": "number", "v": products[i].price}
                    break;
                case "category":
                    clabs_product.product_category = {"t": "string", "v": products[i].category}
                    break;
                case "brand":
                    clabs_product.product_brand = {"t": "string", "v": products[i].brand}
                    break;
                case "variant":
                    clabs_product.product_variant = {"t": "string", "v": products[i].variant}
                    break;
                case "productType":
                    clabs_product.product_type = {"t": "string", "v": products[i].productType}
                    break;
                case "coupon":
                    clabs_product.product_coupon = {"t": "string", "v": products[i].coupon}
                    break;
                case "quantity":
                    clabs_product.product_quantity = {"t": "string", "v": products[i].quantity}
                    break;
                default:
                    let isnum = /^\d+$/.test(products[i][key]);
                    var type = ""
                    if(Array.isArray(products[i][key])) {
                        continue;
                    } else if(typeof products[i][key] === "object" && products[i][key] !== null && !Array.isArray(products[i][key])) {
                        continue;
                    } else if(products[i][key] !== null && (Number.isFinite(products[i][key]) || isnum || !isNaN(parseFloat(products[i][key])))) {
                        type = "number"
                    }  else {
                        type = "string"
                    }
                    if(key.substring(0, 8) === "product_") {
                        clabs_product[key] = {"t": type, "v": products[i][key]}
                    } else {
                        clabs_product["product_"+key] = {"t": type, "v": products[i][key]}
                    }
            }
        }
        clabs_products.push(clabs_product);
    }
    return clabs_products
}

/**
 * @function identify_properties_mapping
 * @params properties object
 */
function identify_properties_mapping(properties) {
    var identify_properties = {};

    if (properties.email) {
        identify_properties.email = properties.email;
    }

    if (properties.phone) {
        identify_properties.phone = properties.phone;
    }
    for (var shippingKey in properties.shippingAddress) {
        if (properties.shippingAddress && properties.shippingAddress[shippingKey]) {
            identify_properties[shippingKey] = properties.shippingAddress[shippingKey];
        }
    }
    return identify_properties;
}

/**
 * @function identify_properties_formating
 * @params properties object
 */
function identify_properties_formating(properties) {
    var clabs_properties = {}
    for(var key in properties) {
      if(properties[key]!=null){
        switch(key) {
            case "email":
                clabs_properties.email = {"t": "string", "v": properties[key]}
                break;
            case "phone":
                clabs_properties.phone = {"t": "number", "v": properties[key]}
                break;
            case "city":
                clabs_properties.city = {"t": "string", "v": properties[key]}
                break;
            case "country":
                clabs_properties.country = {"t": "string", "v": properties[key]}
                break;
            case "countryCode":
                clabs_properties.country_code = {"t": "string", "v": properties[key]}
                break;
            case "state":
                clabs_properties.state = {"t": "string", "v": properties[key]}
                break;
            case "address1":
                clabs_properties.address1 = {"t": "string", "v": properties[key]}
                break;
            case "address2":
                clabs_properties.address2 = {"t": "string", "v": properties[key]}
                break;
            case "firstName":
                clabs_properties.firstName = {"t": "string", "v": properties[key]}
                break;
            case "lastName":
                clabs_properties.lastName = {"t": "string", "v": properties[key]}
                break;
            case "province":
                clabs_properties.province = {"t": "string", "v": properties[key]}
                break;
            case "provinceCode":
                clabs_properties.provinceCode = {"t": "string", "v": properties[key]}
                break;
            case "zip":
                clabs_properties.zip = {"t": "string", "v": properties[key]}
                break;
                    
        }
      }
    }
    return clabs_properties
}

/**
 * @function identify_properties_to_send
 * @params event
 */
function identify_properties_to_send(event){
    var identify_properties = identify_properties_mapping(event.data.checkout);
    var user_traits_value = identify_properties_formating(identify_properties);
    var propertiesToSend = {
        "customProperties": {
            "user_traits": {
                "t": "Object",
                "v": user_traits_value
            }
        }
    }
    if(user_traits_value.email){
        propertiesToSend.customProperties.identify_by_email = {
            "t":"string",
            "v": user_traits_value.email.v,
            "ib": true
        }
    }
    if(user_traits_value.phone){
        propertiesToSend.customProperties.identify_by_phone = {
            "t":"number",
            "v": user_traits_value.phone.v,
            "ib": true
        }
    }
    return propertiesToSend;
}

/**
 * @function clShopifyTrack
 * This function triggers default shopify standard events
**/
window.clShopifyTrack = function() {
    //Product viewed event
    analytics.subscribe("product_viewed", event => {
        if (__CL__.shopify_debug) {
            console.log("product_viewed"+" : "+ event);
        }
        if (event.name && __CL__[event.name]){
            var eventData = event.data.productVariant;
            var product = shopify_products_mapping([event.data], "productVariant");
            var customData = {
                "currency": {
                    "t": "string",
                    "v": eventData.price.currencyCode
                },
                "url":{
                    "t": "string",
                    "v": event.context.window.location.href
                },
                "content_type": {
                    "t": "string",
                    "v": "product_group"
                }
            };
            if(__CL__.fb_skip_contents){
                customData.skip_contents = true;
            }
            var productData = clabs_product_mappings([product]);
            if(productData[0].product_price){
                customData.value = productData[0].product_price;
            }
            var properties = {
                "customProperties"  : customData,
                "productProperties" : productData
            };
            _cl.trackClick("Product viewed", properties);
            if (__CL__.debug) {
                console.log("Product viewed"+" : "+ JSON.stringify(properties));
            }
        }
    });
    //Category viewed event
    analytics.subscribe("collection_viewed", event => {
        if (__CL__.shopify_debug) {
            console.log("collection_viewed"+" : "+ event);
        }
        if (event.name && __CL__[event.name]){
            var properties = {
                "customProperties": {
                    "url":{
                        "t": "string",
                        "v": event.context.window.location.href
                    },
                    "category_name":{
                        "t": "string",
                        "v": event.data.collection.title
                    },
                    "category_id":{
                        "t": "string",
                        "v": event.data.collection.id
                    },
                    "content_type": {
                        "t": "string",
                        "v": "product_group"
                    }
                }
            };
            _cl.pageview("Category viewed", properties);
            if (__CL__.debug) {
                console.log("Category viewed"+" : "+ JSON.stringify(properties));
            } 
        }
    });
    //Added to cart event
    analytics.subscribe("product_added_to_cart", event => {
        if (__CL__.shopify_debug) {
            console.log("product_added_to_cart"+" : "+ event);
        }
        if (event.name && __CL__[event.name]){
            var eventData = event.data.cartLine;
            var product = shopify_products_mapping([eventData], "merchandise");
            var productData = clabs_product_mappings([product]);
            var customData = {
                "currency": {
                    "t": "string",
                    "v": eventData.cost.totalAmount.currencyCode
                },
                "url": {
                    "t": "string",
                    "v": event.context.window.location.href
                },
                "value":{
                    "t": "number",
                    "v": eventData.cost.totalAmount.amount
                },
                "content_type": {
                    "t": "string",
                    "v": "product_group"
                }
            }
            if(__CL__.fb_skip_contents){
                customData.skip_contents = true;
            }
            var properties = {
                "customProperties"  : customData,
                "productProperties" : productData
            };
            _cl.trackClick("Added to cart",properties); 
            if (__CL__.debug) {
                console.log("Added to cart"+" : "+ JSON.stringify(properties));
            } 
        }
    });
    //Search made event
    analytics.subscribe("search_submitted", event => {
        if (__CL__.shopify_debug) {
            console.log("search_submitted"+" : "+ event);
        }
        if (event.name && __CL__[event.name]){
            var properties = {
                "customProperties" : {
                    "search_string": {
                        "t": "string",
                        "v": event.data.searchResult.query
                    },
                    "url": {
                        "t": "string",
                        "v": event.context.window.location.href
                    }
                }
            }
            _cl.pageview("Search made",properties);
            if (__CL__.debug) {
                console.log("Search made"+" : "+ JSON.stringify(properties));
            } 
        }
    });
    //Cart Viewed event
    analytics.subscribe("cart_viewed", event => {
        if (__CL__.shopify_debug) {
            console.log("cart_viewed"+" : "+ event);
        }
        if (event.name && __CL__[event.name]){
            var products = shopify_products_mapping(event.data.cart.lines, "merchandise");
            var productData = clabs_product_mappings(products);
            var cartData = event.data.cart;
            var cartTotal =  ((cartData.cost || {}).totalAmount || {}) || {};
            var customData = {
                "currency": {
                    "t": "string",
                    "v": cartTotal.currencyCode || 0
                },
                "value":{
                    "t": "number",
                    "v": cartTotal.amount || 0
                },
                "content_type": {
                    "t": "string",
                    "v": "product_group"
                }
            }
            if(__CL__.fb_skip_contents){
                customData.skip_contents = true;
            }
            var properties = {
                "customProperties"  : customData,
                "productProperties" : productData
            };
            _cl.trackClick("Cart viewed", properties);
            if (__CL__.debug) {
                console.log("Cart viewed"+" : "+ JSON.stringify(properties));
            }
        }
    });
    //Checkout made event
    analytics.subscribe("checkout_started", event => {
        if (__CL__.shopify_debug) {
            console.log("checkout_started"+" : "+ event);
        }
        if (event.name && __CL__[event.name]){
            var products = shopify_products_mapping(event.data.checkout.lineItems, "variant");
            var productData = clabs_product_mappings(products);
            var checkoutData = event.data.checkout;
            var customData = {
                "currency": {
                    "t": "string",
                    "v": checkoutData.currencyCode
                },
                "value":{
                    "t": "number",
                    "v": (checkoutData.totalPrice || {}).amount || 0
                },
                "subtotal": {
                    "t": "number",
                    "v": (checkoutData.subtotalPrice || {}).amount || 0
                },
                "tax" : {
                    "t": "number",
                    "v": (checkoutData.totalTax || {}).amount || 0
                },
                "content_type": {
                    "t": "string",
                    "v": "product_group"
                }
            }
            if(__CL__.fb_skip_contents){
                customData.skip_contents = true;
            }
            var properties = {
                "customProperties"  : customData,
                "productProperties" : productData
            };
            _cl.trackClick("Checkout made",properties);
            if (__CL__.debug) {
                console.log("Checkout made"+" : "+ JSON.stringify(properties));
            }
        } 
    });
     //AddContactInfo event
    analytics.subscribe("checkout_contact_info_submitted", event => {
        if (__CL__.shopify_debug) {
            console.log("checkout_contact_info_submitted"+" : "+ event);
        }
        if (event.name && __CL__[event.name]){
            var checkoutData = event.data.checkout;
            var properties = {
                "subtotal":{
                    "t": "number",
                    "v": (checkoutData.subtotalPrice || {}).amount || 0
                },
                "tax": {
                    "t": "string",
                    "v": (checkoutData.totalTax || {}).amount || 0
                },
                "value": {
                    "t": "string",
                    "v": (checkoutData.totalPrice || {}).amount || 0
                },
                "currency": {
                    "t": "string",
                    "v": checkoutData.currencyCode
                } 
            }
            var propertiesToSend = identify_properties_to_send(event);
            _cl.identify(propertiesToSend);
            _cl.trackClick("AddContactInfo",{"customProperties": properties});
            if (__CL__.debug) {
                console.log("AddContactInfo"+" :"+JSON.stringify(properties));
            } 
        }
    });
    //AddAddressInfo event
    analytics.subscribe("checkout_address_info_submitted", event => {
        if (__CL__.shopify_debug) {
            console.log("checkout_address_info_submitted"+" : "+ event);
        }
        if (event.name && __CL__[event.name]){
            var checkoutData = event.data.checkout;
            var shippingDetails = checkoutData.shippingLine.price || checkoutData.shippingPrice;
            var properties = {
                "subtotal":{
                    "t": "number",
                    "v": (checkoutData.subtotalPrice || {}).amount || 0
                },
                "shipping_price":{
                    "t": "number",
                    "v": shippingDetails && shippingDetails.amount || 0
                },
                "tax": {
                    "t": "string",
                    "v": (checkoutData.totalTax || {}).amount || 0
                },
                "value": {
                    "t": "string",
                    "v": (checkoutData.totalPrice || {}).amount || 0
                },
                "currency": {
                    "t": "string",
                    "v": checkoutData.currencyCode
                } 
            }
            var propertiesToSend = identify_properties_to_send(event);
            _cl.identify(propertiesToSend);
            _cl.trackClick("AddAddressInfo",{"customProperties": properties});
            if (__CL__.debug) {
                console.log("AddAddressInfo"+" :"+JSON.stringify(properties));
            } 
        }
    });
    //AddShippingInfo event
    analytics.subscribe("checkout_shipping_info_submitted", event => {
        if (__CL__.shopify_debug) {
            console.log("checkout_shipping_info_submitted"+" : "+ event);
        }
        if (event.name && __CL__[event.name]){
            var checkoutData = event.data.checkout;
            var shippingDetails = checkoutData.shippingLine.price || checkoutData.shippingPrice;
            var properties = {
                "subtotal":{
                    "t": "number",
                    "v": (checkoutData.subtotalPrice || {}).amount || 0
                },
                "shipping_price":{
                    "t": "number",
                    "v": shippingDetails && shippingDetails.amount || 0
                },
                "tax": {
                    "t": "string",
                    "v": (checkoutData.totalTax || {}).amount || 0
                },
                "value": {
                    "t": "string",
                    "v": (checkoutData.totalPrice || {}).amount || 0
                },
                "currency": {
                    "t": "string",
                    "v": checkoutData.currencyCode
                } 
            }
            var propertiesToSend = identify_properties_to_send(event);
            _cl.identify(propertiesToSend);
            _cl.trackClick("AddShippingInfo",{"customProperties": properties});
            if (__CL__.debug) {
                console.log("AddShippingInfo"+" :"+JSON.stringify(properties));
            } 
        }
    });
    //AddPaymentinfo event
    analytics.subscribe("payment_info_submitted", event => {
        if (__CL__.shopify_debug) {
            console.log("payment_info_submitted"+" : "+ event);
        }
        if (event.name && __CL__[event.name]){
            var checkoutData = event.data.checkout;
            var shippingDetails = checkoutData.shippingLine.price || checkoutData.shippingPrice;
            var properties = {
                "subtotal":{
                    "t": "number",
                    "v": (checkoutData.subtotalPrice || {}).amount || 0
                },
                "shipping_price":{
                    "t": "number",
                    "v": shippingDetails && shippingDetails.amount || 0
                },
                "tax": {
                    "t": "string",
                    "v": (checkoutData.totalTax || {}).amount || 0
                },
                "value": {
                    "t": "string",
                    "v": (checkoutData.totalPrice || {}).amount || 0
                },
                "currency": {
                    "t": "string",
                    "v": checkoutData.currencyCode
                } 
            }
            var propertiesToSend = identify_properties_to_send(event);
            _cl.identify(propertiesToSend);
            _cl.trackClick("AddPaymentInfo",{"customProperties": properties});
            if (__CL__.debug) {
                console.log("AddPaymentInfo"+" :"+JSON.stringify(properties));
            } 
        }
    });
    //Purchased event
    analytics.subscribe("checkout_completed", event => {
        if (__CL__.shopify_debug) {
            console.log("checkout_completed"+" : "+ event);
        }
        if (event.name && __CL__[event.name]){
            var products = shopify_products_mapping(event.data.checkout.lineItems, "variant");
            var productData = clabs_product_mappings(products);
            var shippingDetails = event.data.checkout.shippingLine.price || event.data.checkout.shippingPrice;
            var parts = event.data.checkout.order.id.split('/');
            var transaction_number = parts[parts.length - 1];
    
            console.log(transaction_number); 
            var customData = {
                "transaction_number":{
                    "t": "string",
                    "v": transaction_number
                },
                "currency": {
                    "t": "string",
                    "v": (event.data.checkout.totalPrice || {}).currencyCode
                },
                "subtotal": {
                    "t": "number",
                    "v": (event.data.checkout.subtotalPrice || {}).amount || 0
                },
                "tax" : {
                    "t": "number",
                    "v": (event.data.checkout.totalTax || {}).amount || 0
                },
                "shipping" : {
                    "t": "number",
                    "v": shippingDetails && shippingDetails.amount || 0
                },
                "value":{
                    "t": "number",
                    "v": (event.data.checkout.totalPrice || {}).amount || 0
                },
                "content_type": {
                    "t": "string",
                    "v": "product_group"
                }
            }
            var properties = {
                "customProperties"  : customData,
                "productProperties" : productData
            };
            var propertiesToSend = identify_properties_to_send(event);
            _cl.identify(propertiesToSend);
            if(customData.transaction_number && customData.transaction_number.v && window.localStorage){
                var purchases_str = localStorage.getItem('cl_past_purchases') || "{}";
                var purchases = JSON.parse(purchases_str);
                if(!purchases[customData.transaction_number.v]){
                    _cl.trackClick("Purchased",properties);
                    purchases[customData.transaction_number.v] = "true";
                    window.localStorage.setItem("cl_past_purchases", JSON.stringify(purchases));
                }

            }else{
                _cl.trackClick("Purchased",properties);
                console.log("Purchased :", properties);
                console.log("Purchased"+" :"+JSON.stringify(properties));
            }
            if (__CL__.debug) {
                console.log("Purchased"+" :"+JSON.stringify(properties));
            } 
        }
    });
    
}
//End of the customerlabs custom pixel code
