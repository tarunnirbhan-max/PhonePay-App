
// SAVED WALLET DATA

const oldBalanceKey = "phonepe" + "DemoBalance";
const oldTransactionsKey = "phonepe" + "DemoTransactions";

let savedBalance = localStorage.getItem("phonepeBalance");

if (savedBalance === null) {
    savedBalance = localStorage.getItem(oldBalanceKey);
}

let balance = savedBalance !== null &&
    Number.isFinite(Number(savedBalance)) &&
    Number(savedBalance) >= 0
    ? Number(savedBalance)
    : 25000;

let transactions = [];

try {
    let savedTransactions = localStorage.getItem("phonepeTransactions");

    if (savedTransactions === null) {
        savedTransactions = localStorage.getItem(oldTransactionsKey);
    }

    const parsedTransactions = JSON.parse(savedTransactions || "[]");

    if (Array.isArray(parsedTransactions)) {
        transactions = parsedTransactions;
    }
} catch (error) {
    transactions = [];
}

// ELEMENTS

const balanceDisplay = document.getElementById("balance-display");

const homeScreen = document.getElementById("home-screen");
const historyScreen = document.getElementById("history-screen");
const qrScreen = document.getElementById("qr-screen");
const profileScreen = document.getElementById("profile-screen");
const scannerScreen = document.getElementById("scanner-screen");

const transactionList = document.getElementById("transaction-list");
const recentTransactions = document.getElementById("recent-transactions");

const navHome = document.getElementById("nav-home");
const navHistory = document.getElementById("nav-history");
const navScan = document.getElementById("nav-scan");
const navQR = document.getElementById("nav-qr");
const navProfile = document.getElementById("nav-profile");

const screens = [
    homeScreen,
    historyScreen,
    qrScreen,
    profileScreen,
    scannerScreen
];

// MONEY FORMAT

function formatMoney(amount) {
    return "₹" + amount.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function updateBalance() {
    if (balanceDisplay) {
        balanceDisplay.textContent = formatMoney(balance);
    }

    localStorage.setItem("phonepeBalance", String(balance));

    localStorage.setItem(
        "phonepeTransactions",
        JSON.stringify(transactions)
    );
}
// BANK BALANCE CHECK FLOW

const bankBalanceModal = document.getElementById("bank-balance-modal");
const checkBankBalanceButton = document.getElementById("check-bank-balance");
const closeBankModalButton = document.getElementById("close-bank-modal");

const selectBankAccountButton = document.getElementById("select-bank-account");
const continueBankBalanceButton = document.getElementById("continue-bank-balance");

const bankAccountStep = document.getElementById("bank-account-step");
const bankPasscodeStep = document.getElementById("bank-passcode-step");
const bankBalanceResult = document.getElementById("bank-balance-result");

const bankPasscodeInput = document.getElementById("bank-passcode");
const bankPasscodeError = document.getElementById("bank-passcode-error");
const verifyBankPasscodeButton = document.getElementById("verify-bank-passcode");

const bankBalanceAmount = document.getElementById("bank-balance-amount");
const doneBankBalanceButton = document.getElementById("done-bank-balance");

let bankAccountSelected = false;

// OPEN BANK BALANCE
checkBankBalanceButton.addEventListener("click", function () {
    bankBalanceModal.hidden = false;

    bankAccountStep.hidden = false;
    bankPasscodeStep.hidden = true;
    bankBalanceResult.hidden = true;

    bankAccountSelected = false;
    continueBankBalanceButton.disabled = true;

    selectBankAccountButton.querySelector(".bank-radio").textContent = "◯";
});

// SELECT BANK ACCOUNT
selectBankAccountButton.addEventListener("click", function () {
    bankAccountSelected = true;

    selectBankAccountButton.querySelector(".bank-radio").textContent = "●";
    continueBankBalanceButton.disabled = false;
});

// CONTINUE TO PASSCODE
continueBankBalanceButton.addEventListener("click", function () {
    if (!bankAccountSelected) return;

    bankAccountStep.hidden = true;
    bankPasscodeStep.hidden = false;

    bankPasscodeInput.value = "";
    bankPasscodeError.textContent = "";

    bankPasscodeInput.focus();
});

// ALLOW ONLY FOUR DIGITS
bankPasscodeInput.addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "").slice(0, 4);
    bankPasscodeError.textContent = "";
});

