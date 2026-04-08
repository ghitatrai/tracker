console.log("Bill-details.js loaded");

const params = new URLSearchParams(window.location.search);
const billId = params.get("id");
const detailsEl = document.getElementById("billDetails");

function getCategoryIcon(category) {
    const icons = {
        "Utilities": "bolt",
        "Mortgage": "home",
        "Rent": "home",
        "Software": "monitor",
        "Subscriptions": "card_membership",
        "Food": "restaurant",
        "Transportation": "directions_car",
        "Other": "receipt_long"
    };
    return icons[category] || "receipt_long";
}

function getStatusBadge(status) {
    const badges = {
        "PAID": '<span class="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold">✓ PAID</span>',
        "UNPAID": '<span class="px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold">⚠ UNPAID</span>',
        "OVERDUE": '<span class="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-semibold">! OVERDUE</span>'
    };
    return badges[status] || `<span class="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold">${status}</span>`;
}

if (!detailsEl) {
    console.error("billDetails element not found!");
}

if (!billId) {
    if (detailsEl) {
        detailsEl.innerHTML = `
            <div class="p-8 text-center">
                <p class="text-on-surface-variant mb-4">No bill ID provided.</p>
                <a href="/bills-page" class="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
                    <span class="material-symbols-outlined">arrow_back</span>
                    Back to Bills
                </a>
            </div>
        `;
    }
} else {
    console.log("Loading bill:", billId);
    fetch(`/bills/${billId}`)
        .then(res => {
            if (!res.ok) throw new Error("HTTP " + res.status);
            return res.json();
        })
        .then(bill => {
            console.log("Bill loaded:", bill);
            const formattedDate = bill.dueDate ? new Date(bill.dueDate).toLocaleDateString() : "N/A";
            const icon = getCategoryIcon(bill.category);
            const statusBadge = getStatusBadge(bill.status);
            
            if (detailsEl) {
                detailsEl.innerHTML = `
                    <!-- Bill Header -->
                    <div class="p-6 md:p-8 border-b border-surface-container bg-gradient-to-r from-primary/5 to-transparent">
                        <div class="flex items-start gap-4">
                            <div class="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <span class="material-symbols-outlined text-2xl text-primary">${icon}</span>
                            </div>
                            <div class="flex-1">
                                <h1 class="text-3xl md:text-4xl font-bold text-on-surface mb-2">${bill.title}</h1>
                                <p class="text-on-surface-variant text-sm">${bill.category || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Bill Details Grid -->
                    <div class="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <!-- Amount Section -->
                        <div class="space-y-2">
                            <p class="text-xs font-label uppercase tracking-widest text-outline">Amount</p>
                            <p class="text-4xl font-bold text-primary">$${parseFloat(bill.amount).toFixed(2)}</p>
                        </div>

                        <!-- Status Section -->
                        <div class="space-y-2">
                            <p class="text-xs font-label uppercase tracking-widest text-outline">Status</p>
                            <div class="pt-1">${statusBadge}</div>
                        </div>

                        <!-- Due Date Section -->
                        <div class="space-y-2">
                            <p class="text-xs font-label uppercase tracking-widest text-outline">Due Date</p>
                            <p class="text-lg font-semibold text-on-surface">${formattedDate}</p>
                        </div>

                        <!-- Category Section -->
                        <div class="space-y-2">
                            <p class="text-xs font-label uppercase tracking-widest text-outline">Category</p>
                            <div class="inline-block px-3 py-1 bg-surface-container-high rounded-lg text-sm font-medium text-on-surface-variant">${bill.category || 'N/A'}</div>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="p-6 md:p-8 border-t border-surface-container flex flex-col sm:flex-row gap-3">
                        <a href="/bill-form?id=${bill.id}" class="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-semibold transition-colors">
                            <span class="material-symbols-outlined">edit</span>
                            Edit Bill
                        </a>
                        <button onclick="deleteBill(${bill.id})" class="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-error/10 hover:bg-error/20 text-error rounded-lg font-semibold transition-colors">
                            <span class="material-symbols-outlined">delete</span>
                            Delete
                        </button>
                    </div>
                `;
            }
        })
        .catch(err => {
            console.error("Error loading bill:", err);
            if (detailsEl) {
                detailsEl.innerHTML = `
                    <div class="p-8 text-center">
                        <p class="text-on-surface-variant mb-4">Failed to load bill details: ${err.message}</p>
                        <a href="/bills-page" class="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
                            <span class="material-symbols-outlined">arrow_back</span>
                            Back to Bills
                        </a>
                    </div>
                `;
            }
        });
}

function deleteBill(id) {
    if (confirm("Are you sure you want to delete this bill?")) {
        fetch(`/bills/${id}`, { method: "DELETE" })
            .then(res => {
                if (!res.ok) throw new Error("HTTP " + res.status);
                console.log("Bill deleted successfully!");
                alert("Bill deleted successfully!");
                window.location.href = "/bills-page";
            })
            .catch(err => {
                console.error("Error deleting bill:", err);
                alert("Failed to delete bill: " + err.message);
            });
    }
}
