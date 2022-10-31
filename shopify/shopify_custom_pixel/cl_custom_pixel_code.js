//CustomerLabs Tracking code - Custom pixel code start
var CLabs_app_id = 'cl52245rzxaetx'; //"CUSTOMERLABS APP ID"
!function(t,e,r,c,a,n,s){t.ClAnalyticsObject=a,t[a]=t[a]||[],t[a].methods=["trackSubmit","trackClick","pageview","identify","track"],t[a].factory=function(e){return function(){var r=Array.prototype.slice.call(arguments);return r.unshift(e),t[a].push(r),t[a]}};for(var i=0;i<t[a].methods.length;i++){var o=t[a].methods[i];t[a][o]=t[a].factory(o)}n=e.createElement(r),s=e.getElementsByTagName(r)[0],n.async=1,n.crossOrigin="anonymous",n.src=c,s.parentNode.insertBefore(n,s)}(window,document,"script","//cdn.js.customerlabs.co/"+CLabs_app_id+".js","_cl");_cl.SNIPPET_VERSION="1.0.0"
/**
 * Shopify standard events:
 * @function CLabs_products_mappings
 * @params products array
 * function Converts product list to customerlabs product properties format
**/
function CLabs_products_mappings(products) {
    var CLabs_product_data = [];
    for(let i = 0 ; i < products.length ; i++) {
        var CLabs_product = {}
        for(var key in products[i]) {
            switch(key) {
                case "name":
                case "title":
                    CLabs_product.product_name = {"t": "string", "v": products[i][key]}
                break;
                case "id":
                    CLabs_product.product_id = {"t": "string", "v": products[i].id}
                break;
                case "price":
                    CLabs_product.product_price = {"t": "number", "v": products[i].price}
                break;
                case "category":
                    CLabs_product.product_category = {"t": "string", "v": products[i].category}
                break;
                case "brand":
                    CLabs_product.product_brand = {"t": "string", "v": products[i].brand}
                break;
                case "variant":
                    CLabs_product.product_variant = {"t": "string", "v": products[i].variant}
                break;
                case "productType":
                    CLabs_product.product_type = {"t": "string", "v": products[i].productType}
                break;
                case "coupon":
                    CLabs_product.product_coupon = {"t": "string", "v": products[i].coupon}
                break;
                case "quantity":
                    CLabs_product.product_quantity = {"t": "string", "v": products[i].quantity}
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
                        CLabs_product[key] = {"t": type, "v": products[i][key]}
                    } else {
                        CLabs_product["product_"+key] = {"t": type, "v": products[i][key]}
                    }
            }
        }
        CLabs_product_data.push(CLabs_product);
    }
    return CLabs_product_data
}
/**
 * @function shopify_products_mapping
 * @params items array
 * function Converts product list to customerlabs product properties format
**/
function shopify_products_mapping(items) {
   var products_list = [];
   var products_length = items.length;
   if(products_length > 0){
     for(var i=0;i< products_length;i++){
       var products = {
          'id'              : items[i].variant.product.id,
          'sku'             : items[i].variant.sku,
          'name'            : items[i].variant.product.title,
          'price'           : items[i].variant.price.amount,
          'imageURL'        : items[i].variant.image.src, 
          'brand'           : items[i].variant.product.vendor,
          'quantity'        : items[i].quantity
        }
        products_list.push(products)
     }
   }
   return products_list;
}
//pageview event
analytics.subscribe("page_viewed", event => {
    var properties = {
        "customProperties": {
            "page_url":{
                "t": "string",
                "v": event.context.window.location.href
            }
        }
    };
    _cl_page_viewed = setInterval(function(){
        if(window.CLabsgbVar && window.CLabsgbVar.generalProps){
            _cl.pageview('pageview',properties);
            clearInterval(_cl_page_viewed)
        }
    }, 1000);
});
//Product viewed event
analytics.subscribe("product_viewed", event => {
    var product = {
        'products': [{
            'id'              : event.data.productVariant.product.id,
            'sku'             : event.data.productVariant.sku,
            'name'            : event.data.productVariant.product.title,
            'price'           : event.data.productVariant.price.amount,
            'imageURL'        : event.data.productVariant.image.src, 
            'brand'           : event.data.productVariant.product.vendor
        }]
    };
    var custom_data = {
        "currency": {
          't': 'string',
          'v': event.data.productVariant.price.currencyCode
        },
        "url":{
          't': 'string',
          'v': event.context.window.location.href
        }
    };
    var productData = CLabs_products_mappings(product.products);
    if(productData[0].product_price){
        custom_data.value = productData[0].product_price;
    }
    var properties = {
        'customProperties'  : custom_data,
        'productProperties' : productData
    };
    _cl_product_viewed = setInterval(function(){
        if(window.CLabsgbVar && window.CLabsgbVar.generalProps){
            _cl.trackClick('Product viewed',properties);
            clearInterval(_cl_product_viewed)
        }
    }, 1000);
});
//Product clicked event
analytics.subscribe("product_viewed", event => {
    var product = {
        'products': [{
            'id'              : event.data.productVariant.product.id,
            'sku'             : event.data.productVariant.sku,
            'name'            : event.data.productVariant.product.title,
            'price'           : event.data.productVariant.price.amount,
            'imageURL'        : event.data.productVariant.image.src, 
            'brand'           : event.data.productVariant.product.vendor
        }]
    };
    var custom_data = {
        "currency": {
          't': 'string',
          'v': event.data.productVariant.price.currencyCode
        },
        "url": {
          't': 'string',
          'v': event.context.window.location.href
        }
    };
    var productData = CLabs_products_mappings(product.products);
    if(productData[0].product_price){
        custom_data.value = productData[0].product_price;
    }
    var properties = {
        'customProperties'  : custom_data,
        'productProperties' : productData
    };
    _cl_product_clicked = setInterval(function(){
        if(window.CLabsgbVar && window.CLabsgbVar.generalProps){
            _cl.trackClick('Product clicked',properties);
            clearInterval(_cl_product_clicked)
        }
    }, 1000);
});
//Category viewed
analytics.subscribe("collection_viewed", event => {
    var properties = {
        "customProperties": {
            "page_url":{
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
    _cl_category_viewed = setInterval(function(){
        if(window.CLabsgbVar && window.CLabsgbVar.generalProps){
            _cl.pageview('Category viewed',properties);
            clearInterval(_cl_category_viewed)
        }
    }, 1000);
});
//Added to cart event
analytics.subscribe("product_added_to_cart", event => {
    var product = {
        'products': [{
            'id'              : event.data.cartLine.merchandise.product.id,
            'sku'             : event.data.cartLine.merchandise.sku,
            'name'            : event.data.cartLine.merchandise.product.title,
            'price'           : event.data.cartLine.merchandise.price.amount,
            'imageURL'        : event.data.cartLine.merchandise.image.src, 
            'brand'           : event.data.cartLine.merchandise.product.vendor,
            'quantity'        : event.data.cartLine.quantity
        }]
    };
    var productData = CLabs_products_mappings(product.products);
    var custom_data = {
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
    var properties = {
        'customProperties'  : custom_data,
        'productProperties' : productData
    };
    _cl_added_to_cart = setInterval(function(){
        if(window.CLabsgbVar && window.CLabsgbVar.generalProps){
            _cl.trackClick('Added to cart',properties);
            clearInterval(_cl_added_to_cart)
        }
    }, 1000);   
});
//Search made event
analytics.subscribe("search_submitted", event => {
    var properties = {
        customProperties : {
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
    _cl_search_made = setInterval(function(){
        if(window.CLabsgbVar && window.CLabsgbVar.generalProps){
            _cl.pageview('Search made',properties);
            clearInterval(_cl_search_made)
        }
    }, 1000);
});
//Checkout made event
analytics.subscribe("checkout_started", event => {
    var product_items = event.data.checkout.lineItems;
    var product = shopify_products_mapping(product_items);
    var productData = CLabs_products_mappings(product);
    var custom_data = {
        "currency": {
            't': 'string',
            'v': event.data.checkout.totalPrice.currencyCode
        },
        "value":{
            't': 'number',
            'v': event.data.checkout.totalPrice.amount
        }
        
    }
    var properties = {
        'customProperties'  : custom_data,
        'productProperties' : productData
    };
    _cl_checkout_made = setInterval(function(){
        if(window.CLabsgbVar && window.CLabsgbVar.generalProps){
            _cl.trackClick('Checkout made',properties);
            clearInterval(_cl_checkout_made)
        }
    }, 1000); 
});
//payment_info_submitted - AddContact and AddShippigInfo and AddPaymentinfo
analytics.subscribe("payment_info_submitted", event => {
    var contactinfo = {
        "email": {
            "t": "string",
            "v": event.data.checkout.email
        },
        "phone": {
            "t": "number",
            "v": event.data.checkout.phone
        }
    }
    var shipping_info ={
        "email":{
          't': 'string',
          'v': event.data.checkout.email
        },
        "number":{
          't': 'number',
          'v': event.data.checkout.phone
        },
        "city":{
          't': 'string',
          'v': event.data.checkout.shippingAddress.city
        },
        "country":{
          't': 'string',
          'v': event.data.checkout.shippingAddress.country
        },
        "country_code":{
          't': 'string',
          'v': event.data.checkout.shippingAddress.countryCode
        },
        "province":{
          't': 'string',
          'v': event.data.checkout.shippingAddress.province
        },
        "province_code":{
          't': 'string',
          'v': event.data.checkout.shippingAddress.provinceCode
        }
    }
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
    _cl_added_payment_info = setInterval(function(){
        if(window.CLabsgbVar && window.CLabsgbVar.generalProps){
            _cl.trackClick("AddContact", {'customProperties': contactinfo});
            _cl.trackClick("AddShippingInfo", {'customProperties': shipping_info});
            _cl.trackClick('AddPaymentInfo',{'customProperties': payment_info});
            clearInterval(_cl_added_payment_info)
        }
    }, 1000); 
});
//Purchased event
analytics.subscribe("checkout_completed", event => {
    var product_items = event.data.checkout.lineItems;
    var product = shopify_products_mapping(product_items);
    var productData = CLabs_products_mappings(product);
    var custom_data = {
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
        'customProperties'  : custom_data,
        'productProperties' : productData
    };
    _cl_purchased = setInterval(function(){
        if(window.CLabsgbVar && window.CLabsgbVar.generalProps){
            _cl.trackClick('Purchased',properties);
            clearInterval(_cl_purchased)
        }
    }, 1000); 
});
//End of the customerlabs custom pixel code

