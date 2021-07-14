/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable indent */
const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const firebase = require("firebase-admin");
const fbase = require("firebase").default;

firebase.initializeApp({
    apiKey: "AIzaSyCUzsoeXiMaMNekQnH-nK8pZkvcmfttVSI",
    authDomain: "nodemap-app.firebaseapp.com",
    projectId: "nodemap-app",
    storageBucket: "nodemap-app.appspot.com",
    messagingSenderId: "1066002610989",
    appId: "1:1066002610989:web:6136fbcaf16554fb4031a4",
    measurementId: "G-6NN3D93WVH",
  });

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const app = express();
app.use(cors());

app.get("/plans", async (req, res) => {
    const {user} = req.query;
    await firebase.firestore().collection("Users").doc(user).collection("Plans").get().then((snapshot)=>{
        if (!snapshot.empty) {
            const data = [];
            snapshot.forEach((doc)=>{
                data.push(doc.data());
            });
            res.send(data);
        } else {
            res.sendStatus(404);
        }
    });
});

app.get("/plans/nodes", async (req, res) => {
    const {user, title} = req.query;
    await firebase.firestore().collection("Users").doc(user).collection("Plans").doc(title).get().then((doc)=>{
        if (doc.data()) {
            res.send(doc.data());
        } else {
            res.sendStatus(404);
        }
    });
});

app.post("/plans/update", async (req, res)=>{
    const {user, title} = req.query;
    await firebase.firestore().collection("Users").doc(user).collection("Plans").doc(title).set({
        nodes: req.body,
    });
    res.send(200);
});

app.post("/plans", async (req, res)=>{
    const {user, title} = req.query;
    await firebase.firestore().collection("Users").doc(user).collection("Plans").doc(title).set({
        Title: title,
        TimeCreated: Date.now(),
    });
    res.send(200);
});


exports.api = functions.https.onRequest(app);