// VERIFY LOCAL PASSCODE
verifyBankPasscodeButton.addEventListener("click", function () {
    const passcode = bankPasscodeInput.value;

    if (!/^\d{4}$/.test(passcode)) {
        bankPasscodeError.textContent = "Please enter a 4-digit passcode.";
        return;
    }

    bankPasscodeStep.hidden = true;
    bankBalanceResult.hidden = false;

    bankBalanceAmount.textContent = formatMoney(balance);

    bankPasscodeInput.value = "";
});

// CLOSE MODAL
closeBankModalButton.addEventListener("click", function () {
    bankBalanceModal.hidden = true;
});

// DONE BUTTON
doneBankBalanceButton.addEventListener("click", function () {
    bankBalanceModal.hidden = true;
});
// NAVIGATION

function setActiveNav(button) {
    [navHome, navHistory, navScan, navQR, navProfile].forEach(function (item) {
        item.classList.remove("active");
    });

    button.classList.add("active");
}

function showScreen(screen, activeButton) {
    screens.forEach(function (item) {
        if (item) {
            item.hidden = true;
        }
    });

    if (!screen) {
        console.error("Requested screen was not found.");
        return;
    }

    screen.hidden = false;
    setActiveNav(activeButton);
}

function showHome() {
    showScreen(homeScreen, navHome);
}

function showHistory() {
    renderHistory();
    showScreen(historyScreen, navHistory);
}

function showQR() {
    showScreen(qrScreen, navQR);
}

function showProfile() {
    showScreen(profileScreen, navProfile);
}

// TRANSACTION ROW

function createTransactionRow(item) {
    const row = document.createElement("div");
    row.className = "transaction-item";
    row.style.cursor = "pointer";

    const details = document.createElement("div");
    details.className = "transaction-details";

    const name = document.createElement("strong");
    name.textContent = item.type;

    const date = document.createElement("small");
    date.textContent = item.date;

    details.append(name, date);

    const amount = document.createElement("span");
    amount.className = "transaction-amount";

    if (item.direction === "debit") {
        amount.classList.add("sent");
        amount.textContent = "− " + formatMoney(item.amount);
    } else {
        amount.classList.add("received");
        amount.textContent = "+ " + formatMoney(item.amount);
    }

    row.append(details, amount);

    row.addEventListener("click", function () {
        console.log("Transaction clicked:", item);
        showTransactionDetails(item);
    });

    return row;
}
// TRANSACTION DETAILS

function showTransactionDetails(item) {
    document.getElementById("detail-amount").textContent =
        formatMoney(item.amount);

    document.getElementById("detail-type").textContent =
        item.type;

    document.getElementById("detail-id").textContent =
        item.id || "Not available";

    document.getElementById("detail-utr").textContent =
        item.utr || "Not available";

    document.getElementById("detail-date").textContent =
        item.date;

    document.getElementById("detail-status").textContent =
        item.status || "Completed";

    document.getElementById("transaction-details-modal").hidden = false;
}

// CLOSE TRANSACTION DETAILS

document.getElementById("close-transaction-details")
    .addEventListener("click", function () {
        document.getElementById("transaction-details-modal").hidden = true;
    });

// HISTORY WITH SEARCH AND FILTER

