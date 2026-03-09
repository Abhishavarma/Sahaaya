//pure backend part, run in VS Code

const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const express = require("express");
const cors = require("cors");
const chrono = require("chrono-node");
const cron = require("node-cron");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Sahaaya backend is running");
});

app.post("/assistant", (req, res) => {

    const command = req.body.command.toLowerCase();

    // Reminder command
    if (command.includes("remind")) {

    const date = chrono.parseDate(command);

    const task = command
      .replace("remind me to", "")
      .replace(/at .*/, "")
      .trim();

    const reminder = {
        task: task,
        time: date,
        createdAt: new Date()
    };

    db.collection("reminders").add(reminder)
      .then(() => {
          res.json({
              action: "set_reminder",
              reminder: reminder,
              message: "Reminder saved successfully"
          });
      })
      .catch(err => {
          res.status(500).send(err);
      });
}

    // Emergency
    else if (command.includes("emergency") || command.includes("help")) {
        res.json({
            action: "emergency",
            message: "Triggering emergency assistance."
        });
    }

    // Services
    else if (command.includes("hospital")) {
        res.json({
            action: "find_services",
            service: "hospital",
            message: "Finding nearby hospitals."
        });
    }

    else {
        res.json({
            action: "unknown",
            message: "Sorry, I didn't understand that command."
        });
    }

});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});

cron.schedule("* * * * *", async () => {

    const now = new Date();

    const snapshot = await db.collection("reminders").get();

    snapshot.forEach(doc => {

        const reminder = doc.data();
        const reminderTime = reminder.time.toDate();

        if (Math.abs(reminderTime - now) < 60000) {
            console.log("Reminder Triggered:", reminder.task);
        }
    });

});
