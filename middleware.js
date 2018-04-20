const Event = require("./models/event");

module.exports  = {
    isLoggedIn : (req, res, next) => {
        console.log("req : "+req.user);
        console.log("is user auth : "+req.isAuthenticated());
        //verify if user is logging
        if (req.isAuthenticated()) {
            return next();
        }else{
            req.flash("error", "You must be signed in to do that!");
            res.status(400).send(
                JSON.stringify({'msg':'user-is-not-logging'})
            );
        }
    },
    checkUserEvent : (req, res, next) => {
        if (req.isAuthenticated()){
            Event.findById(req.params.id, function (err, event) {
               if (event.creator.id.equals(req.user._id)){
                   next();
               }else{
                   req.flash("error", "You don't have permission to do that!");
                   res.status(400).send(
                       JSON.stringify({'msg':'find-user-event-failed'})
                   );
               }

            });
        }else{
            // req.flash("error", "You must be signed in to do that!");
            res.status(400).send(
                JSON.stringify({'msg':'user-is-not-logging'})
            );
        }
    }
};

// module.exports = middleware;