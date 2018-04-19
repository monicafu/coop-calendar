const Event = require("./models/event");

const middleware = {
    isLoggedIn: (req, res, next) => {
        console.log("req : "+req);
        console.log("is user auth : "+req.isAuthenticated());
        //verify if user is logging
        if (req.isAuthenticated()) {
            return next();
        }
        // req.flash("error", "You must be signed in to do that!");
        res.status(400).send(
            JSON.stringify({'msg':'user-is-not-logging'})
        );
    },
    checkUserEvent : (req, res, next) => {
        if (req.isAuthenticated()){
            Event.findById(req.body.id, function (err, event) {
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

module.exports = middleware;