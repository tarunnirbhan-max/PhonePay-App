
const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));
// Home route
app.get("/", (req, res) => {
    res.json({
        app: "PhonePay Security Lab",
        status: "Running",
        mode: "Educational Demo"
    });
});

// Test soundbox announcement
app.post("/api/soundbox-demo", (req, res) => {
    const { amount } = req.body;

    if (
        typeof amount !== "number" ||
        !Number.isFinite(amount) ||
        amount <= 0 ||
        amount > 100000
    ) {
        return res.status(400).json({
            success: false,
            message: "Invalid demo amount"
        });
    }

    res.json({
        success: true,
        mode: "SIMULATION ONLY",
        amount: amount,
        message: `payment announcement: Rs. ${amount} received`,
        verifiedPayment: false
    });
});

app.listen(PORT, () => {
    console.log(`Security Lab running at http://localhost:${PORT}`);
});
