module.exports.isAllow = function (req,iss,rules) {
        try {
            // Is are iss valid and have a rules for him. Else unauthorized.
            if (req.user.iss !==iss || !rules[iss]){return false}

            // If have no direct route rule then use "*" route
            const route = (rules[iss].allowed[req.route.path]) ? req.route.path : "*";

            // If direct route have no method then use "*" method
            const method = (rules[iss].allowed[route][req.method.toLowerCase()]) ? req.method.toLowerCase() : "*";

            // if have no role for route and method then use "*" both
            const rule = (rules[iss].allowed[route][method]) ? (rules[iss].allowed[route][method]): (rules[iss].allowed["*"]["*"]);

            // if have no role for * route and * method then unauthorized
            if (!rule){return false}

            // Return true if in rule have one of role user
            return req.user.userRole.some(role => rule.roles.includes(role));
        } catch (e) {
            console.log(e.message);
            return false;
        }
    };
