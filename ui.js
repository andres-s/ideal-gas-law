
var userinterface =  (function () {
    
    var Animator = animator.Animator;

    function User(animation) {
        this._animation = new Animator();
        document.getElementById('stop-start-button')
            .addEventListener('click', 
                              this._animation.stop.bind(this._animation));
    }



    return {
        User: User
    };
})();