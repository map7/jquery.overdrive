/*
 * jQuery enter_override
 *
*/

// Set default options
$.enter_override = {
    defaults: {
	submit_after: false,
	jump: [],
	jump_key_code: 123
    }
};

$.fn.enter_override = function(options) {

    // Combine all the options overriding any defaults we may define.
    options = $.extend($.enter_override.defaults, options);

    submit_after = options['submit_after'];
    jump = options['jump'];
    jump_key_code = parseInt(options['jump_key_code']);


    $(this).keypress(function(e){
	if (e.keyCode === jump_key_code) {e.preventDefault(); return false;};
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
	}; // key==13 (enter)


	if (e.which === jump_key_code){
	    fields = $(":input");
	    field_id = fields.index(this);
	    field = fields[field_id];
	    
	    jumped = focus_jump(field_id + 1);
	    if (jumped === false) focus_jump(0);

	    e.preventDefault();
	    return false;
	}// key==123 (f12)
    }); // keydown

    function focus_jump(start){
	for (var i = start; i < fields.length; i++){
	    if(jump.indexOf(fields[i].id) > -1){
		fields[i].focus();
		return true;
	    };
	};
	return false;
    };

    function get_field(current){
	fields = $(":input");
	field_id = fields.index(current);
	field = fields[field_id];
	return field;
    };
}; // enter_override