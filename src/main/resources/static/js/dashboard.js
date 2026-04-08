console.log("Dashboard.js loaded");

function initDashboard() {
    console.log("Initializing dashboard...");
    
    fetch('/bills/dashboard')
        .then(res => {
            console.log("Dashboard - Response status:", res.status);
            if (!res.ok) throw new Error("HTTP " + res.status);
            return res.json();
        })
        .then(data => {
            console.log("Dashboard data:", data);
            
            const monthEl = document.getElementById("totalMonth");
            const yearEl = document.getElementById("totalYear");
            const unpaidEl = document.getElementById("unpaid");
            const upcomingAmountEl = document.getElementById("upcomingAmount");
            const upcomingCountEl = document.getElementById("upcomingCount");
            const listEl = document.getElementById("upcomingList");
            
            if (monthEl) monthEl.innerText = '$' + (data.totalThisMonth || 0).toFixed(2);
            if (yearEl) yearEl.innerText = '$' + (data.totalThisYear || 0).toFixed(2);
            if (unpaidEl) unpaidEl.innerText = (data.unpaid || 0);
            
            // Calculate upcoming amount and count
            let upcomingAmount = 0;
            let upcomingCount = 0;
            if (data.upcoming && data.upcoming.length > 0) {
                upcomingCount = data.upcoming.length;
                upcomingAmount = data.upcoming.reduce((sum, bill) => sum + parseFloat(bill.amount || 0), 0);
            }
            if (upcomingAmountEl) upcomingAmountEl.innerText = '$' + upcomingAmount.toFixed(2);
            if (upcomingCountEl) upcomingCountEl.innerText = upcomingCount;
            
            if (listEl) {
                listEl.innerHTML = "";
                if (data.upcoming && data.upcoming.length > 0) {
                    data.upcoming.forEach(bill => {
                        const tr = document.createElement("tr");
                        tr.className = "hover:bg-surface-container-low transition-colors group";
                        tr.innerHTML = `
                            <td class="px-8 py-6">
                                <div class="flex items-center gap-4">
                                    <div class="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center text-teal-800">
                                        <span class="material-symbols-outlined">receipt_long</span>
                                    </div>
                                    <div>
                                        <p class="font-bold text-on-surface">${bill.title}</p>
                                        <p class="text-xs text-outline">${bill.category || 'N/A'}</p>
                                    </div>
                                </div>
                            </td>
                            <td class="px-8 py-6 text-sm text-slate-600 font-medium italic">${bill.dueDate || 'N/A'}</td>
                            <td class="px-8 py-6 font-headline font-bold text-teal-900">$${parseFloat(bill.amount).toFixed(2)}</td>
                            <td class="px-8 py-6">
                                <span class="px-3 py-1 bg-secondary-container/20 text-on-secondary-container text-[10px] font-bold uppercase rounded-full">${bill.status || 'Upcoming'}</span>
                            </td>
                            <td class="px-8 py-6 text-right">
                                <div class="flex items-center justify-end gap-2">
                                    <a href="/bill-form?id=${bill.id}" class="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-teal-600 transition-colors">
                                        <span class="material-symbols-outlined">edit</span>
                                    </a>
                                    <a href="/bill-details?id=${bill.id}" class="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-teal-600 transition-colors">
                                        <span class="material-symbols-outlined">visibility</span>
                                    </a>
                                    <button type="button" onclick="confirmDashboardDelete(${bill.id})" class="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-error transition-colors">
                                        <span class="material-symbols-outlined">delete</span>
                                    </button>
                                </div>
                            </td>
                        `;
                        listEl.appendChild(tr);
                    });
                } else {
                    const tr = document.createElement("tr");
                    tr.innerHTML = '<td colspan="5" class="px-8 py-6 text-center text-slate-500">No upcoming bills</td>';
                    listEl.appendChild(tr);
                }
            }
        })
        .catch(err => {
            console.error("Error loading dashboard data:", err);
            alert("Error loading dashboard: " + err.message);
        });
}

function confirmDashboardDelete(id) {
    if (!confirm("Delete this upcoming bill?")) {
        return;
    }

    API.deleteBill(id)
        .then(() => {
            alert("Bill deleted successfully.");
            initDashboard();
        })
        .catch(err => {
            console.error("Error deleting bill:", err);
            alert("Failed to delete bill: " + err.message);
        });
}

// Load chart data
function loadChart() {
    console.log("Loading chart...");
    fetch('/bills/analytics/monthly')
        .then(res => {
            if (!res.ok) throw new Error("HTTP " + res.status);
            return res.json();
        })
        .then(data => {
            console.log("Chart data:", data);
            const canvas = document.getElementById("lineChart");
            if (canvas && typeof renderLineChart === 'function') {
                renderLineChart(canvas, data.labels, data.values);
            } else {
                console.warn("Chart canvas or renderLineChart not found");
            }
        })
        .catch(err => console.error("Error loading chart:", err));
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initDashboard();
        loadChart();
    });
} else {
    initDashboard();
    loadChart();
}