function renderHistory(searchTerm = "") {
    transactionList.replaceChildren();

    const filterValue = document.getElementById("transaction-filter").value;

    const filteredTransactions = transactions
        .slice()
        .reverse()
        .filter(function (item) {
            const searchText = searchTerm.toLowerCase();

            const matchesSearch =
                item.type.toLowerCase().includes(searchText) ||
                String(item.amount).includes(searchText) ||
                item.date.toLowerCase().includes(searchText);

            const matchesFilter =
                filterValue === "all" ||
                item.direction === filterValue;

            return matchesSearch && matchesFilter;
        });

    if (filteredTransactions.length === 0) {
        const empty = document.createElement("div");
        empty.className = "empty-state";
        empty.textContent = "No matching transactions found.";

        transactionList.appendChild(empty);
        return;
    }

    filteredTransactions.forEach(function (item) {
        transactionList.appendChild(createTransactionRow(item));
    });
}

// SEARCH INPUT

document.getElementById("transaction-filter")
    .addEventListener("change", function () {
        renderHistory(
            document.getElementById("transaction-search").value.trim()
        );
    });

// RECENT ACTIVITY

function renderRecentTransactions() {
    recentTransactions.replaceChildren();

    if (transactions.length === 0) {
        const empty = document.createElement("div");
        empty.className = "empty-state";

        const symbol = document.createElement("span");
        symbol.textContent = "↻";

        const message = document.createElement("p");
        message.textContent = "No recent activity";

        empty.append(symbol, message);
        recentTransactions.appendChild(empty);
        return;
    }

    transactions.slice(-3).reverse().forEach(function (item) {
        recentTransactions.appendChild(createTransactionRow(item));
    });
}
// GENERATE SIMULATED TRANSACTION REFERENCES

function generateTransactionId() {
    let digits = "";

    for (let i = 0; i < 24; i++) {
        digits += Math.floor(Math.random() * 10);
    }

    return "T" + digits;
}

function generateUTR() {
    let digits = "";

    for (let i = 0; i < 12; i++) {
        digits += Math.floor(Math.random() * 10);
    }

    return digits;
}
// SMS STYLE NOTIFICATION

const smsNotification = document.getElementById("sms-notification");
const smsMessage = document.getElementById("sms-message");
const smsTime = document.getElementById("sms-time");

let smsNotificationTimer;

