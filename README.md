# acl-sentinel
Simple and configurable ACL for Node.js with multi roles

# How to use

1. In your auth method please add to JWT token:
  - **iss**       - this is a string identifier for the version of API or rules or any else
  - **roles[]**   - this is an array with user roles, only one if it happens
  like that
  ```
                  let payload = {
                    id: userId,
                    iat: atNow,
                    exp: expire,
                    iss: 'v1',
                    userRole: ["admin", "user"]
                };
```               
Here is we save in JWT for userId access for rule version **v1** with roles **admin** or **user**.

2. In you auth middleware, please import
```
const acl = require('./acl');
const rules = require('./acl-rules');
```

and after validation JTW token? please add some like that
```
        if (!acl.isAllow(req,"v2",rules)){
            res.status(401).json({ message: 'Not authorized', status: false  });
            return;
        }
```
3. Create a acl-rules.json file, (of course you can add it as an object or import thru environment). Example:
```
{
  "v1": {
    "allowed": {
      "/user": {
        "get": {
          "roles": ["admin", "user"]
        }
      },
      "/users/:userId": {
        "put": {
          "roles": ["admin"]
        }
      },
      "*": {
        "get": {
          "roles": ["admin", "user", "guest"]
        },
        "post": {
          "roles": ["admin"]
        },
        "*": {
          "roles": ["admin"]
        }
      }
    }
  }
}

```
Where * is mean any of.

# How it works

We are trying to find rules for the route. If we have no then get a default route. 
After trying to find a rule for the method. If we have no then get a default method. 
If no rule is found then return false.

So now we try to find if any roles of user have in the rules. If we have it then returns true if not return false.
