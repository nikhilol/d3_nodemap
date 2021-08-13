/* eslint-disable no-useless-escape */
/* eslint-disable object-curly-spacing */
/* eslint-disable max-len */
/* eslint-disable indent */
const functions = require("firebase-functions");
const { Client } = require("@notionhq/client");
const notion = new Client({ auth: "secret_qFHmY8UZ0H1RsexDyedFHicyeSZ41Q0CVYnL9qvmtGp" });
const firebase = require("firebase-admin");

exports.accountTypeNotion = functions.firestore.document("Users/{userId}/Plans/{plan}/Analytics/Imports").onCreate(async (snap, context) => {
    await firebase.firestore().collection("Users").doc(context.params.userId).set({ type: "Creator" }, { merge: true });
    const query = await notion.databases.query({
        database_id: "72266aa573454aa3b8a4db8e55481cb1",
        filter: {
            property: "Username",
            text: {
                equals: context.params.userId,
            },
        },
    });
    notion.pages.update({
        page_id: query.results[0].id,
        properties: {
            "Account Type": {
                select: {
                    name: "Creator",
                },
            },
        },
    });
});
