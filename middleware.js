const Event = require("./models/event");

const middleware = {
    isLoggedIn: (req, res, next) => {
        console.log(req.session);
        console.log('middleware');
        if (req.session.loginUser) {
          console.log('user is login' + req.session.loginUser.username);
          return next();
        }else{
          res.status(400).send(
                JSON.stringify({'msg':'user-is-not-logging'})
          );
        }
    },
    checkUserEvent : (req, res, next) => {
        if (req.session.loginUser){
          console.log('body '+req.body.event.creator.id);
            Event.findById(req.body.event._id, function (err, event) {
              console.log('creator id '+event.creator.id);
               if (event.creator.id.equals(req.session.loginUser.id)){
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