/**
 * CustomerLabs Tracking code - Custom pixel code for shopify 
 * Find your Account Id at the top right navbar dropdown
 * Copy your account id and replace the text 'CUSTOMELABS_APP_ID' to your account id to assign the 'customerlabs_app_id' value.
 * */

var customerlabs_app_id = 'cl52245rzxaetx'; //"CUSTOMELABS_APP_ID";
!function(t,e,r,c,a,n,s){t.ClAnalyticsObject=a,t[a]=t[a]||[],t[a].methods=["trackSubmit","trackClick","pageview","identify","track"],t[a].factory=function(e){return function(){var r=Array.prototype.slice.call(arguments);return r.unshift(e),t[a].push(r),t[a]}};for(var i=0;i<t[a].methods.length;i++){var o=t[a].methods[i];t[a][o]=t[a].factory(o)}n=e.createElement(r),s=e.getElementsByTagName(r)[0],n.async=1,n.crossOrigin="anonymous",n.src=c,s.parentNode.insertBefore(n,s)}(window,document,"script","//cdn.js.customerlabs.co/"+customerlabs_app_id+".js","_cl");_cl.SNIPPET_VERSION="1.0.0"

/**
* DYNAMIC DEPENDENCIES
**/
var __DL__ = {
    debug: true, // if true, console messages will be display
    fb_skip_contents: false
};

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
                    } else if(typeof products[i][key] === 'object' && products[i][key] !== null && !Array.isArray(products[i][key])) {
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
 * @function shopify_products_mapping
 * @params items array
**/
function shopify_products_mapping(items) {
   var products = [];
   if(items.length > 0){
     for(var i=0;i< items.length;i++){
       var product = {
          'id'              : items[i].variant.product.id,
          'sku'             : items[i].variant.sku,
          'name'            : items[i].variant.product.title,
          'price'           : items[i].variant.price.amount,
          'imageURL'        : items[i].variant.image.src, 
          'brand'           : items[i].variant.product.vendor,
          'quantity'        : items[i].quantity
        }
        products.push(product)
     }
   }
   return products;
}

/**
 * @function clShopifyTrack
 * This function triggers default shopify standard events
**/
window.clShopifyTrack = function() {
    //pageview event
    analytics.subscribe("page_viewed", event => {
        var properties = {
            "customProperties": {
                "url":{
                    "t": "string",
                    "v": event.context.window.location.href
                }
            }
        };
        _cl.pageview('pageview',properties);
        if (__DL__.debug) {
            console.log("pageview"+" :"+JSON.stringify(properties));
        }
    });
    //Product viewed event
    analytics.subscribe("product_viewed", event => {
        var product = {
            'id'              : event.data.productVariant.product.id,
            'sku'             : event.data.productVariant.sku,
            'name'            : event.data.productVariant.product.title,
            'price'           : event.data.productVariant.price.amount,
            'imageURL'        : event.data.productVariant.image.src, 
            'brand'           : event.data.productVariant.product.vendor
        };
        var customData = {
            "currency": {
                't': 'string',
                'v': event.data.productVariant.price.currencyCode
            },
            "url":{
                't': 'string',
                'v': event.context.window.location.href
            }
        };
        if(__DL__.fb_skip_contents){
            customData.skip_contents = true;
        }
        var productData = clabs_product_mappings([product]);
        if(productData[0].product_price){
            customData.value = productData[0].product_price;
        }
        var properties = {
            'customProperties'  : customData,
            'productProperties' : productData
        };
        _cl.trackClick('Product viewed',properties);
        if (__DL__.debug) {
            console.log("Product viewed"+" :"+JSON.stringify(properties));
        }
    });
    //Category viewed
    analytics.subscribe("collection_viewed", event => {
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
                }
            }
        };
        _cl.pageview('Category viewed',properties);
        if (__DL__.debug) {
            console.log("Category viewed"+" :"+JSON.stringify(properties));
        } 
    });
    //Added to cart event
    analytics.subscribe("product_added_to_cart", event => {
        var product = {
            'id'              : event.data.cartLine.merchandise.product.id,
            'sku'             : event.data.cartLine.merchandise.sku,
            'name'            : event.data.cartLine.merchandise.product.title,
            'price'           : event.data.cartLine.merchandise.price.amount,
            'imageURL'        : event.data.cartLine.merchandise.image.src, 
            'brand'           : event.data.cartLine.merchandise.product.vendor,
            'quantity'        : event.data.cartLine.quantity
        };
        var productData = clabs_product_mappings([product]);
        var customData = {
            "currency": {
                't': 'string',
                'v': event.data.cartLine.cost.totalAmount.currencyCode
            },
            "url": {
                't': 'string',
                'v': event.context.window.location.href
            },
            "value":{
                't': 'number',
                'v': event.data.cartLine.cost.totalAmount.amount
            }
        }
        if(__DL__.fb_skip_contents){
            customData.skip_contents = true;
        }
        var properties = {
            'customProperties'  : customData,
            'productProperties' : productData
        };
        _cl.trackClick('Added to cart',properties); 
        if (__DL__.debug) {
            console.log("Added to cart"+" :"+JSON.stringify(properties));
        } 
    });
    //Search made event
    analytics.subscribe("search_submitted", event => {
        var properties = {
            'customProperties' : {
                'search_string': {
                    't': 'string',
                    'v': event.data.searchResult.query
                },
                'url': {
                't': 'string',
                'v': event.context.window.location.href
                }
            }
        }
        _cl.pageview('Search made',properties);
        if (__DL__.debug) {
            console.log("Search made"+" :"+JSON.stringify(properties));
        } 
    });
    //Checkout made event
    analytics.subscribe("checkout_started", event => {
        var products = shopify_products_mapping(event.data.checkout.lineItems);
        var productData = clabs_product_mappings(products);
        var customData = {
            "currency": {
                't': 'string',
                'v': event.data.checkout.totalPrice.currencyCode
            },
            "value":{
                't': 'number',
                'v': event.data.checkout.totalPrice.amount
            }
        }
        if(__DL__.fb_skip_contents){
            customData.skip_contents = true;
        }
        var properties = {
            'customProperties'  : customData,
            'productProperties' : productData
        };
        _cl.trackClick('Checkout made',properties);
        if (__DL__.debug) {
            console.log("Checkout made"+" :"+JSON.stringify(properties));
        } 
    });
    //AddPaymentinfo event
    analytics.subscribe("payment_info_submitted", event => {
        var payment_info = {
            "subtotal":{
            't': 'number',
            'v': event.data.checkout.subtotalPrice.amount
            },
            "shipping_price":{
            't': 'number',
            'v': event.data.checkout.shippingPrice.amount
            },
            "tax": {
            't': 'string',
            'v': event.data.checkout.totalTax.amount
            },
            "value": {
            't': 'string',
            'v': event.data.checkout.totalPrice.amount
            },
            "currency": {
                't': 'string',
                'v': event.data.checkout.currencyCode
            } 
        }
        var properties = {
            "customProperties": {
              "user_traits": {
                "t": "Object",
                "v": {
                    "email": {
                        "t": "string",
                        "v": event.data.checkout.email
                    },
                    "phone": {
                        "t": "number",
                        "v": event.data.checkout.phone
                    }
                }
              },
              "identify_by_email": {
                "t":"string",
                "v": event.data.checkout.email,
                "ib": true
              }
            }
        }
        console.log("identify",properties);
        _cl.trackClick('AddPaymentInfo',{'customProperties': payment_info});
        _cl.identify(properties);
        if (__DL__.debug) {
            console.log("AddPaymentInfo"+" :"+JSON.stringify({'customProperties': payment_info}));
        } 
    });
    //Purchased event
    analytics.subscribe("checkout_completed", event => {
        var products = shopify_products_mapping(event.data.checkout.lineItems);
        var productData = clabs_product_mappings(products);
        var customData = {
            "transaction_id":{
                't': 'string',
                'v': event.data.checkout.order.id
            },
            "currency": {
                't': 'string',
                'v': event.data.checkout.totalPrice.currencyCode
            },
            "subtotal": {
                "t": "number",
                "v": event.data.checkout.subtotalPrice.amount
            },
            "tax" : {
                "t": "number",
                "v": event.data.checkout.totalTax.amount
            },
            "shipping" : {
                "t": "number",
                "v": event.data.checkout.shippingPrice.amount
            },
            "value":{
                't': 'number',
                'v': event.data.checkout.totalPrice.amount
            }
        }
        var properties = {
            'customProperties'  : customData,
            'productProperties' : productData
        };
        var propertiesToSend = {
            "customProperties": {
              "user_traits": {
                "t": "Object",
                "v": {
                    "email": {
                        "t": "string",
                        "v": event.data.checkout.email
                    },
                    "phone": {
                        "t": "number",
                        "v": event.data.checkout.phone
                    }
                }
              },
              "identify_by_email": {
                "t":"string",
                "v": event.data.checkout.email,
                "ib": true
              }
            }
        }
        console.log("identify",propertiesToSend);
        _cl.trackClick('Purchased',properties);
        _cl.identify(properties);
        if (__DL__.debug) {
            console.log("Purchased"+" :"+JSON.stringify(properties));
        } 
    });
}
//End of the customerlabs custom pixel code

