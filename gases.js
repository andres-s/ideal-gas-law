
(function() {
    var svgNS = "http://www.w3.org/2000/svg";

    window.setTimeout(function() {
        var container = document.getElementById('container');    
        var myCircle = document.createElementNS(svgNS, 'circle');
        myCircle.setAttributeNS(null,"cx",100);
        myCircle.setAttributeNS(null,"cy",100);
        myCircle.setAttributeNS(null,"r",50);
        myCircle.setAttributeNS(null,"fill","black");
        myCircle.setAttributeNS(null,"stroke","none");
        container.appendChild(myCircle);
    }, 1500);
})();