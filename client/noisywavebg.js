Template.noisywavebg.rendered = function() {
	var width               = window.innerWidth;
	var height              = window.innerHeight;
	var equilateralAltitude = Math.sqrt(3.0) / 2.0;
	var triangleScale       = 70;
	var patch_width         = width * 1.5;
	var patch_height        = height * 1.5;

	console.log("reached");

	// Create patch of triangles that spans the view
	shape = seen.Shapes.patch(
	  patch_width / triangleScale / equilateralAltitude,
	  patch_height / triangleScale
	)
	.scale(triangleScale)
	.translate(-patch_width/2, -patch_height/2 + 80)
	.rotx(-0.3);
	seen.Colors.randomSurfaces2(shape);

	// Create scene and render context
	scene = new seen.Scene({
	  model    : seen.Models.default().add(shape),
	  viewport : seen.Viewports.center(width, height)
	});
	context = seen.Context('seen-canvas', scene).render();

	// Apply animated 3D simplex noise to patch vertices
	var t = 0;
	var noiser = new Simplex3D(shape);

	context.animate().onBefore(function(t) {
	    for (var key in shape.surfaces) {
			var surf = shape.surfaces[key];
			for (var pkey in surf.points) {
				var p = surf.points[pkey];
				p.z = 4*noiser.noise(p.x/8, p.y/8, t*1e-4);
				// Since we're modifying the point directly, we need to mark the surface dirty
				// to make sure the cache doesn't ignore the change
				surf.dirty = true;
			}
	    }
	}).start();

	var canvas = document.getElementById('seen-canvas');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
};