/*
 * jQuery overdrive
 *
*/

// Set default options
$.overdrive = {
    defaults: {
	submit_after: false,
	jump: [],
	jump_key_code: 122,   // F11
	submit_key_code: 0, // F12
	arrow_nav: false
    }
};

$.fn.overdrive = function(options) {

    // Combine all the options overriding any defaults we may define.
    options = $.extend($.overdrive.defaults, options);

    submit_after = options['submit_after'];
    jump = options['jump'];
    jump_key_code = parseInt(options['jump_key_code']);
    submit_key_code = options['submit_key_code'];
    arrow_nav = options['arrow_nav'];

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
	}// key==122 (f11)

	if (e.which === submit_key_code){
	    $('form').submit();
	    e.preventDefault();
	    return false;
	};

	// Allow arrow up/down through fields in a form.
	if (arrow_nav === true){
	    // get the current field id
	    fields = $(":input");
	    field_id = fields.index(this);
	    field = fields[field_id];

	    // if arrow down
	    if (e.which === 40){
		// check that we are not at the bottom
		if (field_id <= fields.length - 2){
		    next_field = fields[field_id + 1];
		    next_field.focus();

		    if (next_field.type != "select-one")
			next_field.select();
		};
		e.preventDefault();
		return false;
	    }; //down
	    
	    // if arrow up
	    if (e.which === 38){
		// check that we are not at the bottom
		if (field_id != 1){
		    prev_field = fields[field_id - 1];
		    prev_field.focus();

		    if (prev_field.type != "select-one")
			prev_field.select();
		};
		e.preventDefault();
		return false;
	    }; // up
	}; // arrow
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
}; // overdrive