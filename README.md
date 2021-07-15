Step by Step guide to implement on Shopify:


Create new login for CustomerLabs app in customerlabs.com
If already have a login, create new account for different domain under the same login (suggested to create new account for different domain to ensure seamless tracking)

Follow these steps to start tracking events from Shopify server

Copy CustomerLabs Tag and paste it under header section in liquid.theme
Paste the same CustomerLabs tag under header section in checkout.liquid as well
Create new snippet and name it as “cl_default_ecommerce_events”
Copy the entire script from cl_default_ecommerce_events in github and paste it under the new snippet created.
Now, copy this include tag → {% include "cl_default_ecommerce_events" %} and paste it below CustomerLabs Tag in both liquid.theme and checkout.liquid.


To track purchase events from the browser side, make the following changes (only if required)
 Add "CustomerLabs tag(from customerlabs app) followed by a script in github (cl_default_ecommerce_events)" in settings → checkout → order processing → additional scripts.

To track add_payment_info, make following changes (only if required)
Go to CustomerLabs app
Find custom source in Source module
Create Custom Source by providing a name (Name it as Shopify hook for best practice)
You’ll be enabled with Workflow URL (Webhook)
Copy the webhook
Place it in Shopify’s Notification → Webhooks → Create new webhook
Select event as “Checkouts (checkouts/update)”
Select format as “JSON”
Select version as “Latest version”
Save the changes. 
