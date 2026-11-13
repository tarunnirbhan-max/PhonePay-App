
// SAVED WALLET DATA

const oldBalanceKey = "phonepe" + "Balance";
const oldTransactionsKey = "phonepe" + "Transactions";

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
const searchScreen = document.getElementById("search-screen");
const alertsScreen = document.getElementById("alerts-screen");

const transactionList = document.getElementById("transaction-list");
const recentTransactions = document.getElementById("recent-transactions");

const navHome = document.getElementById("nav-home");
const navSearch = document.getElementById("nav-search");
const navHistory = document.getElementById("nav-history");
const navScan = document.getElementById("nav-scan");
const navAlerts = document.getElementById("nav-alerts");

const screens = [
    homeScreen,
    historyScreen,
    qrScreen,
    profileScreen,
    scannerScreen,
    searchScreen,
    alertsScreen
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
    [navHome, navSearch, navHistory, navScan, navAlerts].forEach(function (item) {
        if (item) {
            item.classList.remove("active");
        }
    });

    if (button) {
        button.classList.add("active");
    }
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
function showSearch() {
    showScreen(searchScreen, navSearch);

    const searchInput = document.getElementById("app-search-input");

    if (searchInput) {
        searchInput.focus();
    }
}

function showAlerts() {
    showScreen(alertsScreen, navAlerts);
}

function showHistory() {
    renderHistory();
    showScreen(historyScreen, navHistory);
}

function showQR() {
    generateQRPattern();
    showScreen(qrScreen, navHome);
}

function showProfile() {
    showScreen(profileScreen, navHome);
}

// FULL APP SEARCH


const appSearchItems = [
    { name: "To Phone Number", keywords: "send money mobile transfer", id: "send-money", category: "Money Transfer", icon: "📱" },
    { name: "To Bank & Self A/c", keywords: "bank account transfer", id: "receive-money", category: "Money Transfer", icon: "🏦" },
    { name: "Check Bank Balance", keywords: "bank balance account", id: "check-bank-balance", category: "Banking", icon: "💳" },
    { name: "Mobile Recharge", keywords: "mobile phone recharge prepaid", id: "mobile-recharge", category: "Recharge & Bills", icon: "📲" },
    { name: "Electricity", keywords: "electricity light power bill", id: "electricity-payment", category: "Recharge & Bills", icon: "💡" },
    { name: "DTH Recharge", keywords: "tv dish recharge", id: "dth-recharge", category: "Recharge & Bills", icon: "📺" },
    { name: "Gas Cylinder", keywords: "gas booking lpg cylinder", id: "gas-booking", category: "Recharge & Bills", icon: "🔥" },
    { name: "Water Bill", keywords: "water payment bill", id: "water-payment", category: "Recharge & Bills", icon: "💧" },
    { name: "Broadband", keywords: "wifi internet broadband", id: "broadband-payment", category: "Recharge & Bills", icon: "🌐" },
    { name: "My QR", keywords: "qr code receive payment", id: "open-qr", category: "Payments", icon: "▦" },
    { name: "Transaction History", keywords: "history transactions activity", id: "open-history", category: "Payments", icon: "📋" }
];

const appSearchInput = document.getElementById("app-search-input");
const appSearchResults = document.getElementById("app-search-results");

function renderAppSearch(query = "") {
    const searchText = query.toLowerCase().trim();

    const results = appSearchItems.filter(function(item) {
        return (item.name + " " + item.keywords + " " + item.category)
            .toLowerCase()
            .includes(searchText);
    });

    appSearchResults.innerHTML = "";

    if (results.length === 0) {
        const empty = document.createElement("div");
        empty.className = "empty-state";
        empty.textContent = "No results found.";
        appSearchResults.appendChild(empty);
        return;
    }

    results.forEach(function(item) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "app-search-result";

        const icon = document.createElement("span");
        icon.className = "search-result-icon";
        icon.textContent = item.icon;

        const details = document.createElement("span");
        details.className = "search-result-details";

        const title = document.createElement("strong");
        title.textContent = item.name;

        const category = document.createElement("small");
        category.textContent = item.category;

        details.appendChild(title);
        details.appendChild(category);
        button.appendChild(icon);
        button.appendChild(details);

        button.addEventListener("click", function() {
            const target = document.getElementById(item.id);

            if (!target) {
                console.error("Search target not found:", item.id);
                return;
            }

            appSearchInput.value = "";
            renderAppSearch("");

            target.click();
        });

        appSearchResults.appendChild(button);
    });
}

