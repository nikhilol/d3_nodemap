/* eslint-disable no-useless-escape */
/* eslint-disable object-curly-spacing */
/* eslint-disable max-len */
/* eslint-disable indent */
const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const firebase = require("firebase-admin");
const { Client } = require("@notionhq/client");

firebase.initializeApp({
    apiKey: "AIzaSyCUzsoeXiMaMNekQnH-nK8pZkvcmfttVSI",
    authDomain: "nodemap-app.firebaseapp.com",
    projectId: "nodemap-app",
    storageBucket: "nodemap-app.appspot.com",
    messagingSenderId: "1066002610989",
    appId: "1:1066002610989:web:6136fbcaf16554fb4031a4",
    measurementId: "G-6NN3D93WVH",
});

const notion = new Client({ auth: "secret_qFHmY8UZ0H1RsexDyedFHicyeSZ41Q0CVYnL9qvmtGp" });

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const app = express();
app.use(cors());

app.post("/signup", async (req, res) => {
    const { Email, Username, Password } = req.query;
    try {
        await firebase.firestore().collection("Users").get().then((snap) => {
            snap.forEach((doc) => {
                console.log(doc.id.toLowerCase());
                if (doc.id.toLowerCase() === Username.toLowerCase()) {
                    throw Error("Username is already taken");
                }
            });
        });
        await firebase.auth().createUser({
            email: Email,
            password: Password,
            displayName: Username,
        });
        let data;
        await firebase.firestore().collection("Users").doc("Nodemap").collection("Plans").doc("Your first plan!").get().then((doc) => {
            data = doc.data();
            console.log(data);
        });
        await firebase.firestore().collection("Users").doc(Username).collection("Plans").doc("Your first plan!").set(data);
        res.send(200);
    } catch (e) {
        res.send(e.message);
    }
});


app.get("/plans", async (req, res) => {
    const { user } = req.query;
    await firebase.firestore().collection("Users").doc(user).collection("Plans").get().then((snapshot) => {
        if (!snapshot.empty) {
            const data = [];
            snapshot.forEach((doc) => {
                data.push(doc.id);
            });
            res.send(data);
        } else {
            res.sendStatus(404);
        }
    });
});

app.get("/plans/nodes", async (req, res) => {
    const { user, title } = req.query;
    await firebase.firestore().collection("Users").doc(user).collection("Plans").doc(title).get().then((doc) => {
        if (doc.data()) {
            res.send(doc.data());
        } else {
            res.sendStatus(404);
        }
    });
});

app.post("/plans/update", async (req, res) => {
    const { user, title } = req.query;
    if (req.body.nodes.length) {
        await firebase.firestore().collection("Users").doc(user).collection("Plans").doc(title).set({
            nodes: req.body,
        });
        res.send(200);
    } else {
        res.send(500);
    }
});

app.post("/plans/import", async (req, res) => {
    const { user, creator, plan } = req.query;

    console.log(user);
    console.log(creator);
    console.log(plan);

    let _data;
    try {
    await firebase.firestore().collection("Users").doc(creator).collection("Plans").doc(plan).get().then((doc) => {
        if (doc.data()) {
            _data = doc.data();
        } else {
            res.send("Could not find this!");
        }
    });
    await firebase.firestore().collection("Users").doc(user).collection("Plans").doc(plan).set(_data);
    await firebase.firestore().collection("Users").doc(creator).collection("Plans").doc(plan).collection("Analytics").doc("Imports").set(
        {
            Count: firebase.firestore.FieldValue.increment(1),
        }, {merge: true},
    );
    res.send(200);
    } catch (e) {
        res.send(e);
    }
});

app.post("/plans", async (req, res) => {
    const { user, title } = req.query;
    await firebase.firestore().collection("Users").doc(user).collection("Plans").doc(title).set({
        Title: title,
        TimeCreated: Date.now(),
        nodes: {
            links: [], nodes: [
                {
                    Platform: "Start",
                    id: "Start",
                    // eslint-disable-next-line quotes
                    md: `### Start ### \n # This is the start of your new plan! # \n --- `,
                    svg: "/Logos/Start.png",
                    x: 575,
                    y: 95,
                    fx: 575,
                    fy: 95,
                },
            ],
        },
    });
    res.send(200);
});

exports.api = functions.https.onRequest(app);

exports.automation = functions.auth.user().onCreate(async (user) => {
    const response = await notion.pages.create({
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
                select: {
                    name: "User",
                },
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
    console.log(response);
});

exports.creators = functions.firestore.document("Users/{userId}/Plans/{plan}/Analytics/Imports").onCreate(async (snap, context) => {
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
