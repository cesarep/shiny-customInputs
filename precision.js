// URL input binding
// This input binding is very similar to textInputBinding from
// shiny.js.
var precisionBinding = new Shiny.InputBinding();

// An input binding must implement these methods
$.extend(precisionBinding, {
	// This returns a jQuery object with the DOM element
  find: function(scope) {
    return $(scope).find('.precision-input input');
  },
  
  // return the ID of the DOM element
  getId: function(el) {
    return el.id;
  },
  
  // Given the DOM element for the input, return the value
  getValue: function(el) {
    return  parseFloat($(el).val().replace(',', '.'));
  },
  
  // Given the DOM element for the input, set the value
  setValue: function(el, value) {
    $(el).val(String(value).replace('.', ','));
  },
  
  //implanta metodo para realizar calculo
  changeVal: function(el, opr){
  	let input = $(el)
  	let num = input.attr('data-num').split(',').map(parseFloat)
	let val = new Decimal(parseFloat(input.val().replace(',', '.')))
	let pos = val.times(Decimal.pow(10, val.dp())).toNumber()
	let newVal
	let i = num.indexOf(pos)
	if(i>=0){
		let l = num.length
		i+=opr
		newVal = val.mul(Decimal.div(num[(i+l)%l],num[i-opr]))
		if(i == -1 || i == l)
			newVal = newVal.mul(Decimal.pow(10, Math.sign(i)))
	} else{
		newVal = val.mul(Decimal.pow(10, opr))
	}
	input.val(newVal.toPrecision().replace('.', ','))
  },
  // Set up the event listeners so that interactions with the
  // input will result in data being sent to server.
  // callback is a function that queues data to be sent to
  // the server.
  subscribe: function(el, callback) {
  	var mtply = x => this.changeVal(el, x)
	
	$(el).on('keydown.precisionBinding', function(e) {
		if (e.keyCode == 38 | e.keyCode == 40) {
		  	mtply(e.keyCode == 38 ? 1 : -1)
		  	callback();
		}
	});
	
	$(el).on('wheel.precisionBinding', function(e) {
		e.preventDefault();
	  	mtply(e.originalEvent.deltaY > 1 ? -1 : 1)
	  	callback();
	});

	$(el).parent().find('span').on('click.precisionBinding', function(e) {
	  mtply(parseFloat($(this).attr('data-opr')));
	  callback();
	});
	
	$(el).on('input.precisionBinding keyup.precisionBinding', function(e){
		$(this).val(this.value.replace(/[^0-9.,]+/,'').replace('.', ','))
		callback(true);
	});
  },
  
  // Remove the event listeners
  unsubscribe: function(el) {
    $(el).off('.precisionBinding');
  },
  
  // Receive messages from the server.
  // Messages sent by updatePrecision() are received by this function.
  receiveMessage: function(el, data) {
    if (data.hasOwnProperty('value'))
      this.setValue(el, data.value);
      
    if (data.hasOwnProperty('label'))
      $(el).parents().find('label[for="' + $(el).attr('id') + '"]').text(data.label);
      
    if(data.hasOwnProperty('nums'))
    	$(el).attr('data-num', data.nums.join(','));

    $(el).trigger('input');
  },
  
  // This returns a full description of the input's state.
  // Note that some inputs may be too complex for a full description of the
  // state to be feasible.
  getState: function(el) {
    return {
      label: $(el).parent().find('label[for="' + $escape(el.id) + '"]').text(),
      value: $(el).val(),
      nums:  $(el).attr('data-nums')
    };
  },
  
  // The input rate limiting policy
  getRatePolicy: function() {
    return {
      // Can be 'debounce' or 'throttle'
      policy: 'debounce',
      delay: 250
    };
  }
});

Shiny.inputBindings.register(precisionBinding, "cesarep.precisionInput");