if (appSearchInput && appSearchResults) {
    appSearchInput.addEventListener("input", function() {
        renderAppSearch(this.value);
    });

    renderAppSearch();
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
    const transactionDate = new Date(item.date);

date.textContent = transactionDate.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata"
});

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
    new Date(item.date).toLocaleString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata"
    });

    document.getElementById("detail-status").textContent =
    item.status === "Simulated"
        ? "Completed"
        : item.status || "Completed";

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
        status: "Completed"
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

const sendMobileStep = document.getElementById("send-mobile-step");
const paymentAmountStep = document.getElementById("payment-amount-step");
const sendMobileInput = document.getElementById("send-mobile-input");

const paymentConfirmButton = document.getElementById("payment-popup-confirm");

let paymentMode = "send";
let sendMobileStepActive = true;
let recipientMobile = "";

// OPEN SEND MONEY

document.getElementById("send-money").addEventListener("click", function () {
    paymentMode = "send";
    sendMobileStepActive = true;
    recipientMobile = "";

    paymentPopup.querySelector("h3").textContent = "Send Money";

    sendMobileStep.hidden = false;
    paymentAmountStep.hidden = true;

    sendMobileInput.value = "";
    paymentAmountInput.value = "";
    paymentPopupMessage.textContent = "";

    paymentConfirmButton.textContent = "Continue";

    paymentPopup.hidden = false;
    sendMobileInput.focus();
});

// OPEN RECEIVE MONEY

document.getElementById("receive-money").addEventListener("click", function () {
    paymentMode = "receive";
    sendMobileStepActive = false;

    paymentPopup.querySelector("h3").textContent = "Receive Money";

    sendMobileStep.hidden = true;
    paymentAmountStep.hidden = false;

    paymentAmountInput.value = "";
    paymentPopupMessage.textContent = "";

    paymentConfirmButton.textContent = "Receive";

    paymentPopup.hidden = false;
    paymentAmountInput.focus();
});

// MOBILE NUMBER INPUT

sendMobileInput.addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "").slice(0, 10);
    paymentPopupMessage.textContent = "";
});

// CANCEL POPUP

document.getElementById("payment-popup-cancel").addEventListener("click", function () {
    paymentPopup.hidden = true;
    sendMobileInput.value = "";
    paymentAmountInput.value = "";
    paymentPopupMessage.textContent = "";
    recipientMobile = "";
});

// CONFIRM BUTTON

