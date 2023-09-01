/**
 * CustomerLabs with Shopify Tracking code - Custom pixel code for shopify 
* */


/**
* @variable  __CL__ 
* @type Object 
* The '__CL__' variable holds configuration settings for the integration of Shopify customer events with CustomerLabs.
* It includes debug settings, default currency, and event triggers.
* Feel free to adjust these settings to match your specific use case.
*
* Settings:
    - debug: Display event properties in console messages for debugging the incoming and outgoing data (true to show, false to hide).
    - fb_skip_contents: Enable skipping of Facebook contents (true to enable, false to disable).
    - default_currency: Send "USD" as the currency if the event does not provide a currency code.
    - product_viewed: Trigger a product viewed event when a specific product is viewed (true to trigger, false to suppress).
    - collection_viewed: Trigger a collection viewed event when a collection is viewed (true to trigger, false to suppress).
    - product_added_to_cart: Trigger a product added to cart event when a product is added to the cart (true to trigger, false to suppress).
    - search_submitted: Trigger a submitted search event when a search is submitted (true to trigger, false to suppress).
    - cart_viewed: Trigger a cart viewed event when the cart is viewed (true to trigger, false to suppress).
    - checkout_started: Trigger a checkout started event when the checkout process begins (true to trigger, false to suppress).
    - checkout_address_info_submitted: Trigger a submitted checkout address info event when address information is submitted (true to trigger, false to suppress).
    - checkout_contact_info_submitted: Trigger a submitted checkout contact info event when contact information is submitted (true to trigger, false to suppress).
    - checkout_shipping_info_submitted: Trigger a submitted checkout shipping info event when shipping information is submitted (true to trigger, false to suppress).
    - payment_info_submitted: Trigger a submitted payment info event when payment information is submitted (true to trigger, false to suppress).
    - checkout_completed: Set to 'false' if the post-purchase feature is available; otherwise, set to 'true'.
*
**/

var __CL__ = {
    debug: false,
    fb_skip_contents: false,
    default_currency: "USD",
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

/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
*
* Warning: This below code connects Shopify customer events with CustomerLabs. Please avoid altering this code, as changes could cause problems with the integration.
*
*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/**
 * CustomerLabs Tracking code  
* */

!function(t,e,r,c,a,n,s){t.ClAnalyticsObject=a,t[a]=t[a]||[],t[a].methods=["trackSubmit","trackClick","pageview","identify","track"],t[a].factory=function(e){return function(){var r=Array.prototype.slice.call(arguments);return r.unshift(e),t[a].push(r),t[a]}};for(var i=0;i<t[a].methods.length;i++){var o=t[a].methods[i];t[a][o]=t[a].factory(o)}n=e.createElement(r),s=e.getElementsByTagName(r)[0],n.async=1,n.crossOrigin="anonymous",n.src=c,s.parentNode.insertBefore(n,s)}(window,document,"script","//cdn.js.customerlabs.co/CUSTOMELABS_ACCOUNT_ID.js","_cl");_cl.SNIPPET_VERSION="1.0.0";_cl.SANDBOX_ENV=true;


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
                clabs_properties.phone = {"t": "string", "v": properties[key]}
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
    if(user_traits_value.email && user_traits_value.phone){
        propertiesToSend.customProperties.identify_by_email = {
            "t":"string",
            "v": user_traits_value.email.v,
            "ib": true
        }
        var regex = /^\+?\d+$/;
        var isValidPhoneNumber = regex.test(user_traits_value.phone.v);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
        if (isValidPhoneNumber) {
            propertiesToSend.customProperties.external_ids = {
                "t": "Object",
                "v": {
                    "identify_by_phone": {
                        "t": "string",
                        "v": user_traits_value.phone.v
                    }
                }
            };
        }

    }else if (user_traits_value.email){
        propertiesToSend.customProperties.identify_by_email = {
            "t":"string",
            "v": user_traits_value.email.v,
            "ib": true
        }
           
    }
    else if(user_traits_value.phone){
        propertiesToSend.customProperties.identify_by_phone = {
            "t":"string",
            "v": user_traits_value.phone.v,
            "ib": true
        }
    }
    return propertiesToSend;
}

/**
 * @function extractOrderID
 * @param orderId string
 * This function is used to extract the order ID from the global id
**/
function extractOrderID(orderId) {
    // Check if the identifier starts with "gid://shopify/OrderIdentity/"
    if (orderId.startsWith('gid://shopify/OrderIdentity/')) {
      const parts = orderId.split('/');
      return parts[parts.length - 1];
    }
  
    // If it's not in the GID format, assume it's a numeric order ID
    return orderId;
}

