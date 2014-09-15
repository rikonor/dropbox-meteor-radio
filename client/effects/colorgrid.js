activateEffect = function activateEffect() {
  colorgrid();
};

var colorgrid = function colorgrid() {
  var windowHeight = window.innerHeight;
  var windowWidth = window.innerWidth;

  var boxWidth = 40;
  var boxHeight = 40;

  var boxCountX = Math.round(windowWidth / boxWidth);
  var boxCountY = Math.round(windowHeight / boxHeight);

  boxWidth = Math.floor(windowWidth / boxCountX);
  boxHeight = Math.floor(windowHeight / boxCountY);

  console.log("xDim:", boxWidth, 'xCount:', boxCountX);
  console.log("yDim:", boxHeight, 'yCount:', boxCountY);
  console.log("Total count:", boxCountX * boxCountY);

  var N = boxCountX * boxCountY;
  var boxes = d3.select('.effect-container').selectAll('.box');

  var i = 0;

  var data = d3.range(N);
  var color = d3.scale.category10();
  update();

  function update(){
    i++;
    for (var j = 0; j < N; j++) {
      data[j] = Math.round(Math.random() * 10);
    }
    boxes = boxes.data(data);
    boxes.enter().append('div')
      .attr('class', 'box');
    boxes.exit().remove();
    boxes.style({
      'background-color': function(d, i) { return color(d); },
      'height': boxHeight + 'px',
      'width': boxWidth + 'px'
    });
  }
  setInterval(update, 1000);
};