paymentConfirmButton.addEventListener("click", function () {

    // FIRST STEP: VALIDATE MOBILE NUMBER

    if (paymentMode === "send" && sendMobileStepActive) {

        const mobile = sendMobileInput.value.trim();

        if (!/^[6-9]\d{9}$/.test(mobile)) {
            paymentPopupMessage.textContent =
                "Please enter a valid 10-digit mobile number.";
            return;
        }

        recipientMobile = mobile;
        sendMobileStepActive = false;

        sendMobileStep.hidden = true;
        paymentAmountStep.hidden = false;

        paymentPopupMessage.textContent = "";
        paymentConfirmButton.textContent = "Pay";

        paymentAmountInput.focus();
        return;
    }

    // SECOND STEP: AMOUNT

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

        addTransaction(
            "Money Sent",
            roundedAmount,
            "debit",
            "Mobile: " + recipientMobile
        );

        announceSentPayment(roundedAmount);

        recipientMobile = "";

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


// QR IMAGE AND LIVE CAMERA SCANNER

let isProcessingQR = false;
let scannedQRRecipient = null;
let qrCamera = null;
let torchEnabled = false;

// OPEN SCANNER AND START CAMERA

async function openQRScanner() {
    showScreen(scannerScreen, navScan);

    const result = document.getElementById("scan-result");

    result.textContent = "";
    torchEnabled = false;

    const torchButton = document.getElementById("scanner-torch");
    if (torchButton) {
        torchButton.querySelector("span:last-child").textContent = "Torch";
    }

    try {
        if (typeof Html5Qrcode === "undefined") {
            result.textContent = "Camera scanner library not loaded.";
            return;
        }

        if (!qrCamera) {
            qrCamera = new Html5Qrcode("live-camera-reader");
        }

        if (qrCamera.isScanning) {
            await qrCamera.stop();
        }

        await qrCamera.start(
            { facingMode: "environment" },
            {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1
            },
            async function(decodedText) {
                if (isProcessingQR) return;

                result.textContent = "QR scanned successfully!";

                try {
                    if (qrCamera && qrCamera.isScanning) {
                        await qrCamera.stop();
                    }
                } catch (error) {
                    console.log("Camera stop:", error);
                }

                await handleQRScan(decodedText);
            },
            function() {
                // Waiting for QR code
            }
        );

    } catch (error) {
        console.error("Camera error:", error);
        result.textContent =
            "Camera could not start. Please allow camera permission.";
    }
}

// UPLOAD QR IMAGE

document.getElementById("scanner-file-input")
    .addEventListener("change", async function() {

        const file = this.files[0];
        const result = document.getElementById("scan-result");

        if (!file) return;

        this.value = "";

        if (typeof jsQR === "undefined") {
            result.textContent = "QR image scanner library not loaded.";
            return;
        }

        result.textContent = "Scanning QR image...";

        try {
            const bitmap = await createImageBitmap(file);

            const canvas = document.createElement("canvas");
            canvas.width = bitmap.width;
            canvas.height = bitmap.height;

            const context = canvas.getContext("2d", {
                willReadFrequently: true
            });

            context.drawImage(bitmap, 0, 0);
            bitmap.close();

            const imageData = context.getImageData(
                0, 0, canvas.width, canvas.height
            );

            const code = jsQR(
                imageData.data,
                imageData.width,
                imageData.height,
                { inversionAttempts: "attemptBoth" }
            );

            if (!code) {
                result.textContent = "QR not detected. Try another image.";
                return;
            }

            result.textContent = "QR scanned successfully!";
            await handleQRScan(code.data);

        } catch (error) {
            console.error("QR image scanning error:", error);
            result.textContent = "Unable to read this image.";
        }
    });

// TORCH BUTTON

document.getElementById("scanner-torch")
    .addEventListener("click", async function() {

        if (!qrCamera || !qrCamera.isScanning) {
            document.getElementById("scan-result").textContent =
                "Camera is not running.";
            return;
        }

        try {
            torchEnabled = !torchEnabled;

            await qrCamera.applyVideoConstraints({
                advanced: [{ torch: torchEnabled }]
            });

            this.querySelector("span:last-child").textContent =
                torchEnabled ? "Torch On" : "Torch";

        } catch (error) {
            torchEnabled = false;

            document.getElementById("scan-result").textContent =
                "Torch is not supported on this device.";
        }
    });

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
const name = getUPIParam("pn") || "Name not provided in QR";

const amountText = getUPIParam("am");
const qrAmount = amountText ? Number(amountText) : null;

const note = getUPIParam("tn");
const merchantCode = getUPIParam("mc");
const reference = getUPIParam("tr");
const currency = getUPIParam("cu") || "INR";

        if (!upiId || !upiId.includes("@")) {
            if (currency.toUpperCase() !== "INR") {
    alert("Only INR payment QR codes are supported.");
    return;
}
            alert("Valid UPI ID not found in this QR.");
            return;
        }

        document.getElementById("scanned-name").textContent = name;
        document.getElementById("scanned-upi").textContent = upiId;
        document.getElementById("scanned-recipient").hidden = false;

        scannedQRRecipient = {
    name: name,
    upiId: upiId,
    amount: Number.isFinite(qrAmount) && qrAmount > 0
        ? qrAmount
        : null,
    note: note,
    merchantCode: merchantCode,
    reference: reference,
    currency: currency
};

document.getElementById("qr-payee-name").textContent = name;

document.getElementById("qr-payee-upi").textContent =
    "UPI ID: " + upiId;

document.getElementById("qr-payee-bank-name").textContent = name;

document.getElementById("qr-payee-avatar").textContent =
    name.charAt(0).toUpperCase();

document.getElementById("qr-payment-amount").value =
    scannedQRRecipient.amount !== null
        ? scannedQRRecipient.amount.toFixed(2)
        : "";

document.getElementById("qr-payment-message").value =
    scannedQRRecipient.note || "";

document.getElementById("qr-payment-error").textContent = "";

qrPaymentModal.hidden = false;
showScreen(null, null);
qrPaymentModal.hidden = false;

    } catch (error) {
        console.error("QR processing error:", error);
        alert("Unable to process this QR code.");
    } finally {
        isProcessingQR = false;
    }
}