function showSMSNotification(type, amount, transaction) {
    if (!smsNotification || !smsMessage || !smsTime) return;

    const transactionId = transaction.id || "—";

    if (type === "Money Sent") {
        smsMessage.textContent =
            formatMoney(amount) +
            " debited from your wallet. Transaction ID: " +
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
// ADD TRANSACTION

function addTransaction(type, amount, direction, recipientName = "") {
    const transactionId = generateTransactionId();
    const utrNumber = generateUTR();

    transactions.push({
        id: transactionId,
        utr: utrNumber,
        type: type,
        recipientName: recipientName,
        amount: amount,
        direction: direction || (type === "Money Sent" ? "debit" : "credit"),
        date: new Date().toISOString(),
        status: "Simulated"
    });

    updateBalance();
    renderRecentTransactions();

    const latestTransaction = transactions[transactions.length - 1];

    showSMSNotification(type, amount, latestTransaction);

    showReceipt(type, amount, latestTransaction);
}

// VALIDATE AMOUNT

function getValidAmount(value) {
    if (value === null || value.trim() === "") {
        return null;
    }

    const amount = Number(value);

    if (!Number.isFinite(amount) || amount <= 0) {
        alert("Please enter a valid amount.");
        return null;
    }

    const roundedAmount = Math.round(amount * 100) / 100;

    if (!Number.isFinite(roundedAmount) || roundedAmount <= 0) {
        alert("Please enter a valid amount.");
        return null;
    }

    return roundedAmount;
}

// PAYMENT SOUNDBOX

function announcePayment(amount) {
    if (!("speechSynthesis" in window)) {
        console.error("Voice is not supported by this browser.");
        return;
    }

    window.speechSynthesis.cancel();

    const message = new SpeechSynthesisUtterance(
        "Payment received. " + amount + " rupees."
    );

    message.lang = "en-IN";
    message.rate = 0.9;
    message.pitch = 1;
    message.volume = 1;

    window.speechSynthesis.speak(message);
}

// PAYMENT SENT SOUNDBOX

function announceSentPayment(amount) {
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    const message = new SpeechSynthesisUtterance(
        "Payment of " + amount + " rupees sent successfully."
    );

    message.lang = "en-IN";
    message.rate = 0.9;
    message.volume = 1;

    window.speechSynthesis.speak(message);
}
// SEND AND RECEIVE MONEY - CUSTOM POPUP

const paymentPopup = document.getElementById("payment-popup");
const paymentAmountInput = document.getElementById("payment-amount-input");
const paymentPopupMessage = document.getElementById("payment-popup-message");

let paymentMode = "send";

document.getElementById("send-money").addEventListener("click", function () {
    paymentMode = "send";
    paymentPopup.querySelector("h3").textContent = "Send Money";
    document.getElementById("payment-popup-confirm").textContent = "Pay";

    paymentAmountInput.value = "";
    paymentPopupMessage.textContent = "";
    paymentPopup.hidden = false;
    paymentAmountInput.focus();
});

document.getElementById("receive-money").addEventListener("click", function () {
    paymentMode = "receive";
    paymentPopup.querySelector("h3").textContent = "Receive Money";
    document.getElementById("payment-popup-confirm").textContent = "Receive";

    paymentAmountInput.value = "";
    paymentPopupMessage.textContent = "";
    paymentPopup.hidden = false;
    paymentAmountInput.focus();
});

document.getElementById("payment-popup-cancel").addEventListener("click", function () {
    paymentPopup.hidden = true;
});

document.getElementById("payment-popup-confirm").addEventListener("click", function () {

    const enteredAmount = paymentAmountInput.value.trim();
    const amount = Number(enteredAmount);

    if (enteredAmount === "" || !Number.isFinite(amount) || amount <= 0) {
        paymentPopupMessage.textContent = "Please enter a valid amount.";
        return;
    }

    const roundedAmount = Math.round(amount * 100) / 100;

    if (paymentMode === "send" && roundedAmount > balance) {
        paymentPopupMessage.textContent = "Insufficient balance.";
        return;
    }

    if (paymentMode === "send") {
        balance = Math.round((balance - roundedAmount) * 100) / 100;
        paymentPopup.hidden = true;
        addTransaction("Money Sent", roundedAmount, "debit");
        announceSentPayment(roundedAmount);
    } else {
        balance = Math.round((balance + roundedAmount) * 100) / 100;
        paymentPopup.hidden = true;
        addTransaction("Money Received", roundedAmount, "credit");
        announcePayment(roundedAmount);
    }
});

// WALLET ID

const WALLET_ID = "tarun@phonepe";

// GENERATE QR CODE

function generateQRPattern() {
    const qr = document.getElementById("qr-code");

    if (!qr) {
        console.error("QR code container not found.");
        return;
    }

    qr.replaceChildren();

    if (typeof QRCode === "undefined") {
        qr.textContent = "QR library could not load. Please check internet.";
        return;
    }

    new QRCode(qr, {
        text: WALLET_ID,
        width: 210,
        height: 210,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });
}

// COPY WALLET ID

document.getElementById("share-qr").addEventListener("click", async function () {
    try {
        await navigator.clipboard.writeText(WALLET_ID);
        alert("Wallet ID copied: " + WALLET_ID);
    } catch (error) {
        prompt("Copy your Wallet ID:", WALLET_ID);
    }
});

// QUICK ACTIONS

document.getElementById("open-history").addEventListener("click", showHistory);
document.getElementById("open-qr").addEventListener("click", showQR);
document.getElementById("view-all").addEventListener("click", showHistory);
document.getElementById("back-qr").addEventListener("click", showHome);

// QR IMAGE SCANNER

let isProcessingQR = false;

async function openQRScanner() {
    showScreen(scannerScreen, navScan);

    const reader = document.getElementById("qr-reader");
    const result = document.getElementById("scan-result");

    if (!reader || !result) return;

    reader.replaceChildren();
    result.textContent = "";

    const uploadLabel = document.createElement("label");
    uploadLabel.textContent = "Choose QR Image";
    uploadLabel.className = "primary-button";
    uploadLabel.style.display = "block";
    uploadLabel.style.textAlign = "center";
    uploadLabel.style.cursor = "pointer";
    uploadLabel.style.marginTop = "15px";

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.style.display = "none";

    uploadLabel.appendChild(fileInput);
    reader.appendChild(uploadLabel);

    fileInput.addEventListener("change", async function () {
        const file = fileInput.files[0];
        if (!file) return;

        result.textContent = "Scanning QR image...";

        let bitmap = null;

        try {
            bitmap = await createImageBitmap(file);

            let decodedText = null;

            // NATIVE QR SCANNER
            if ("BarcodeDetector" in window) {
                try {
                    const detector = new BarcodeDetector({
                        formats: ["qr_code"]
                    });

                    const detectedCodes = await detector.detect(bitmap);

                    if (detectedCodes.length > 0) {
                        decodedText = detectedCodes[0].rawValue;
                    }
                } catch (error) {
                    console.log("Native scanner unavailable:", error);
                }
            }

            // JSQR FALLBACK
            if (!decodedText && typeof jsQR !== "undefined") {

                const maxDimension = 2400;

                const scale = Math.min(
                    1,
                    maxDimension / Math.max(bitmap.width, bitmap.height)
                );

                const imageWidth = Math.round(bitmap.width * scale);
                const imageHeight = Math.round(bitmap.height * scale);

                const rotations = [0, 90, 180, 270];

                const canvas = document.createElement("canvas");

                const context = canvas.getContext("2d", {
                    willReadFrequently: true
                });

                if (!context) {
                    throw new Error("Canvas is not supported.");
                }

                for (const angle of rotations) {

                    if (angle === 90 || angle === 270) {
                        canvas.width = imageHeight;
                        canvas.height = imageWidth;
                    } else {
                        canvas.width = imageWidth;
                        canvas.height = imageHeight;
                    }

                    context.setTransform(1, 0, 0, 1, 0, 0);

                    context.clearRect(
                        0, 0,
                        canvas.width,
                        canvas.height
                    );

                    context.save();

                    if (angle === 90) {
                        context.translate(canvas.width, 0);
                        context.rotate(Math.PI / 2);
                    } else if (angle === 180) {
                        context.translate(canvas.width, canvas.height);
                        context.rotate(Math.PI);
                    } else if (angle === 270) {
                        context.translate(0, canvas.height);
                        context.rotate(-Math.PI / 2);
                    }

                    context.drawImage(
                        bitmap,
                        0, 0,
                        imageWidth,
                        imageHeight
                    );

                    context.restore();

                    const imageData = context.getImageData(
                        0, 0,
                        canvas.width,
                        canvas.height
                    );

                    const code = jsQR(
                        imageData.data,
                        imageData.width,
                        imageData.height,
                        {
                            inversionAttempts: "attemptBoth"
                        }
                    );

                    if (code && code.data) {
                        decodedText = code.data;
                        break;
                    }
                }
            }

            if (!decodedText) {
                result.textContent =
                    "QR not detected. Please try another image.";
                return;
            }

            result.textContent = "QR scanned successfully!";

            await handleQRScan(decodedText);

        } catch (error) {
            console.error("QR scanning error:", error);

            result.textContent =
                "Unable to read this image. Try another image.";

        } finally {
            if (bitmap) {
                bitmap.close();
            }
        }
    });
}
// PROCESS SCANNED UPI QR

async function handleQRScan(decodedText) {
    if (isProcessingQR) return;

    isProcessingQR = true;

    try {
        const qrText = String(decodedText || "").trim();

        let qrURL;

        try {
            qrURL = new URL(qrText);
        } catch (error) {
            alert("Invalid QR Code. Unable to read payment details.");
            return;
        }

        if (
            qrURL.protocol.toLowerCase() !== "upi:" ||
            qrURL.hostname.toLowerCase() !== "pay"
        ) {
            alert("This QR code is not a supported UPI payment QR.");
            return;
        }

        const params = new URLSearchParams(qrURL.search);

        function getUPIParam(key) {
            for (const [param, value] of params.entries()) {
                if (param.toLowerCase() === key.toLowerCase()) {
                    return value.trim();
                }
            }
            return "";
        }

        const upiId = getUPIParam("pa");
        const name = getUPIParam("pn") || upiId;

        if (!upiId || !upiId.includes("@")) {
            alert("Valid UPI ID not found in this QR.");
            return;
        }

        document.getElementById("scanned-name").textContent = name;
        document.getElementById("scanned-upi").textContent = upiId;
        document.getElementById("scanned-recipient").hidden = false;

        const enteredAmount = prompt(
            "Pay to: " + name +
            "\nUPI ID: " + upiId +
            "\n\nEnter amount:"
        );

        if (enteredAmount === null) return;

        const amount = getValidAmount(enteredAmount);

        if (amount === null) return;

        if (amount > balance) {
            alert("Insufficient virtual balance.");
            return;
        }

        balance = Math.round((balance - amount) * 100) / 100;

        addTransaction("QR Payment", amount, "debit", name);
        announceSentPayment(amount);

        alert(
            "Transaction completed!\n" +
            "Recipient: " + name +
            "\nUPI ID: " + upiId +
            "\nAmount: " + formatMoney(amount)
        );

    } catch (error) {
        console.error("QR processing error:", error);
        alert("Unable to process this QR code.");
    } finally {
        isProcessingQR = false;
    }
}

// SCAN QR BUTTON

document.getElementById("scan-qr").addEventListener(
    "click",
    openQRScanner
);

// CLOSE SCANNER

document.getElementById("close-scanner").addEventListener(
    "click",
    function () {
        isProcessingQR = false;
        showHome();
    }
);

// BOTTOM NAVIGATION

navHome.addEventListener("click", showHome);
navHistory.addEventListener("click", showHistory);
navScan.addEventListener("click", openQRScanner);
navQR.addEventListener("click", showQR);
navProfile.addEventListener("click", showProfile);

// INITIAL DISPLAY

updateBalance();
renderRecentTransactions();
generateQRPattern();
showHome();

// RECHARGE & BILL PAYMENT SERVICES

const serviceConfig = {
    "mobile-recharge": {
        title: "Mobile Recharge",
        label: "Mobile Number",
        placeholder: "Enter 10-digit mobile number",
        providers: ["Jio", "Airtel", "Vi", "BSNL"],
        mobile: true
    },

    "electricity-payment": {
        title: "Electricity Bill",
        label: "Consumer Number",
        placeholder: "Enter Consumer Number",
        providers: ["UPPCL", "BSES", "Tata Power", "Other"]
    },

    "dth-recharge": {
        title: "DTH Recharge",
        label: "Subscriber ID",
        placeholder: "Enter Subscriber ID",
        providers: ["Tata Play", "Airtel Digital TV", "Dish TV", "Sun Direct"]
    },

    "gas-booking": {
        title: "Gas Cylinder",
        label: "LPG Consumer Number",
        placeholder: "Enter Consumer Number",
        providers: ["Indane Gas", "Bharat Gas", "HP Gas"]
    },

    "water-payment": {
        title: "Water Bill",
        label: "Consumer Number",
        placeholder: "Enter Consumer Number",
        providers: ["Delhi Jal Board", "Municipal Water Board", "Other"]
    },

    "broadband-payment": {
        title: "Broadband Bill",
        label: "Account Number",
        placeholder: "Enter Account Number",
        providers: ["Airtel Xstream", "JioFiber", "ACT Fibernet", "BSNL", "Other"]
    }
};

const serviceForm = document.getElementById("service-form");
const serviceTitle = document.getElementById("service-form-title");
const serviceLabel = document.getElementById("service-number-label");
const serviceNumber = document.getElementById("service-number");
const serviceProvider = document.getElementById("service-provider");
const serviceAmount = document.getElementById("service-amount");
const paymentForm = document.getElementById("service-payment-form");

let selectedService = null;

// OPEN SERVICE FORM

Object.keys(serviceConfig).forEach(function (id) {
    document.getElementById(id).addEventListener("click", function () {

        selectedService = serviceConfig[id];

        serviceTitle.textContent = selectedService.title;
        serviceLabel.textContent = selectedService.label;
        serviceNumber.placeholder = selectedService.placeholder;

        serviceProvider.replaceChildren();

        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "Select Provider";
        serviceProvider.appendChild(defaultOption);

        selectedService.providers.forEach(function (provider) {
            const option = document.createElement("option");
            option.value = provider;
            option.textContent = provider;
            serviceProvider.appendChild(option);
        });

        paymentForm.reset();
        serviceForm.hidden = false;

        serviceForm.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    });
});

// CLOSE SERVICE FORM

document.getElementById("close-service-form").addEventListener("click", function () {
    serviceForm.hidden = true;
    paymentForm.reset();
});

// TRANSACTION RECEIPT

const receiptModal = document.getElementById("receipt-modal");

function showReceipt(type, amount, item) {
    if (!receiptModal) {
        console.error("Receipt modal not found in HTML.");
        return;
    }

    document.getElementById("receipt-amount").textContent =
        formatMoney(amount);

    document.getElementById("receipt-debit-amount").textContent =
        formatMoney(amount);

    document.getElementById("receipt-type").textContent =
        item.recipientName || type;

    document.getElementById("receipt-id").textContent =
        item.id;

    document.getElementById("receipt-utr").textContent =
        item.utr;

    const transactionDate = new Date(item.date);

    document.getElementById("receipt-date").textContent =
        transactionDate.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        }) + " on " +
        transactionDate.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });

    receiptModal.hidden = false;
}

