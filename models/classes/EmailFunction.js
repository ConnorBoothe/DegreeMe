var unirest = require('unirest');
var mail = unirest("POST", "https://api.sendgrid.com/v3/mail/send");
require('dotenv').config();

module.exports = class Email {
    //create email
    createCommentEmail(email, type, req) {
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
    }
    }
}