const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors");

admin.initializeApp();

const corsHandler = cors({ origin: true });

exports.getTrafficData = functions.https.onRequest((req, res) => {
    corsHandler(req, res, async () => {
        try {
            const db = admin.firestore();
            const snapshot = await db.collection("trafficStats").get();
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            res.status(200).json(data);
        } catch (error) {
            console.error("Error fetching traffic stats:", error);
            res.status(500).send("Internal Server Error");
        }
    });
});