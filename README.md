#About

Overdrive is used to add special key bindings to a form for productivity purposes.

Overrides the enter button to a tab key.
Allows you to define a set of fields to jump between.  The default hotkey for jumping fields is F11.  You can use a different key by defining it's keyCode as a parameter as shown below.

Based on: http://lysender.co.cc/2009/01/enter-to-tab-navigation-jquery-plugin/ and other such plugins.

Tested using Firefox 3.6.

#Requires

jquery 1.4.2
jquery.livequery

#Submodules

You can use the exact version of livequery by use of submodules.

$ git submodules update --init jquery.livequery

#Use

Add the following to your $(document).ready section
    $(":input").overdrive();

Or if you want to allow enter to submit when on top of the submit button:
    $(":input").overdrive({submit_after: true});

Allowing a some jump fields
    $(":input").overdrive({submit_after: true, jump: ['product_name', 'product_code']});

Jump fields and setting the jump key to keyCode 122 which is F11.
    $(":input").overdrive({submit_after: true, jump: ['product_name', 'product_code'], jump_key_code: 122});

Allow F12 to submit the form.    
    $(":input").overdrive({submit_key_code: 123});

Allow moving around fields with the characters Ctrl+[ for up and Ctrl+] for down.  The user can also define their own.  I have had trouble using the up & down arrow as some browsers bring up a list on text fields.  Note: all field_nav keys must use the ctrl button.  So you could use some of the alpha characters and they will not be entered into fields.
    $(":input").overdrive({field_nav: true });

Example of field_nav overriding the default keybindings to '-' & '=' for up & down respectively.
    $(":input").overdrive({field_nav: true, field_up: 45, field_down: 61 });
    
#TODO

Other features I envision being part of this plugin are:

* Key combinations to allow selecting of items in a list (binding 0 -> 9 keys for row selection).  This maybe good to put into a different plugin called 'jQuery.row_select' or something.