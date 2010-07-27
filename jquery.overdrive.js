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
	field_nav: false,
	field_up: 91,  // [ (up arrow is '38' but this has problems)
	field_down: 93 // ] (down arrow is '40')
    }
};

// Main Overdrive chainable function
$.fn.overdrive = function(options) {

    // Combine all the options overriding any defaults we may define.
    options = $.extend($.overdrive.defaults, options);

    submit_after = options['submit_after'];
    jump = options['jump'];
    jump_key_code = parseInt(options['jump_key_code']);
    submit_key_code = options['submit_key_code'];
    field_nav = options['field_nav'];
    field_up = options['field_up'];
    field_down = options['field_down'];

    $(this).keypress(function(e){
	if (field_nav === true){
	    // get the current field id
	    fields = $(":input");
	    field_id = fields.index(this);
	    field = fields[field_id];

	    code = e.which === 0? e.keyCode : e.which
	    
	    if (e.ctrlKey && code === field_down) move_field(1);
	    if (e.ctrlKey && code === field_up) move_field(-1);
	};

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
	    
	    if (!$(this).hasClass('day_field') && !$(this).hasClass('month_field') && !$(this).hasClass('year_field')){
		if (next_field != null && (next_field.type != "submit" || submit_after == true)){
		    next_field.focus();
		    if (next_field.type != "select-one")
			next_field.select();
		};
	    
		e.preventDefault();
		return false;
	    }; // key==13 (enter)
	};

	// Jump to fields binding
	if (e.which === jump_key_code){
	    fields = $(":input");
	    field_id = fields.index(this);
	    field = fields[field_id];
	    
	    jumped = focus_jump(field_id + 1);
	    if (jumped === false) focus_jump(0);

	    e.preventDefault();
	    return false;
	}// key==122 (f11)

	// Submit form binding
	if (e.which === submit_key_code){
	    $('form').submit();
	    e.preventDefault();
	    return false;
	};

	// Ignore nav keys on keydown.  field nav keys have to be handled through keypress.
	if (field_nav === true){
	    if (e.which === field_up || e.which === field_down){
		e.preventDefault();
		return false;
	    };
	};
    }); // keydown

    // highlight fields on focus.
    $('input,select,textarea').livequery(function(){
	$(this).focus(function(){
	    $('.highlight').removeClass('highlight');
	    $(this).addClass('highlight');
	});
    });


    // Move around the form.
    function move_field(dir){
	bottom = fields.length - 2

	if ((dir === 1 && field_id <= bottom) || (dir === -1 && field_id != 1)){
	    next_field = fields[field_id + dir];
	    next_field.focus();

	    if (next_field.type != "select-one") next_field.select();
	};
	return false;
    };

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

// Focus, highlight & select the field (default to the first field).
$.focus_input = function(field){
    if (!field)	field = "input[type=text]"
    $(field).first().focus().addClass('highlight').select();
};

// Date functions
$.auto_next_date = function(field, next_down_field) {
    date_fields = [field + "_3i", field + "_2i", field + "_1i", next_down_field];

    for (var i = 0; i <= 2; i++){
	auto_next(date_fields[i],date_fields[i + 1]);    // Add auto_next to each field

	// Focus down on Enter key.
	$(date_fields[i]).keydown(function(e){
	    if (e.keyCode === 13){
		$(next_down_field).focus();
		return false;
	    };
	});
    };    
}; // auto_next_date

// Code to move person onto the next field
function auto_next(field, next_field){
    // Focus in we must reset the focused
    $(field).focusin(function(){ $focused = false; });

    // Truncate input to max length if user has held down a key.
    $(field).focusout(function(){
	value = $(field).val();  
	$(this).val(value.substr(0,get_max(this)));
    });

    // Forbid any non-number characters
    $(field).keypress(function(e) {
	code = e.which === 0? e.keyCode : e.which
	if (!is_number(code) && code > 31) return false;
    });

    // If user enters a number and field is at max length then override with new value.
    $(field).keydown(function(e){
	if (is_number(get_code(e)) && get_len(field) >= get_max(this))
	    $(this).select();
    });

    // If key is not a special key, the field is focused, the length is >= max length and user entered
    // a number then focus and select the next field.
    $(field).keyup(function(e){
	if (!is_special(e) && $focused && get_len(field) >= get_max(this) && is_number(get_code(e)))
	    $(next_field).focus().select();
	else
	    $focused = true;
    }); 
}; // auto_next

// Check if the key is Ctrl, TAB, Enter or ESC if so return true.
function is_special(e){
    return (!e.ctrlKey || jQuery.inArray(get_code(e), [9,13,27]) == -1)? false : true;
}

// Allow for the use of the Numpad.
function get_code(e){
    return (e.which >= 96)? e.which - 48 : e.which;  
};

// Get current text length of field.
function get_len(field){
    return $(field).val().length;
};

// If current field is the year return max length = 4 otherwise it's 2.
function get_max(field){
    return ($(field).hasClass("year_field"))? 4 : 2;
};

// Work out if user entered a number by checking the ascii code.
function is_number(code){
    return (code >= 48 && code <= 57)? true : false;
}