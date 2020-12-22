var unirest = require('unirest');
var mail = unirest("POST", "https://api.sendgrid.com/v3/mail/send");
require('dotenv').config();

module.exports = class Email {
    //create email
    createEmail(email, type, req) {
        switch (type) {
            case "comment":
        return new Promise((resolve, reject) => {
            mail.headers({
                "content-type": "application/json",
                "authorization": process.env.SENDGRID_API_KEY,
            });
            mail.type("json");
            mail.send({
                "personalizations": [
                    {
                        "to": [
                            {
                                "email": email,
                            }
                        ],
                        "dynamic_template_data": {
                            "subject": req.body.name + " commented on your post!",
                            "handle": req.session.handle,
                            "postId": req.body.postId,
                            "message": req.body.message
                        },
                    }
                ],
                "from": {
                    "email": "notifications@degreeme.io",
                    "name": "DegreeMe"
                },
                "reply_to": {
                    "email": "noreply@degreeme.io",
                    "name": "No Reply"
                },
                "template_id": "d-293c46ac8fbb4242ba5d755baa045572"
            });
            mail.end(function (resp) {
                if (resp.error) {
                    reject(resp.error)
                } else if (resp.accepted) {
                    console.log("accepted")
                    resolve(resp.accepted)
                }
            })
        })
        break;
        case "follow":
            return new Promise((resolve, reject) => {
                mail.headers({
                    "content-type": "application/json",
                    "authorization": process.env.SENDGRID_API_KEY,
                    });
                    mail.type("json");
                    mail.send({
                    "personalizations": [
                        {
                            "to": [
                                {
                                    "email": email,
                                }
                        ],
                            "dynamic_template_data": {
                                "subject": "You have a new follower!",
                                "username": req.session.handle
                        },
                            "subject": "You have a new follower!"
                        }
                    ],
                        "from": {
                            "email": "notifications@degreeme.io",
                            "name": "DegreeMe"
                    },
                        "reply_to": {
                            "email": "noreply@degreeme.io",
                            "name": "No Reply"
                    },
                        "template_id": "d-4d3bb2f9cd0747169169be2492054b3c"
                    });
                    mail.end(function (resp) {
                    if (resp.error){
                        reject(resp.error)
                    } else if (resp.accepted){
                        resolve(resp.accepted)
                    }
            })
        });
    break;
    case "VerifyAccount":
        return new Promise((resolve, reject) => {
        mail.headers({
            "content-type": "application/json",
            "authorization": process.env.SENDGRID_API_KEY,
            });
        
            mail.type("json");
            mail.send({
            "personalizations": [
                {
                    "to": [
                        {
                            "email": email,
                            name: req[2],
                        }
                ],
                    "dynamic_template_data": {
                        "subject": "Account Confirmation",
                        "name": req[1].first_name,
                        "code": req[0],
                        "email": email,
                
                },
            }
            ],
                "from": {
                    "email": "notifications@degreeme.io",
                    "name": "DegreeMe"
            },
                "reply_to": {
                    "email": "noreply@degreeme.io",
                    "name": "No Reply"
            },
                "template_id": "d-e54827ff53514c15969d2e52db32e13d"
            });
        
            mail.end(function (res) {
                if (res.error) {
                    reject(res.error)
                }
                else {
                    resolve(res.body)
                }
            });
        });
            break;
            case "invite":
                return new Promise((resolve, reject) => {
                    mail.headers({
                        "content-type": "application/json",
                        "authorization": process.env.SENDGRID_API_KEY,
                        });
                        mail.type("json");
                        mail.send({
                        "personalizations": [
                            {
                                "to": email,
                                "dynamic_template_data": {
                                    "subject": "Group Invitation",
                                    "name": req.session.name,
                                    "message": req.body.message,
                            },
                                "subject": ""
                            }
                        ],
                            "from": {
                                "email": "notifications@degreeme.io",
                                "name": "DegreeMe"
                        },
                            "reply_to": {
                                "email": "noreply@degreeme.io",
                                "name": "No Reply"
                        },
                            "template_id": "d-fd46e3eb5ad84d8e971def6cb357e350"
                        });
                        mail.end(function (result) {
                          if (result.error){
                              reject(result.error)
                              // throw new Error(res.error);
                          } else if (result.accepted) {
                              resolve(result.accepted)
                              console.log("email has sent for inviting someone to join group");
                          }
                      });
                    });
                    
                      
    }

    }


}