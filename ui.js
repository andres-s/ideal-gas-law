
var userinterface =  (function () {
    
    var Animator = animator.Animator;

    function UserInterface(animation) {
        this._animation = new Animator(document.getElementById('box'));
        document.getElementById('stop-start-button')
            .addEventListener('click', 
                              this._animation.stop.bind(this._animation));
    }


    return {
        UserInterface: UserInterface
    };
})();