// QR PAYMENT MODAL BUTTONS

const qrPaymentModal = document.getElementById("qr-payment-modal");
const qrPaymentAmount = document.getElementById("qr-payment-amount");
const qrPaymentError = document.getElementById("qr-payment-error");

const qrMethodScreen = document.getElementById("qr-payment-method-screen");
const qrMethodTotal = document.getElementById("qr-method-total-amount");
const qrMethodPay = document.getElementById("qr-method-pay");

let pendingQRPaymentAmount = 0;
let selectedQRBank = "bob";

// PROCEED TO PAY - OPEN PAYMENT METHOD SCREEN

document.getElementById("qr-pay-now").addEventListener("click", function () {

    const enteredAmount = qrPaymentAmount.value.trim();
    const amount = Number(enteredAmount);

    if (enteredAmount === "" || !Number.isFinite(amount) || amount <= 0) {
        qrPaymentError.textContent = "Please enter a valid amount.";
        return;
    }

    if (amount > balance) {
        qrPaymentError.textContent = "Insufficient virtual balance.";
        return;
    }

    if (!scannedQRRecipient) {
        qrPaymentError.textContent = "Recipient details missing. Scan again.";
        return;
    }

    pendingQRPaymentAmount = Math.round(amount * 100) / 100;

    const formattedAmount = "₹" + pendingQRPaymentAmount.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    qrMethodTotal.textContent = formattedAmount;
    qrMethodPay.textContent = "Pay " + formattedAmount;

    qrPaymentModal.hidden = true;
    qrMethodScreen.hidden = false;
});

// SELECT BANK ACCOUNT

document.querySelectorAll(".qr-bank-option").forEach(function (option) {

    option.addEventListener("click", function () {

        document.querySelectorAll(".qr-bank-option").forEach(function (bank) {
            bank.classList.remove("selected");
        });

        option.classList.add("selected");
        selectedQRBank = option.dataset.bank;
    });

});

// BACK TO QR PAYMENT SCREEN

document.getElementById("qr-method-back").addEventListener("click", function () {

    qrMethodScreen.hidden = true;
    qrPaymentModal.hidden = false;

});

// ADD BANK ACCOUNT

document.getElementById("qr-add-bank").addEventListener("click", function () {
    alert("Add Bank Account option selected.");
});

// ADD CREDIT LINE

