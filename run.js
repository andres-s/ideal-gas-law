(function() {

    var GasBox = gases.GasBox;
    var BoxController = controller.BoxController;

    var boxController = new BoxController(document.getElementById('box'));
    var animate = boxController.getAnimator();

    function animateWrapper(highResTimeStamp) {
        animate(highResTimeStamp);
        window.requestAnimationFrame(animateWrapper);
    }

    boxController.advance(0);

    //window.requestAnimationFrame(animateWrapper);
    
})();