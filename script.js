function showSMSNotification(type, amount, transaction) {
    if (!smsNotification || !smsMessage || !smsTime) return;

    const transactionId = transaction.id || "—";
    const recipient = transaction.recipientName || "";

    if (type === "Money Sent" || type === "QR Payment") {

        smsMessage.textContent =
            formatMoney(amount) +
            " debited from your wallet." +
            (recipient ? " Paid to: " + recipient + "." : "") +
            " Transaction ID: " +
            transactionId +
            ". Available balance: " +
            formatMoney(balance) + ".";

    } else if (type === "Money Received") {

        smsMessage.textContent =
            formatMoney(amount) +
            " credited to your wallet. Transaction ID: " +
            transactionId +
            ". Available balance: " +
            formatMoney(balance) + ".";

    } else {
        return;
    }

    smsTime.textContent = new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit"
    });

    smsNotification.hidden = false;

    clearTimeout(smsNotificationTimer);

    smsNotificationTimer = setTimeout(function () {
        smsNotification.hidden = true;
    }, 5000);
}
