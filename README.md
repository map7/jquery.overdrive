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

    $ git submodule update --init jquery.livequery

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

Highlight on focus

If you would like to Highlight your fields on focus then just add a 'highlight' style to your CSS file.
EG:
  .highlight { background-color: yellow; }




#Date plugin

If you are using the date plugin:
http://github.com/adzap/date_time_text_field_helpers.git

Then you can take advantage of the automatic next functions and keybindings I have created for this plugin.

Add the following to your $(document).ready or live area:
$.auto_next_date("<field name directly after your date field>");

Note: Currently only works for one date field in your form.

#TODO

Get date plugin shortcuts working when you have two date fields in a form.