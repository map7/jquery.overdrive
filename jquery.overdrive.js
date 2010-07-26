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

// Date functions
$.auto_next_date = function(next_down_field) {
    date_fields = [".day_field",".month_field",".year_field",next_down_field];
    max = [2,2,4]

    for (var i = 0; i <= 2; i++){
	auto_next(date_fields[i],max[i],date_fields[i + 1]);    // Add auto_next to each field

	// Focus down on Enter key.
	$(date_fields[i]).keydown(function(e){
	    if (e.keyCode === 13){
		$(next_down_field).focus();
		e.preventDefault();
		return false;
	    };
	});
    };    
};

// Code to move person onto the next field
function auto_next(field, max_len, next_field){

    // Focus in we must reset the enter_date
    $(field).focusin(function(){ $enter_date = 0; });

    // Truncate input to max length if user has held down a key.
    $(field).focusout(function(){
	value = $(field).val();  
	max_len = get_max(this); 
	$(this).val(value.substr(0,max_len));
    });

    $(field).keypress(function(e) {
	length = $(field).val().length;
	max_len = get_max(this);
	code = e.which === 0? e.keyCode : e.which

	// All numbers are between 48 to 57 (including numpad)
	if (!is_number(code) && code > 31){
	    e.preventDefault(); 
	    return false;
	}
    });

    $(field).keydown(function(e){
	length = $(field).val().length;
	code = get_code(e);

	if (is_number(code)){	    
	    if (length >= get_max(this))
		$(this).select();

	}else if (code >= 32){
	    e.preventDefault();
	    return false;
	}
    });

    $(field).keyup(function(e){
	code = get_code(e);
	console.log( "jquery.overdrive.js, which: " + code + " number " + is_number(code));
	
	if (!e.ctrlKey && code != 9 && code != 13 && code != 27){ // Ignore if user hits tab.
	    if ($enter_date == 1){
		length = $(field).val().length;

		if (length >= get_max(this) && is_number(code)){
		    $(next_field).focus();
		    $(next_field).select();
		}
	    }else{
		$enter_date = 1;
	    };
	};
    });
};

function get_code(e){
    code = e.which
    if (code >= 96) code = code - 48;  // For numpad (don't do this in keypress)
    return code;
};

function get_max(field){
    if ($(field).hasClass("year_field"))
	max_len = 4;
    else
	max_len = 2;

    return max_len;
}

function is_number(code){
    if ((code >= 48 && code <= 57))
	return true;
    else
	return false;
}