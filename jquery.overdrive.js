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