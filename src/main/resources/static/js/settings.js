console.log("Settings.js loaded");

// Load settings from localStorage
function loadSettings() {
    console.log("Loading settings...");
    const theme = localStorage.getItem("theme") || "light";
    const currency = localStorage.getItem("currency") || "USD";
    const emailNotifications = localStorage.getItem("emailNotifications") !== "false";
    const dueDateReminder = localStorage.getItem("dueDateReminder") !== "false";
    const weeklyReport = localStorage.getItem("weeklyReport") !== "false";

    const themeSelect = document.getElementById("themeSelect");
    const currencySelect = document.getElementById("currencySelect");
    const emailEl = document.getElementById("emailNotifications");
    const dueEl = document.getElementById("dueDateReminder");
    const weeklyEl = document.getElementById("weeklyReport");

    if (themeSelect) themeSelect.value = theme;
    if (currencySelect) currencySelect.value = currency;
    if (emailEl) emailEl.checked = emailNotifications;
    if (dueEl) dueEl.checked = dueDateReminder;
    if (weeklyEl) weeklyEl.checked = weeklyReport;
    
    console.log("Settings loaded");
}

// Save settings to localStorage
function saveSettings() {
    console.log("Saving settings...");
    const themeSelect = document.getElementById("themeSelect");
    const currencySelect = document.getElementById("currencySelect");
    const emailEl = document.getElementById("emailNotifications");
    const dueEl = document.getElementById("dueDateReminder");
    const weeklyEl = document.getElementById("weeklyReport");

    const theme = themeSelect ? themeSelect.value : "light";
    const currency = currencySelect ? currencySelect.value : "USD";
    const emailNotifications = emailEl ? emailEl.checked : true;
    const dueDateReminder = dueEl ? dueEl.checked : true;
    const weeklyReport = weeklyEl ? weeklyEl.checked : true;

    localStorage.setItem("theme", theme);
    localStorage.setItem("currency", currency);
    localStorage.setItem("emailNotifications", emailNotifications);
    localStorage.setItem("dueDateReminder", dueDateReminder);
    localStorage.setItem("weeklyReport", weeklyReport);

    console.log("Settings saved");
    alert("Settings saved successfully!");
}

// Load settings when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadSettings);
} else {
    loadSettings();
}
