(function () { 

var blocks = $('img');

// **************** DRAG DETAILS ****************//
// *********************************************//

// target elements with the "draggable" class
interact('.drag').draggable({
    // enable inertial throwing
    inertia: true,
    // keep the element within the area of it's parent
    restrict: {
      restriction: "parent",
      endOnly: true,
      elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
    },
    // call this function on every dragmove event
    onmove: dragMoveListener,
    // call this function on every dragend event
    onend: function (event) {
     //CAN ADD STUFF HERE TO DO ON END OF MOVE IF I WANT
    }
  })
  .on('doubletap', function(event) {
    switchClass(event.target);
  }); //END INTERACT(.DRAGGABLE)

// **************** RESIZE DETAILS ****************//
// ***********************************************//

interact('.resize')
  .resizable({
    edges: { left: true, right: true, bottom: true, top: true }
  })
  .on('resizemove', function (event) {
    var target = event.target,
        x = (parseFloat(target.getAttribute('data-x')) || 0),
        y = (parseFloat(target.getAttribute('data-y')) || 0);

    // update the element's style
    target.style.width  = event.rect.width + 'px';
    target.style.height = event.rect.height + 'px';

    // translate when resizing from top or left edges
    x += event.deltaRect.left;
    y += event.deltaRect.top;

    //translate element
    translateElement(target, x, y);

  })
  .on('doubletap', function(event) {
    switchClass(event.target);
  }); //END INTERACT(.resize)



// **************** SWITCH FUNCTION ****************//
// ***********************************************//

function switchClass (event) {
  var currentClass = event.className;
  if (currentClass.includes('drag')) {
    newClass = currentClass.replace('drag', 'resize');
  } else if 
    (currentClass.includes('resize')) {
    newClass = currentClass.replace('resize', 'drag');
  }    
  event.className = newClass;
}




// **************** DRAG FUNCTION ****************//
// ***********************************************//

function dragMoveListener (event) {

  var target = event.target,
    // keep the dragged position in the data-x/data-y attributes
    x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
    y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    translateElement(target, x, y);
}

// this is used later in the resizing demo
window.dragMoveListener = dragMoveListener;



// **************** GRAVITY ****************//
// ***********************************************//

var count = 0;
var t;
var timer_is_on = 0;
var windowHeight = $(window).height();

function timedCount() {

  for (i = 0; i < blocks.length; i++) {
    var x = (parseFloat(blocks[i].getAttribute('data-x')) || 0),
    currentY = parseFloat(blocks[i].getAttribute('data-y') || 0),
    objectHeight = parseFloat(blocks[i].height || 0),
    nextY = (currentY + 5),
    groundTest = currentY + objectHeight - windowHeight;

      if (groundTest <= 0){
        //call translate function
        translateElement(blocks[i], x, nextY)
      }
    }

    count = count+1;
    t = setTimeout(function(){timedCount()}, 5);
}

function doTimer() {
    if (!timer_is_on) {
        timer_is_on = 1;
        timedCount();
    }
}

function stopCount() {
    clearTimeout(t);
    timer_is_on = 0;
}

doTimer();



// **************** TRANSLATE ******************//
// ***********************************************//

function translateElement(thisOb, xVal, yVal) {

  // console.log(blocks[1].id);
  // console.log(thisOb.id + " selected");

  //get this object ID
  var thisBlockID = thisOb.id,
  otherBlockID = "";

  //for all block objects array
  for (i = 0; i < blocks.length; i++) {
      //if not same id 
      otherBlockID = blocks[i].id
      if (thisBlockID != otherBlockID) {
        //check for collisions
        console.log('test')

      }

          


  }

  thisOb.style.webkitTransform =
   thisOb.style.transform = 'translate(' + xVal + 'px, ' + yVal + 'px)';
   // update the posiion attributes
    thisOb.setAttribute('data-x', xVal);
    thisOb.setAttribute('data-y', yVal);

}




// **************** pause grav on mouseevents ******************//
// ***********************************************//

window.addEventListener("mousedown", function(){
  stopCount();
});


//PAUSED GRAVITY!!!!!
stopCount();

window.addEventListener("mouseup", function(){
  // doTimer();
});


}()); // end all