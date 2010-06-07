/*
 * jQuery enter_override
 *
*/

jQuery.fn.enter_override = function() {
    this.keypress(function(e){ if (e.which === 13) e.preventDefault();});
    $(this).keydown(function(e) {

	// Detect if an enter was hit, 
	if (e.which === 13){
	    fields = $(":input");
	    field_id = fields.index(this);
	    next_field = fields[field_id + 1]

	    if (next_field != null && next_field.type != "submit"){
		next_field.focus();
		if (next_field.type != "select-one")
		    next_field.select();
	    };

	    e.preventDefault();
	    return false;
	};
    });
};