/**
 * @function PrintEventProperties
 * @param trackObj object
 * This function is used to print the events properties into the table view.
**/
var PrintEventProperties = function(trackObj, event) {
    function attributeTable(attribute, value) {
        return attribute + ": " + value;
    }
    
    var customProperties = trackObj.customProperties;
    var productProperties = trackObj.productProperties;

    var logger = console;

    // Style for the heading
    var headingStyle = "color:#1ab394; font-size:16px; font-weight:bold;";
    var subheadingStyle = "color:#1ab394; font-size:15px; font-weight:bold;";


    // Style for the text
    var textStyle = "font-size:13px;";
    // Log the event sent message with the specified style
    logger.log("%c✅ Event sent to Customerlabs", headingStyle);

    // Log the event heading with the specified style
    logger.groupCollapsed("%cEvent : " + event, subheadingStyle );
    
    // Display custom properties using logger
    logger.group("%cCustom Properties:", textStyle);
    if (Object.keys(customProperties).length > 0) {
        for (var key in customProperties) {
            logger.log("%c" + attributeTable(key, customProperties[key].v), textStyle);
        }
    } else {
        logger.log("%cNo Custom Properties", textStyle);
    }
    logger.groupEnd();
    
    // Display product properties using logger
    logger.group("%cProduct Properties:", textStyle);
    if (productProperties.length > 0) {
        for (var i = 0; i < productProperties.length; i++) {
            var productHeading = "Product " + (i + 1);
            logger.groupCollapsed("%c" + productHeading, textStyle);
            for (var prodkey in productProperties[i]) {
                logger.log("%c" + attributeTable(prodkey, productProperties[i][prodkey].v), textStyle);
            }
            logger.groupEnd();
        }
    } else {
        logger.log("%cNo Product Attributes", textStyle);
    }
    
    logger.groupEnd();

};


