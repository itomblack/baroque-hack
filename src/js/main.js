(function () { 

var blocks = $('img');
var currentMoving = "";

// **************** SET DATA VALUE ****************//
// *********************************************//
var setData = function () {

  var nextWidth = 0;
  var objCount = 0;
  for (i = 0; i < blocks.length; i++) {


    if (objCount > 0) {
      var prevWidth = blocks[objCount-1].getBoundingClientRect().right;
      nextWidth = prevWidth + 30;
    }

    blocks[i].style.transform = 'translate(' + nextWidth + 'px, 0px)';

    var xVal = blocks[i].getBoundingClientRect().left;
    var yVal = blocks[i].getBoundingClientRect().top;

    // update the posiion attributes
    blocks[i].setAttribute('data-x', xVal);
    blocks[i].setAttribute('data-y', yVal);

    objCount = objCount + 1;
  }

}

setData();



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
  })
  .on('mousedown', function(event){

  var target = event.target,
    // keep the dragged position in the data-x/data-y attributes
    thisX = target.getBoundingClientRect().left,
    thisY = target.getBoundingClientRect().top;

    // translate the element
    translateActual(target, thisX, thisY, 10);
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
    $('#change-resize').addClass('display');
    $('#change-drag').removeClass('display');
    window.setTimeout( function() {
      $('#change-resize').removeClass('display');
    }, 1000);

  } else if 
    (currentClass.includes('resize')) {
    newClass = currentClass.replace('resize', 'drag');
    $('#change-drag').addClass('display');
    $('#change-resize').removeClass('display');
    window.setTimeout( function() {
      $('#change-drag').removeClass('display');
    }, 1000);
  }    
  event.className = newClass;
}




// **************** DRAG FUNCTION ****************//
// ***********************************************//

function dragMoveListener (event) {

  
  var target = event.target,
  currentMoving = target;
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
    nextY = (currentY + 8),
    groundTest = currentY + objectHeight - windowHeight;

      if (groundTest < 0){
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

  // console.log(thisOb.id + 'this first')

  //get this object ID & bounding edges
  var thisBlockID = thisOb.id,
  otherBlockID = "",
  thisWidth = thisOb.getBoundingClientRect().width,
  thisHeight = thisOb.getBoundingClientRect().height,
  thisX = thisOb.getBoundingClientRect().left,
  thisY = thisOb.getBoundingClientRect().top;

  //for all block objects array
  var count = 0;
  for (i = 0; i < blocks.length; i++) {
      //if not same id 
      otherBlockID = blocks[count].id

      if (thisBlockID != otherBlockID) {

        //get block bounding edges
        var blocksWidth = blocks[count].getBoundingClientRect().width,
        blocksHeight = blocks[count].getBoundingClientRect().height,
        blocksX = blocks[count].getBoundingClientRect().left,
        blocksY = blocks[count].getBoundingClientRect().top; 


        //check for collisions       

        if ( thisX < blocksX + blocksWidth && 
          thisX + thisWidth > blocksX &&
          thisY < blocksY + blocksHeight &&
          thisHeight + thisY > blocksY ) {

          // console.log(thisOb.id + 'THIS')

              //if top
              if (thisHeight + thisY > blocksY && thisY < blocksY + blocksHeight) { 
                  translateActual(currentMoving, thisX, thisY, 0);
                }

        } else {
          var test = '#' + thisBlockID;
          // console.log(test)
          // var test = $(test)
          // console.log(test)
          translateActual(thisOb, xVal, yVal, 0);
        }
      }
      count = count + 1;
  }

  

}


function translateActual(chosenOb, xVal, yVal, plusY) {
    chosenOb.style.webkitTransform =
    chosenOb.style.transform = 'translate(' + (xVal) + 'px, ' + (yVal - plusY) + 'px)';
     // update the posiion attributes
    chosenOb.setAttribute('data-x', (xVal));
    chosenOb.setAttribute('data-y', (yVal - plusY));
}


// **************** pause grav on mouseevents ******************//
// ***********************************************//

window.addEventListener("mousedown", function(){
  stopCount();
});

window.addEventListener("mouseup", function(){
  doTimer();
});


}()); // end all