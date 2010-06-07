/*
 * jQuery enter_override
 *
*/

// Set default options
$.enter_override = {
    defaults: {
	submit_after: false
    }
};

$.fn.enter_override = function(options) {

    // Combine all the options overriding any defaults we may define.
    options = $.extend($.enter_override.defaults, options);

    submit_after = options['submit_after'];

    $(this).keypress(function(e){
	if (e.which === 13) {
	    field = get_field(this);
	    
	    if (field.type === "submit" && submit_after == true)
		return true;
	    else
		e.preventDefault();
	};
    });

    $(this).keydown(function(e) {

	// Detect if an enter was hit, 
	if (e.which === 13){
	    field = get_field(this);
	    next_field = fields[field_id + 1];

	    if (field.type === "submit" && submit_after == true)
		return true;
	    
	    if (next_field != null && (next_field.type != "submit" || submit_after == true)){
		next_field.focus();
		if (next_field.type != "select-one")
		    next_field.select();
	    };
	    
	    e.preventDefault();
	    return false;
	}; // key==13
    }); // keydown

    function get_field(current){
	fields = $(":input");
	field_id = fields.index(current);
	field = fields[field_id];
	return field;
    };
}; // enter_override