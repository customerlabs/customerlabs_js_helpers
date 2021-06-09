GoTo Online Store  -> click Themes -> click Actions (dropdown) -> click Edit code

Under snippets section -> Add a new snippets -> name it cl_default_ecommerce_events -> copy code from git repo and past it -> click save

Under Layouts section ->  Open theme.liquid -> add this code after customerlabs tracking code -> `{% include "cl_default_ecommerce_events" %}`


If you are a  shopify plus account holder 

Under Layouts -> Open checkout.liquid -> add this code after customerlabs tracking code -> `{% include "cl_default_ecommerce_events" %}`

