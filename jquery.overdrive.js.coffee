# jQuery overdrive
#
# Data entry form keyboard shortcuts and general enhancements
#


# Map plugin to $/jQuery so it cannot be overwritten
(($) ->

  defaults =
    submit_after: false
    jump: []
    jump_key_code: 122   # F11
    enter_exclude: []
    submit_key_code: 123 # F12
    field_nav: false
    field_up: 38   # Ctrl+UP
    field_down: 40 # Ctrl+DOWN

  # Main overdrive chainable function
  $.fn.overdrive = (options) ->
    settings = $.extend(defaults, options) # combine all options with defaults

    submit_after = settings['submit_after']
    jump = settings['jump']
    jump_key_code = settings['jump_key_code']
    enter_exclude = settings['enter_exclude']
    submit_key_code = settings['submit_key_code']
    field_nav = settings['field_nav']
    field_up = settings['field_up']
    field_down = settings['field_down']

    methods =
      # Move field in a direction
      move_field: (field,dir) ->
        field_id = get_field_id(field)
        if (dir is 1 and field_id <= get_bottom()) or (dir is -1 and field_id isnt 0)
          next_field = get_fields()[field_id + dir]
          next_field.focus()

    # Allow running publicly accessable mtehods
    $.fn.overdrive = (method) ->
      if methods[method]
        methods[method].apply this, Array::slice.call(arguments, 1)
      else if typeof method is "object" or not method
        methods.init.apply this, arguments
      else
        $.error "Method \"" + method + "\" does not exist in myPlugin plugin!"

    # Add/Remove highlighting on focused field
    $(":input").focus( -> $(this).addClass('highlight'); $(this).select())
    $(":input").blur( ->  $(this).removeClass('highlight'))

    # Get all fields except hidden
    get_fields = ->
      $("input:not([type=hidden]),textarea").not($("[style*=none]>input")).not $("input.hidden_submit")

    # Get field id
    get_field_id = (field) ->
      field_id = get_fields().index(field)

    # Get single field from fields array
    get_field = (field) ->
      id = get_fields().index(field)
      get_fields()[id]

    # Get the last field
    get_bottom = ->
      get_fields().length - 2

    # Get code given the event
    code = (e) ->
      if e.which is 0 then e.keyCode else e.which

    # Stop all processes
    stop = (e) ->
      e.preventDefault()
      false

    # Move field in a direction
    enter_key_move_field = (field) ->
      field_id = get_field_id(field)

      # Go through each field and the first which is not in the exclude array focus it.
      while field_id < get_fields().length
        next_field = get_fields()[field_id + 1]

        if enter_exclude.indexOf(next_field.id) is -1
          next_field.focus()
          return true
        field_id++

    # Jump field
    focus_jump = (i) ->
      while i < get_fields().length
        if jump.indexOf(get_fields()[i].id) > -1
          get_fields()[i].focus()
          return true
        i++
      false

    $(this).keypress (e) ->
      if field_nav is true
        $.fn.overdrive('move_field',this,1) if e.ctrlKey && code(e) is field_down
        $.fn.overdrive('move_field',this,-1) if e.ctrlKey && code(e) is field_up

      stop(e) if e.keyCode is jump_key_code # Ignore F11 key for keypress

    $(this).keydown (e) ->
      if e.which is 13
        if get_field(this).type is "submit" && submit_after is true
          true
        else
          enter_key_move_field(this)
          stop(e)

      if e.which is jump_key_code
        jumped = focus_jump(get_field_id(this) + 1)
        focus_jump(0) if jumped is false # We've reached the bottom, so reset.

      if e.which is submit_key_code
        $('form').submit()
        stop(e)

) jQuery
