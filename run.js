(function() {

    var GasBox = gases.GasBox;
    var BoxController = controller.BoxController;

    var boxController = new BoxController(document.getElementById('box'));

    function animateWrapper(highResTimeStamp) {
        boxController.advance(highResTimeStamp);
        window.requestAnimationFrame(animateWrapper);
    }

    window.requestAnimationFrame(animateWrapper);
    
})();