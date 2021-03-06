/* eslint-disable no-useless-escape */
/* eslint-disable object-curly-spacing */
/* eslint-disable max-len */
/* eslint-disable indent */
const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const firebase = require("firebase-admin");
const { parse } = require("rss-to-json");

firebase.initializeApp({
  apiKey: "AIzaSyCUzsoeXiMaMNekQnH-nK8pZkvcmfttVSI",
  authDomain: "nodemap-app.firebaseapp.com",
  projectId: "nodemap-app",
  storageBucket: "nodemap-app.appspot.com",
  messagingSenderId: "1066002610989",
  appId: "1:1066002610989:web:6136fbcaf16554fb4031a4",
  measurementId: "G-6NN3D93WVH",
});

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
    await firebase.firestore().collection("Users").doc("Demo1").collection("Plans").doc("Your first plan!").get().then((doc) => {
        data = doc.data();
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
        },
        { merge: true });
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
        links: [],
        nodes: [
          {
            Platform: "Start",
            id: "Start",
            // eslint-disable-next-line quotes
            md: `Right click the start node to add more nodes!`,
            svg: "https://firebasestorage.googleapis.com/v0/b/nodemap-app.appspot.com/o/Nodes%2FStart.svg?alt=media&token=abc2964c-b9e2-4837-bca1-84d46025f806",
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

app.get("/nodes/custom", async (req, res)=>{
  const {user} = req.query;
  const data = [];
  await firebase.firestore().collection("Users").doc(user).collection("CustomNodes").get().then((snap)=>{
    snap.forEach((doc)=>{
      if (doc.data()) {
        data.push(doc.data());
      }
    });
  });
  res.send(data);
});

app.post("/nodes/custom", async (req, res)=>{
  const {user, title, imgUrl} = req.query;
  await firebase.firestore().collection("Users").doc(user).collection("CustomNodes").doc(title).set({
    Title: title,
    Url: imgUrl,
  }, {merge: true});
  res.send(200);
});

app.post("/privacy", async (req, res) => {
  const { user, title, password } = req.query;
  let flag = false;
  await firebase.firestore().collection("Users").doc(user).get().then((doc) => {
      if (doc.data() && doc.data().Privates) {
        doc.data().Privates.forEach((item) => {
          if (item.Title === title && item.Password === password) {
            flag = true;
          }
        });
      }
      res.send(flag);
    });
});

app.get("/privacy", async (req, res) => {
  const { user, title } = req.query;
  let flag = false;
  await firebase.firestore().collection("Users").doc(user).get().then((doc) => {
      if (doc.data() && doc.data().Privates) {
        doc.data().Privates.forEach((item) => {
          if (item.Title === title) {
            flag = true;
          }
        });
      }
      res.send(flag);
    });
});

app.get("/blogPosts", async (req, res) => {
  const result = await parse("https://medium.com/feed/@nodemap");
  res.send(JSON.stringify(result, null, 3));
});

exports.api = functions.https.onRequest(app);