document.getElementById("qr-add-credit").addEventListener("click", function () {
    alert("Credit Line on UPI option selected.");
});


// FINAL PAY BUTTON - OPEN DEMO UPI PIN SCREEN

const upiPinScreen = document.getElementById("upi-pin-screen");
const upiPinAmount = document.getElementById("upi-pin-amount");
const upiPinRecipient = document.getElementById("upi-pin-recipient");
const upiPinBank = document.getElementById("upi-pin-bank");
const upiPinPay = document.getElementById("upi-pin-pay");

let upiPinDigits = "";

qrMethodPay.addEventListener("click", function () {
    if (!pendingQRPaymentAmount || !scannedQRRecipient) {
        alert("Payment details missing. Please try again.");
        return;
    }

    const bankDetails = {
        bob: "SAVINGS: Bank Of Baroda - 4185",
        sbi1: "SAVINGS: State Bank Of India - 6971",
        sbi2: "SAVINGS: State Bank Of India - 0895"
    };

    const formattedAmount = "₹" + pendingQRPaymentAmount.toFixed(2);

    upiPinAmount.textContent = "Pay " + formattedAmount;
    upiPinRecipient.textContent = "To " + scannedQRRecipient.name;
    upiPinBank.textContent = bankDetails[selectedQRBank] || bankDetails.bob;

    upiPinDigits = "";
    updateUPIPinDots();

    qrMethodScreen.hidden = true;
    upiPinScreen.hidden = false;
});

// UPDATE PIN DOTS
function updateUPIPinDots() {
    document.querySelectorAll(".upi-pin-dots span").forEach(function (dot, index) {
        dot.classList.toggle("filled", index < upiPinDigits.length);
    });
}

// NUMBER KEYPAD
document.querySelectorAll("[data-pin-key]").forEach(function (key) {
    key.addEventListener("click", function () {
        if (upiPinDigits.length >= 4) return;

        upiPinDigits += key.dataset.pinKey;
        updateUPIPinDots();
    });
});

// DELETE PIN DIGIT
document.getElementById("upi-pin-delete").addEventListener("click", function () {
    upiPinDigits = upiPinDigits.slice(0, -1);
    updateUPIPinDots();
});

// CLOSE PIN SCREEN
document.getElementById("upi-pin-close").addEventListener("click", function () {
    upiPinScreen.hidden = true;
    qrMethodScreen.hidden = false;
    upiPinDigits = "";
    updateUPIPinDots();
});


 // DEMO PAYMENT CONFIRMATION
upiPinPay.addEventListener("click", function () {
    if (upiPinDigits.length !== 4) {
        alert("Please enter all 4 demo PIN digits.");
        return;
    }

    if (!pendingQRPaymentAmount || !scannedQRRecipient) {
        alert("Payment details missing. Please try again.");
        return;
    }

    if (pendingQRPaymentAmount > balance) {
        alert("Insufficient virtual balance.");
        return;
    }

    const roundedAmount = pendingQRPaymentAmount;
    const recipient = scannedQRRecipient;

    balance = Math.round((balance - roundedAmount) * 100) / 100;

    upiPinScreen.hidden = true;

    addTransaction("QR Payment", roundedAmount, "debit", recipient.name);
    announceSentPayment(roundedAmount);

    const successScreen = document.getElementById("payment-success-screen");
    const successDate = document.getElementById("payment-success-date");
    const paymentTime = new Date();

    successDate.textContent =
        paymentTime.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
            timeZone: "Asia/Kolkata"
        }) + " at " +
        paymentTime.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
            timeZone: "Asia/Kolkata"
        });

    // RECIPIENT DETAILS
    document.getElementById("success-recipient-name").textContent =
        recipient.name;

    document.getElementById("success-recipient-upi").textContent =
        recipient.upiId;

    document.getElementById("success-payment-amount").textContent =
        "₹" + roundedAmount.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

    document.getElementById("success-avatar").textContent =
        recipient.name.trim().charAt(0).toUpperCase();

    // SHOW GREEN SUCCESS SCREEN FIRST
