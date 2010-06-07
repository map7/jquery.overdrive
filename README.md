#About

Overrides the enter button to a tab key.

Based on: http://lysender.co.cc/2009/01/enter-to-tab-navigation-jquery-plugin/ and other such plugins.

#Requires

jquery 1.4.2

#Use

Add the following to your $(document).ready section
    $(":input").enter_override();

Or if you want to allow enter to submit when on top of the submit button:
    $(":input").enter_override({submit_after: true});