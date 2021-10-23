/* eslint-disable no-useless-escape */
/* eslint-disable object-curly-spacing */
/* eslint-disable max-len */
/* eslint-disable indent */
const functions = require("firebase-functions");
const { Client } = require("@notionhq/client");
const notion = new Client({ auth: "secret_qFHmY8UZ0H1RsexDyedFHicyeSZ41Q0CVYnL9qvmtGp" });

exports.signup = functions.auth.user().onCreate(async (user) => {
    await notion.pages.create({
        parent: {
            type: "database_id",
            database_id: "72266aa573454aa3b8a4db8e55481cb1",
        },
        properties: {
            "Username": {
                title: [
                    {
                        text: {
                            content: user.displayName,
                        },
                    },
                ],
            },
            "Account Type": {
                "multi_select": [{
                    name: "User",
                }],
            },
            "Email": {
                email: user.email,
            },
            "Joined": {
                "date": {
                    "start": new Date().toISOString(),
                },
            },
        },
    });
});
