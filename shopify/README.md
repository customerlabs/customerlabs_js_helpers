GoTo Online Store  -> click Themes -> click Actions (dropdown) -> click Edit code

Under snippets -> Add a new snippets -> name it cl_default_ecommerce_events -> copy code from git repo and past it -> click save

Under Layouts ->  Open theme.liquid -> add this code after customerlabs tracking code -> `{% include "cl_default_ecommerce_events" %}`