successScreen.hidden = false;

const detailsScreen = document.getElementById("payment-details-screen");

// SHOW BLACK DETAILS SCREEN AFTER 2 SECONDS
setTimeout(function () {
    successScreen.hidden = true;
    detailsScreen.hidden = false;
}, 2000);

    scannedQRRecipient = null;
    pendingQRPaymentAmount = 0;
    upiPinDigits = "";
    updateUPIPinDots();
});

// DONE BUTTON
document.getElementById("payment-success-done").addEventListener("click", function () {
    document.getElementById("payment-details-screen").hidden = true;
    showHome();
});

// VIEW PAYMENT DETAILS
document.getElementById("view-payment-details").addEventListener("click", function () {
    document.getElementById("payment-details-screen").hidden = true;
    showHistory();
});

// SHARE RECEIPT
document.getElementById("share-payment-receipt").addEventListener("click", async function () {
    const recipientName =
        document.getElementById("success-recipient-name").textContent;

    const recipientUpi =
        document.getElementById("success-recipient-upi").textContent;

    const amount =
        document.getElementById("success-payment-amount").textContent;

    const receiptText =
        "Payment Successful\n" +
        "To: " + recipientName + "\n" +
        "UPI ID: " + recipientUpi + "\n" +
        "Amount: " + amount + "\n" +
        successDate.textContent;

    if (navigator.share) {
        try {
            await navigator.share({
                title: "Payment Receipt",
                text: receiptText
            });
        } catch (error) {
            if (error.name !== "AbortError") {
                console.error("Share error:", error);
            }
        }
    } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(receiptText);
        alert("Receipt details copied!");
    } else {
        alert("Sharing is not supported on this browser.");
    }
});

// SPLIT EXPENSE
document.getElementById("split-expense-btn").addEventListener("click", function () {
    alert("Split Expense feature coming soon!");
});



// CANCEL QR PAYMENT

document.getElementById("qr-pay-cancel").addEventListener("click", function () {

    qrPaymentModal.hidden = true;
    qrPaymentAmount.value = "";
    qrPaymentError.textContent = "";
    scannedQRRecipient = null;
    pendingQRPaymentAmount = 0;

});

// SCAN QR BUTTON

const scanQRButton = document.getElementById("scan-qr");

if (scanQRButton) {
    scanQRButton.addEventListener("click", openQRScanner);
}


// CLOSE SCANNER

document.getElementById("close-scanner")
    .addEventListener("click", async function() {

        isProcessingQR = false;

        if (qrCamera && qrCamera.isScanning) {
            try {
                await qrCamera.stop();
            } catch (error) {
                console.log("Camera stop error:", error);
            }
        }

        showHome();
    });


// BOTTOM NAVIGATION

navHome.addEventListener("click", showHome);
navSearch.addEventListener("click", showSearch);
navScan.addEventListener("click", openQRScanner);
navHistory.addEventListener("click", showHistory);
navAlerts.addEventListener("click", showAlerts);

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
    console.log("RECEIPT DATE TEST:", item.date);

document.getElementById("receipt-date").textContent =
    transactionDate.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata"
    }) + " on " +
    transactionDate.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "Asia/Kolkata"
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
// TRENDING AUTO SLIDER

const trendingSlides = document.querySelectorAll(".trending-slide");
const trendingDots = document.querySelectorAll(".trending-dots span");

let trendingIndex = 0;

if (trendingSlides.length > 1) {
    setInterval(() => {

        trendingSlides[trendingIndex].classList.remove("active");
        trendingDots[trendingIndex].classList.remove("active");

        trendingIndex = (trendingIndex + 1) % trendingSlides.length;

        trendingSlides[trendingIndex].classList.add("active");
        trendingDots[trendingIndex].classList.add("active");

    }, 4000);
}
