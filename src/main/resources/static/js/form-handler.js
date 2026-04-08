console.log("Form-handler.js loaded");

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFormHandler);
} else {
    initFormHandler();
}

function initFormHandler() {
    console.log("Initializing form handler...");

    const params = new URLSearchParams(window.location.search);
    const billId = params.get("id");

    const formEl = document.getElementById("billForm");
    if (!formEl) {
        console.error("billForm not found!");
        return;
    } else {
        console.log("Form found, ready for submission");
    }

    // Load bill data if editing
    if (billId) {
        console.log("Editing bill:", billId);
        const titleEl = document.getElementById("formTitle");
        if (titleEl) titleEl.textContent = "Edit Bill";

        fetch(`/bills/${billId}`)
            .then(res => {
                if (!res.ok) throw new Error("HTTP " + res.status);
                return res.json();
            })
            .then(bill => {
                console.log("Bill loaded:", bill);
                document.getElementById("title").value = bill.title;
                document.getElementById("amount").value = bill.amount;
                document.getElementById("dueDate").value = bill.dueDate;
                document.getElementById("category").value = bill.category || "";
                const statusInput = document.querySelector(`input[name="status"][value="${bill.status}"]`);
                if (statusInput) statusInput.checked = true;
            })
            .catch(err => {
                console.error("Error loading bill:", err);
                alert("Failed to load bill data: " + err.message);
            });
    }

    // Handle form submission
    formEl.addEventListener("submit", async (e) => {
        e.preventDefault();
        console.log("Form submitted");

        const bill = {
            title: document.getElementById("title").value,
            amount: parseFloat(document.getElementById("amount").value),
            dueDate: document.getElementById("dueDate").value,
            category: document.getElementById("category").value,
            status: document.querySelector('input[name="status"]:checked')?.value || "UNPAID"
        };

        console.log("Bill data:", bill);

        try {
            if (billId) {
                // Update existing bill
                console.log("Updating bill...");
                const res = await fetch(`/bills/${billId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(bill)
                });
                if (!res.ok) throw new Error("Update failed: HTTP " + res.status);
                console.log("Bill updated successfully!");
                alert("Bill updated successfully!");
            } else {
                // Create new bill
                console.log("Creating bill...");
                const res = await fetch("/bills", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(bill)
                });
                if (!res.ok) throw new Error("Create failed: HTTP " + res.status);
                console.log("Bill created successfully!");
                alert("Bill created successfully!");
            }
            window.location.href = "/bills-page";
        } catch (err) {
            console.error("Error saving bill:", err);
            alert("Failed to save bill: " + err.message);
        }
    });
}