const closeReceiptButton = document.getElementById("close-receipt");

if (closeReceiptButton) {
    closeReceiptButton.addEventListener("click", function () {
        receiptModal.hidden = true;
    });
}

// SUBMIT RECHARGE OR BILL PAYMENT

paymentForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!selectedService) return;

    const number = serviceNumber.value.trim();
    const provider = serviceProvider.value;
    const amount = Number(serviceAmount.value);

    if (selectedService.mobile && !/^[6-9]\d{9}$/.test(number)) {
        alert("Please enter a valid 10-digit mobile number.");
        return;
    }

    if (!selectedService.mobile && number.length < 5) {
        alert("Please enter a valid account or consumer number.");
        return;
    }

    if (!provider) {
        alert("Please select a provider.");
        return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
        alert("Please enter a valid amount.");
        return;
    }

    const roundedAmount = Math.round(amount * 100) / 100;

    if (roundedAmount > balance) {
        alert("Insufficient virtual balance!");
        return;
    }

    balance = Math.round((balance - roundedAmount) * 100) / 100;

    addTransaction(
        selectedService.title + " - " + provider,
        roundedAmount,
        "debit"
    );

    paymentForm.reset();
    serviceForm.hidden = true;
});

// DOWNLOAD RECEIPT

document.addEventListener("click", function (event) {
    if (event.target.closest("#download-receipt")) {
        window.print();
    }
});