/**
 * @function clShopifyTrack
 * This function triggers default shopify standard events
**/
window.clShopifyTrack = function() {
    //Product viewed event
    analytics.subscribe("product_viewed", event => {
        if (__CL__.debug) {
            console.log("----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------")
            console.log("product_viewed"+" : ", event);
            console.log("----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------")
        }
        if (event.name && __CL__[event.name]){
            var eventData = event.data;
            var product = shopify_products_mapping([eventData], "productVariant");
            var customData = {
                "currency": {
                    "t": "string",
                    "v": eventData.productVariant.price.currencyCode || __CL__.default_currency
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
            var productData = clabs_product_mappings(product);
            if(productData[0].product_price){
                customData.value = productData[0].product_price;
            }
            var properties = {
                "customProperties"  : customData,
                "productProperties" : productData
            };
            if (__CL__.debug) {
                PrintEventProperties(properties, "Product viewed");
            }
            _cl.trackClick("Product viewed", properties);
        }
    });
    //Category viewed event
    analytics.subscribe("collection_viewed", event => {
        if (__CL__.debug) {
            console.log("----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------")
            console.log("collection_viewed"+" : ", event);
            console.log("----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------")
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
            if (__CL__.debug) {
                PrintEventProperties(properties, "Category viewed");
            }
            _cl.pageview("Category viewed", properties);
        }
    });
    //Added to cart event
    analytics.subscribe("product_added_to_cart", event => {
        if (__CL__.debug) {
            console.log("----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------")
            console.log("product_added_to_cart"+" : ", event);
            console.log("----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------")
        }
        if (event.name && __CL__[event.name]){
            var eventData = event.data.cartLine;
            var product = shopify_products_mapping([eventData], "merchandise");
            var productData = clabs_product_mappings(product);
            var customData = {
                "currency": {
                    "t": "string",
                    "v": eventData.cost.totalAmount.currencyCode || __CL__.default_currency
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
            if (__CL__.debug) {
                PrintEventProperties(properties, "Added to cart");
            }
            _cl.trackClick("Added to cart",properties); 
            
        }
    });
    //Search made event
    analytics.subscribe("search_submitted", event => {
        if (__CL__.debug) {
            console.log("----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------")
            console.log("search_submitted"+" : ", event);
            console.log("----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------")
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
            if (__CL__.debug) {
                PrintEventProperties(properties, "Search made");
            }
            _cl.pageview("Search made",properties);
        }
    });
    //Cart Viewed event
    analytics.subscribe("cart_viewed", event => {
        if (__CL__.debug) {
            console.log("----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------")
            console.log("cart_viewed"+" : ", event);
            console.log("----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------")
        }
        if (event.name && __CL__[event.name]){
            var eventData = ((event.data.cart || {}).lines || []);
            var products = shopify_products_mapping(eventData, "merchandise");
            var productData = clabs_product_mappings(products);
            var cartData = event.data.cart;
            var cartTotal =  ((cartData.cost || {}).totalAmount || {}) || {};
            var customData = {
                "currency": {
                    "t": "string",
                    "v": cartTotal.currencyCode || __CL__.default_currency
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
            if (__CL__.debug) {
                PrintEventProperties(properties, "Cart viewed");
            }
            _cl.trackClick("Cart viewed", properties);
        }
    });
    //Checkout made event
    analytics.subscribe("checkout_started", event => {
        if (__CL__.debug) {
            console.log("----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------")
            console.log("checkout_started"+" : ", event);
            console.log("----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------")
        }
        if (event.name && __CL__[event.name]){
            var eventData = ((event.data.checkout || {}).lineItems || []);
            var products = shopify_products_mapping(eventData, "variant");
            var productData = clabs_product_mappings(products);
            var checkoutData = event.data.checkout;
            var customData = {
                "currency": {
                    "t": "string",
                    "v": checkoutData.currencyCode || __CL__.default_currency
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
            if (__CL__.debug) {
                PrintEventProperties(properties, "Checkout made");
            }
            _cl.trackClick("Checkout made",properties);
        } 
    });
     //AddContactInfo event
    analytics.subscribe("checkout_contact_info_submitted", event => {
        if (__CL__.debug) {
            console.log("----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------")
            console.log("checkout_contact_info_submitted"+" : ", event);
            console.log("----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------")
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
                    "v": checkoutData.currencyCode || __CL__.default_currency
                } 
            }
            var propertiesToSend = identify_properties_to_send(event);
            _cl.identify(propertiesToSend);
            if (__CL__.debug) {
                PrintEventProperties(properties, "AddContactInfo");
            }
            _cl.trackClick("AddContactInfo",{"customProperties": properties});
        }
    });
    //AddAddressInfo event
    analytics.subscribe("checkout_address_info_submitted", event => {
        if (__CL__.debug) {
            console.log("----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------")
            console.log("checkout_address_info_submitted"+" : ", event);
            console.log("----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------")
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
                    "v": checkoutData.currencyCode || __CL__.default_currency
                } 
            }
            var propertiesToSend = identify_properties_to_send(event);
            _cl.identify(propertiesToSend);
            if (__CL__.debug) {
                PrintEventProperties(properties, "AddAddressInfo");
            }
            _cl.trackClick("AddAddressInfo",{"customProperties": properties});
        }
    });
    //AddShippingInfo event
    analytics.subscribe("checkout_shipping_info_submitted", event => {
        if (__CL__.debug) {
            console.log("----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------")
            console.log("checkout_shipping_info_submitted"+" : ", event);
            console.log("----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------")
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
                    "v": checkoutData.currencyCode || __CL__.default_currency
                } 
            }
            var propertiesToSend = identify_properties_to_send(event);
            _cl.identify(propertiesToSend);
            if (__CL__.debug) {
                PrintEventProperties(properties, "AddShippingInfo");
            }
            _cl.trackClick("AddShippingInfo",{"customProperties": properties});
        }
    });
    //AddPaymentinfo event
    analytics.subscribe("payment_info_submitted", event => {
        if (__CL__.debug) {
            console.log("----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------")
            console.log("payment_info_submitted"+" : ", event);
            console.log("----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------")
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
                    "v": checkoutData.currencyCode || __CL__.default_currency
                } 
            }
            var propertiesToSend = identify_properties_to_send(event);
            _cl.identify(propertiesToSend);
            if (__CL__.debug) {
                PrintEventProperties(properties, "AddPaymentInfo");
            }
            _cl.trackClick("AddPaymentInfo",{"customProperties": properties});
        }
    });
    //Purchased event
    analytics.subscribe("checkout_completed", event => {
        if (__CL__.debug) {
            console.log("----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------")
            console.log("checkout_completed"+" : ", event);
            console.log("----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------")
        }
        if (event.name && __CL__[event.name]){
            var eventData = ((event.data.checkout || {}).lineItems || []);
            var products = shopify_products_mapping(eventData, "variant");
            var productData = clabs_product_mappings(products);
            var shippingDetails = event.data.checkout.shippingLine.price || event.data.checkout.shippingPrice;
            var transaction_number = extractOrderID(event.data.checkout.order.id);
            var customData = {
                "transaction_number":{
                    "t": "string",
                    "v": transaction_number
                },
                "currency": {
                    "t": "string",
                    "v": (event.data.checkout.totalPrice || {}).currencyCode || __CL__.default_currency
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
            if (__CL__.debug) {
                PrintEventProperties(properties, "Purchased");
            }
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
                console.log("Purchased"+" :"+JSON.stringify(properties));
            }
        }
    });
    
}
//End of the customerlabs custom pixel code
