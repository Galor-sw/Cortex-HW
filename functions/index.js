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

exports.deleteTrafficEntry = functions.https.onRequest((req, res) => {
    corsHandler(req, res, async () => {
        if (req.method !== "DELETE") {
            return res.status(405).send("Method Not Allowed");
        }

        const id = req.query.id;

        if (!id) {
            return res.status(400).send("Missing ID parameter");
        }

        try {
            const db = admin.firestore();
            await db.collection("trafficStats").doc(id).delete();
            res.status(200).send("Entry deleted successfully");
        } catch (error) {
            console.error("Error deleting entry:", error);
            res.status(500).send("Internal Server Error");
        }
    });
});

exports.addTrafficEntry = functions.https.onRequest((req, res) => {
    corsHandler(req, res, async () => {
        if (req.method !== "POST") {
            return res.status(405).send("Method Not Allowed");
        }

        const { date, visits } = req.body;

        if (!date || typeof visits !== "number") {
            return res.status(400).send("Missing or invalid parameters");
        }

        try {
            const db = admin.firestore();
            const newEntry = {
                date,
                visits
            };
            const docRef = await db.collection("trafficStats").add(newEntry);
            res.status(200).json({ id: docRef.id, ...newEntry });
        } catch (error) {
            console.error("Error adding traffic entry:", error);
            res.status(500).send("Internal Server Error");
        }
    });
});

exports.updateTrafficEntry = functions.https.onRequest((req, res) => {
    corsHandler(req, res, async () => {
        if (req.method !== "PUT") {
            return res.status(405).send("Method Not Allowed");
        }

        const { id, date, visits } = req.body;

        if (!id || !date || typeof visits !== "number") {
            return res.status(400).send("Missing or invalid parameters");
        }

        try {
            const db = admin.firestore();
            const docRef = db.collection("trafficStats").doc(id);
            await docRef.update({ date, visits });
            res.status(200).send("Entry updated successfully");
        } catch (error) {
            console.error("Error updating entry:", error);
            res.status(500).send("Internal Server Error");
        }
    });
});