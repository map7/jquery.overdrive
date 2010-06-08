#About

Overdrive is used to add special key bindings to a form for productivity purposes.

Overrides the enter button to a tab key.
Allows you to define a set of fields to jump between.  The default hotkey for jumping fields is F11.  You can use a different key by defining it's keyCode as a parameter as shown below.

Based on: http://lysender.co.cc/2009/01/enter-to-tab-navigation-jquery-plugin/ and other such plugins.

#Requires

jquery 1.4.2

#Use

Add the following to your $(document).ready section
    $(":input").overdrive();

Or if you want to allow enter to submit when on top of the submit button:
    $(":input").overdrive({submit_after: true});

Allowing a some jump fields
    $(":input").overdrive({submit_after: true, jump: ['product_name', 'product_code']});

Jump fields and setting the jump key to keyCode 122 which is F11.
    $(":input").overdrive({submit_after: true, jump: ['product_name', 'product_code'], jump_key_code: 122});


#TODO

Other features I envision being part of this plugin are:

* Ability to move between fields using up/down arrow keys

* Key combinations to allow selecting of items in a list (binding 0 -> 9 keys for row selection).  This maybe good to put into a different plugin called 'jQuery.row_select' or something.