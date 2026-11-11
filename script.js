
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

// QR IMAGE SCANNER

let isProcessingQR = false;


async function openQRScanner() {
    showScreen(scannerScreen, navScan);

    const reader = document.getElementById("qr-reader");
    const result = document.getElementById("scan-result");

    if (!reader || !result) return;

    reader.replaceChildren();
    result.textContent = "";

    // CAMERA BUTTON
    const cameraButton = document.createElement("button");
    cameraButton.textContent = "Open Camera";
    cameraButton.className = "primary-button";
    cameraButton.style.width = "100%";
    cameraButton.style.marginTop = "15px";

    // IMAGE UPLOAD BUTTON
    const uploadLabel = document.createElement("label");
    uploadLabel.textContent = "Choose QR Image";
    uploadLabel.className = "primary-button";
    uploadLabel.style.display = "block";
    uploadLabel.style.textAlign = "center";
    uploadLabel.style.marginTop = "12px";
    uploadLabel.style.cursor = "pointer";

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.style.display = "none";

    uploadLabel.appendChild(fileInput);

    reader.append(cameraButton, uploadLabel);

    // LIVE CAMERA SCANNER
    let html5QrCode = null;
    let cameraResultHandled = false;

    cameraButton.addEventListener("click", async function () {
        try {
            if (typeof Html5Qrcode === "undefined") {
                result.textContent = "Camera scanner library not loaded.";
                return;
            }

            cameraButton.disabled = true;
            result.textContent = "Starting camera...";

            const cameraContainer = document.createElement("div");
            cameraContainer.id = "live-camera-reader";
            cameraContainer.style.width = "100%";
            cameraContainer.style.marginTop = "15px";

            reader.appendChild(cameraContainer);

            html5QrCode = new Html5Qrcode("live-camera-reader");

            await html5QrCode.start(
                { facingMode: "environment" },
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 }
                },
                async function (decodedText) {
    if (cameraResultHandled) return;
    cameraResultHandled = true;

    result.textContent = "QR scanned successfully!";

    try {
        await html5QrCode.stop();
    } catch (error) {
        console.log(error);
    }

    await handleQRScan(decodedText);
},
                function () {}
            );

            result.textContent = "Camera active. Scan a QR code.";

        } catch (error) {
            console.error("Camera error:", error);
            result.textContent =
                "Camera could not start. Please allow camera permission.";
            cameraButton.disabled = false;
        }
    });

    // QR IMAGE UPLOAD
    fileInput.addEventListener("change", async function () {
        const file = fileInput.files[0];
        if (!file) return;

        result.textContent = "Scanning QR image...";

        let bitmap = null;

        try {
            bitmap = await createImageBitmap(file);

            let decodedText = null;

            if ("BarcodeDetector" in window) {
                try {
                    const detector = new BarcodeDetector({
                        formats: ["qr_code"]
                    });

                    const codes = await detector.detect(bitmap);

                    if (codes.length > 0) {
                        decodedText = codes[0].rawValue;
                    }
                } catch (error) {
                    console.log(error);
                }
            }

            if (!decodedText && typeof jsQR !== "undefined") {
                const canvas = document.createElement("canvas");
                canvas.width = bitmap.width;
                canvas.height = bitmap.height;

                const context = canvas.getContext("2d");
                context.drawImage(bitmap, 0, 0);

                const imageData = context.getImageData(
                    0, 0, canvas.width, canvas.height
                );

                const code = jsQR(
                    imageData.data,
                    imageData.width,
                    imageData.height
                );

                if (code) decodedText = code.data;
            }

            if (!decodedText) {
                result.textContent = "QR not detected. Try another image.";
                return;
            }

            result.textContent = "QR scanned successfully!";
            await handleQRScan(decodedText);

        } catch (error) {
            console.error(error);
            result.textContent = "Unable to read this image.";

        } finally {
            if (bitmap) bitmap.close();
        }
    });
}
let scannedQRRecipient = null;
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

        scannedQRRecipient = { name, upiId };

document.getElementById("qr-payee-name").textContent = name;
document.getElementById("qr-payee-upi").textContent = "UPI ID: " + upiId;

document.getElementById("qr-payment-amount").value = "";
document.getElementById("qr-payment-error").textContent = "";

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

    const roundedAmount = Math.round(amount * 100) / 100;

    balance = Math.round((balance - roundedAmount) * 100) / 100;
    qrPaymentModal.hidden = true;

    addTransaction("QR Payment", roundedAmount, "debit", scannedQRRecipient.name);
    announceSentPayment(roundedAmount);

    scannedQRRecipient = null;
});

document.getElementById("qr-pay-cancel").addEventListener("click", function () {
    qrPaymentModal.hidden = true;
    qrPaymentAmount.value = "";
    qrPaymentError.textContent = "";
    scannedQRRecipient = null;
});
// SCAN QR BUTTON

const scanQRButton = document.getElementById("scan-qr");

if (scanQRButton) {
    scanQRButton.addEventListener("click", openQRScanner);
}

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
