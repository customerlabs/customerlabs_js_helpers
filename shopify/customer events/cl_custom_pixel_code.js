//CustomerLabs Tag - Tracking code - custom pixel code start
!function(t,e,r,c,a,n,s){t.ClAnalyticsObject=a,t[a]=t[a]||[],t[a].methods=["trackSubmit","trackClick","pageview","identify","track"],t[a].factory=function(e){return function(){var r=Array.prototype.slice.call(arguments);return r.unshift(e),t[a].push(r),t[a]}};for(var i=0;i<t[a].methods.length;i++){var o=t[a].methods[i];t[a][o]=t[a].factory(o)};n=e.createElement(r),s=e.getElementsByTagName(r)[0],n.async=1,n.crossOrigin="anonymous",n.src=c,s.parentNode.insertBefore(n,s)}(window,document,"script","//cdn.js.customerlabs.co/cl5378d2tsjsmq.js","_cl");_cl.SNIPPET_VERSION="1.0.0"

//Shopify standard events:
//@productsConversion function Converts product list to customerlabs product properties format
function productsConversion(products) {
    var productsArr = products;
    var productsData = []
    for(let i = 0 ; i < productsArr.length ; i++) {
        var productsStructure = {}
        for(var key in productsArr[i]) {
            switch(key) {
                case "name":
                case "title":
                productsStructure.product_name = {"t": "string", "v": productsArr[i][key]}
                break;
                case "id":
                productsStructure.product_id = {"t": "string", "v": productsArr[i].id}
                break;
                case "price":
                productsStructure.product_price = {"t": "number", "v": productsArr[i].price}
                break;
                case "category":
                productsStructure.product_category = {"t": "string", "v": productsArr[i].category}
                break;
                case "brand":
                productsStructure.product_brand = {"t": "string", "v": productsArr[i].brand}
                break;
                case "variant":
                productsStructure.product_variant = {"t": "string", "v": productsArr[i].variant}
                break;
                case "variantId":
                productsStructure.product_variant_id = {"t": "string", "v": productsArr[i].variantId}
                break;
                case "productType":
                productsStructure.product_type = {"t": "string", "v": productsArr[i].productType}
                break;
                case "coupon":
                productsStructure.product_coupon = {"t": "string", "v": productsArr[i].coupon}
                break;
                case "quantity":
                productsStructure.product_quantity = {"t": "string", "v": productsArr[i].quantity}
                break;
                default:
                let isnum = /^\d+$/.test(productsArr[i][key]);
                var type = ""

                if(Array.isArray(productsArr[i][key])) {
                    continue;
                } else if(typeof productsArr[i][key] === 'object' && productsArr[i][key] !== null && !Array.isArray(productsArr[i][key])) {
                    continue;
                } else if(productsArr[i][key] !== null && (Number.isFinite(productsArr[i][key]) || isnum || !isNaN(parseFloat(productsArr[i][key])))) {
                    type = "number"
                }  else {
                    type = "string"
                }
                if(key.substring(0, 8) === "product_") {
                    productsStructure[key] = {"t": type, "v": productsArr[i][key]}
                } else {
                    productsStructure["product_"+key] = {"t": type, "v": productsArr[i][key]}
                }
            }
        }
        productsData.push(productsStructure);
    }
    return productsData
}
//@productsData function Converts received event data to products list format
function productsData(event) {
   var products_list = []
   var products_length = event.data.checkout.lineItems.length;
   if(products_length > 0){
     for(var i=0;i< products_length;i++){
       var products = {
          'id'              : event.data.checkout.lineItems[i].variant.product.id,
          'sku'             : event.data.checkout.lineItems[i].variant.sku,
          'variantId'       : event.data.checkout.lineItems[i].variant.id,
          'name'            : event.data.checkout.lineItems[i].variant.product.title,
          'price'           : event.data.checkout.lineItems[i].variant.price.amount,
          'imageURL'        : event.data.checkout.lineItems[i].variant.image.src, 
          'productURL'      : event.context.window.location.href,
          'brand'           : event.data.checkout.lineItems[i].variant.product.vendor,
          'quantity'        : event.data.checkout.lineItems[i].quantity
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
            'variantId'       : event.data.productVariant.id,
            'name'            : event.data.productVariant.product.title,
            'price'           : event.data.productVariant.price.amount,
            'imageURL'        : event.data.productVariant.image.src, 
            'productURL'      : event.context.window.location.href,
            'brand'           : event.data.productVariant.product.vendor
        }]
    };
    var custom_data = {
        "currency": {
          't': 'string',
          'v': event.data.productVariant.price.currencyCode
        }
    };
    var productData = productsConversion(product.products);
    if(productData[0].product_price){
        custom_data.value = productData[0].product_price;
    }
    if(productData[0].product_productURL){
        custom_data.url = productData[0].product_productURL;
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
            'variantId'       : event.data.productVariant.id,
            'name'            : event.data.productVariant.product.title,
            'price'           : event.data.productVariant.price.amount,
            'imageURL'        : event.data.productVariant.image.src, 
            'productURL'      : event.context.window.location.href,
            'brand'           : event.data.productVariant.product.vendor
        }]
    };
    var custom_data = {
        "currency": {
          't': 'string',
          'v': event.data.productVariant.price.currencyCode
        }
    };
    var productData = productsConversion(product.products);
    if(productData[0].product_price){
        custom_data.value = productData[0].product_price;
    }
    if(productData[0].product_productURL){
        custom_data.url = productData[0].product_productURL;
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
            'variantId'       : event.data.cartLine.merchandise.id,
            'name'            : event.data.cartLine.merchandise.product.title,
            'price'           : event.data.cartLine.merchandise.price.amount,
            'imageURL'        : event.data.cartLine.merchandise.image.src, 
            'productURL'      : event.context.window.location.href,
            'brand'           : event.data.cartLine.merchandise.product.vendor,
            'quantity'        : event.data.cartLine.quantity
        }]
    };
    var productData = productsConversion(product.products);
    var custom_data = {
        "value":{
            't': 'number',
            'v': event.data.cartLine.cost.totalAmount.amount
        
        },
        "currency": {
            't': 'string',
            'v': event.data.cartLine.cost.totalAmount.currencyCode
        }
    }
    if(productData[0].product_productURL){
        custom_data.url = productData[0].product_productURL;
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
    var product = productsData(event);
    var productData = productsConversion(product);
    var custom_data = {
        "value":{
            't': 'number',
            'v': event.data.checkout.totalPrice.amount
        },
        "currency": {
            't': 'string',
            'v': event.data.checkout.totalPrice.currencyCode
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
    var product = productsData(event);
    var productData = productsConversion(product);
    var custom_data = {
        "orderId":{
            't': 'string',
            'v': event.data.checkout.order.id
        },
        "value":{
            't': 'number',
            'v': event.data.checkout.totalPrice.amount
        },
        "currency": {
            't': 'string',
            'v': event.data.checkout.totalPrice.currencyCode
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

