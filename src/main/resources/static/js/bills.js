console.log("Bills.js loaded");

let allBills = [];
let filteredBills = [];
let currentPage = 1;
const itemsPerPage = 10;

function loadBills() {
    console.log("Loading bills...");
    const table = document.getElementById("billsTable");
    
    if (!table) {
        console.error("billsTable element not found!");
        return;
    }
    
    table.innerHTML = "<tr><td colspan='6' style='text-align: center; padding: 30px;'>Loading...</td></tr>";

    fetch("/bills")
        .then(res => {
            console.log("Response status:", res.status);
            if (!res.ok) throw new Error("HTTP " + res.status);
            return res.json();
        })
        .then(bills => {
            console.log("Bills received:", bills);
            allBills = bills || [];
            filteredBills = [...allBills];
            
            // Update header counts
            updateHeaderCounts();
            
            // Apply filters and render
            applyFilters();
        })
        .catch(err => {
            console.error("Error loading bills:", err);
            table.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 30px; color: #e53e3e;">Error: ' + err.message + '</td></tr>';
        });
}

function updateHeaderCounts() {
    const totalBillsEl = document.getElementById("totalBills");
    const totalCategoriesEl = document.getElementById("totalCategories");
    
    if (totalBillsEl) totalBillsEl.textContent = allBills.length;
    
    const categories = new Set(allBills.map(bill => bill.category).filter(cat => cat));
    if (totalCategoriesEl) totalCategoriesEl.textContent = categories.size;
}

function applyFilters() {
    const searchTerm = document.getElementById("searchInput")?.value.toLowerCase() || "";
    const yearFilter = document.getElementById("yearFilter")?.value || "";
    const monthFilter = document.getElementById("monthFilter")?.value || "";
    const statusFilter = document.getElementById("statusFilter")?.value || "";
    const categoryFilter = document.getElementById("categoryFilter")?.value || "";
    const minAmount = parseFloat(document.getElementById("minAmount")?.value || "0");
    const maxAmount = parseFloat(document.getElementById("maxAmount")?.value || "999999");
    const dueDateFrom = document.getElementById("dueDateFrom")?.value || "";
    const dueDateTo = document.getElementById("dueDateTo")?.value || "";
    const sortBy = document.getElementById("sortBy")?.value || "dueDate-asc";
    
    filteredBills = allBills.filter(bill => {
        const matchesSearch = !searchTerm || 
            bill.title.toLowerCase().includes(searchTerm) || 
            (bill.category && bill.category.toLowerCase().includes(searchTerm));
        
        const matchesYear = !yearFilter || yearFilter === "All Years" ||
            (bill.dueDate && new Date(bill.dueDate).getFullYear().toString() === yearFilter);
        
        const matchesMonth = !monthFilter || monthFilter === "All Months" ||
            (bill.dueDate && new Date(bill.dueDate).toLocaleString('default', { month: 'long' }) === monthFilter);
        
        const matchesStatus = !statusFilter || statusFilter === "All Statuses" ||
            bill.status === statusFilter;
        
        const matchesCategory = !categoryFilter || categoryFilter === "All Categories" ||
            bill.category === categoryFilter;
        
        const billAmount = parseFloat(bill.amount || 0);
        const matchesAmount = billAmount >= minAmount && billAmount <= maxAmount;
        
        let matchesDateRange = true;
        if (bill.dueDate) {
            const billDate = new Date(bill.dueDate);
            if (dueDateFrom) {
                const fromDate = new Date(dueDateFrom);
                if (billDate < fromDate) matchesDateRange = false;
            }
            if (dueDateTo) {
                const toDate = new Date(dueDateTo);
                if (billDate > toDate) matchesDateRange = false;
            }
        }
        
        return matchesSearch && matchesYear && matchesMonth && matchesStatus && matchesCategory && matchesAmount && matchesDateRange;
    });
    
    // Apply sorting
    applySorting(sortBy);
    
    currentPage = 1;
    renderBills();
    updateActiveFilters();
}

function applySorting(sortBy) {
    const [field, direction] = sortBy.split('-');
    
    filteredBills.sort((a, b) => {
        let aVal, bVal;
        
        if (field === 'dueDate') {
            aVal = new Date(a.dueDate || '9999-12-31');
            bVal = new Date(b.dueDate || '9999-12-31');
        } else if (field === 'amount') {
            aVal = parseFloat(a.amount || 0);
            bVal = parseFloat(b.amount || 0);
        } else if (field === 'title') {
            aVal = a.title.toLowerCase();
            bVal = b.title.toLowerCase();
        }
        
        if (direction === 'asc') {
            return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
        } else {
            return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
        }
    });
}

function updateActiveFilters() {
    const container = document.getElementById("activeFilters");
    if (!container) return;
    
    const filters = [];
    const searchVal = document.getElementById("searchInput")?.value;
    const minAmt = document.getElementById("minAmount")?.value;
    const maxAmt = document.getElementById("maxAmount")?.value;
    const dateFrom = document.getElementById("dueDateFrom")?.value;
    const dateTo = document.getElementById("dueDateTo")?.value;
    const year = document.getElementById("yearFilter")?.value;
    const month = document.getElementById("monthFilter")?.value;
    const status = document.getElementById("statusFilter")?.value;
    const category = document.getElementById("categoryFilter")?.value;
    
    if (searchVal) filters.push(`Search: "${searchVal}"`);
    if (minAmt) filters.push(`Min: $${parseFloat(minAmt).toFixed(2)}`);
    if (maxAmt && maxAmt !== "999999") filters.push(`Max: $${parseFloat(maxAmt).toFixed(2)}`);
    if (dateFrom) filters.push(`From: ${new Date(dateFrom).toLocaleDateString()}`);
    if (dateTo) filters.push(`To: ${new Date(dateTo).toLocaleDateString()}`);
    if (year && year !== "All Years") filters.push(`Year: ${year}`);
    if (month && month !== "All Months") filters.push(`${month}`);
    if (status && status !== "All Statuses") filters.push(`Status: ${status}`);
    if (category && category !== "All Categories") filters.push(`Category: ${category}`);
    
    if (filters.length === 0) {
        container.innerHTML = "";
        return;
    }
    
    container.innerHTML = `
        <div class="flex flex-wrap gap-2">
            <span class="text-xs font-bold text-outline uppercase tracking-wider">Active Filters:</span>
            ${filters.map(f => `<span class="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-semibold">${f}</span>`).join('')}
        </div>
    `;
}

function clearAllFilters() {
    document.getElementById("searchInput").value = "";
    document.getElementById("yearFilter").value = "All Years";
    document.getElementById("monthFilter").value = "All Months";
    document.getElementById("statusFilter").value = "All Statuses";
    document.getElementById("categoryFilter").value = "All Categories";
    document.getElementById("minAmount").value = "";
    document.getElementById("maxAmount").value = "";
    document.getElementById("dueDateFrom").value = "";
    document.getElementById("dueDateTo").value = "";
    document.getElementById("sortBy").value = "dueDate-asc";
    
    applyFilters();
}

function renderBills() {
    const table = document.getElementById("billsTable");
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const billsToShow = filteredBills.slice(start, end);
    
    table.innerHTML = "";
    
    if (billsToShow.length === 0) {
        table.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 30px; color: #718096;">No bills match the current filters.</td></tr>';
        updatePagination();
        return;
    }

    billsToShow.forEach(bill => {
        const row = document.createElement("tr");
        row.className = "group hover:bg-surface-container-low transition-colors";
        
        const formattedDate = bill.dueDate ? new Date(bill.dueDate).toLocaleDateString() : "N/A";
        const statusClass = getStatusClass(bill.status);
        const statusBadge = getStatusBadge(bill.status);
        const icon = getCategoryIcon(bill.category);

        row.innerHTML = `
            <td class="px-8 py-6">
                <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center text-teal-800">
                        <span class="material-symbols-outlined">${icon}</span>
                    </div>
                    <div>
                        <p class="font-bold text-on-surface">${bill.title}</p>
                        <p class="text-xs text-outline">${bill.category || 'N/A'}</p>
                    </div>
                </div>
            </td>
            <td class="px-6 py-6">
                <span class="px-3 py-1 bg-surface-container-high rounded-full text-[11px] font-semibold text-on-surface-variant">${bill.category || 'N/A'}</span>
            </td>
            <td class="px-6 py-6 text-right">
                <p class="font-headline font-bold text-lg">$${parseFloat(bill.amount).toFixed(2)}</p>
            </td>
            <td class="px-6 py-6">
                <p class="text-sm font-medium">${formattedDate}</p>
            </td>
            <td class="px-6 py-6">
                ${statusBadge}
            </td>
            <td class="px-8 py-6 text-right">
                <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a href="/bill-form?id=${bill.id}" class="p-2 hover:bg-white rounded-lg text-outline-variant hover:text-teal-700 transition-colors">
                        <span class="material-symbols-outlined text-[20px]" data-icon="edit">edit</span>
                    </a>
                    <a href="/bill-details?id=${bill.id}" class="p-2 hover:bg-white rounded-lg text-outline-variant hover:text-teal-700 transition-colors">
                        <span class="material-symbols-outlined text-[20px]" data-icon="visibility">visibility</span>
                    </a>
                    <button onclick="deleteBill(${bill.id})" class="p-2 hover:bg-white rounded-lg text-outline-variant hover:text-error transition-colors">
                        <span class="material-symbols-outlined text-[20px]" data-icon="delete">delete</span>
                    </button>
                </div>
            </td>
        `;
        table.appendChild(row);
    });
    
    updatePagination();
}

function getCategoryIcon(category) {
    const icons = {
        'Utilities': 'bolt',
        'Mortgage': 'house',
        'Subscriptions': 'wifi',
        'Insurance': 'directions_car'
    };
    return icons[category] || 'receipt_long';
}

function getStatusClass(status) {
    switch (status) {
        case 'PAID': return 'paid';
        case 'UNPAID': return 'unpaid';
        case 'OVERDUE': return 'overdue';
        default: return 'unpaid';
    }
}

function getStatusBadge(status) {
    const badges = {
        'PAID': '<span class="px-4 py-1.5 bg-emerald-100 text-teal-800 rounded-full text-xs font-bold flex items-center gap-1.5 w-fit"><span class="w-1.5 h-1.5 rounded-full bg-teal-600"></span>Paid</span>',
        'UNPAID': '<span class="px-4 py-1.5 bg-secondary-fixed text-on-secondary-fixed-variant rounded-full text-xs font-bold flex items-center gap-1.5 w-fit"><span class="w-1.5 h-1.5 rounded-full bg-secondary"></span>Upcoming</span>',
        'OVERDUE': '<span class="px-4 py-1.5 bg-error-container text-on-error-container rounded-full text-xs font-bold flex items-center gap-1.5 w-fit"><span class="w-1.5 h-1.5 rounded-full bg-error"></span>Overdue</span>'
    };
    return badges[status] || badges['UNPAID'];
}

function updatePagination() {
    const totalRecords = filteredBills.length;
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, totalRecords);
    
    document.getElementById("showingStart").textContent = start;
    document.getElementById("showingEnd").textContent = end;
    document.getElementById("totalRecords").textContent = totalRecords;
    document.getElementById("currentPage").textContent = currentPage;
    
    const nextPageBtn = document.getElementById("nextPageBtn");
    if (nextPageBtn) {
        nextPageBtn.textContent = currentPage + 1;
        nextPageBtn.style.display = end < totalRecords ? 'block' : 'none';
    }
    
    // Enable/disable prev/next buttons
    const prevBtn = document.getElementById("prevPage");
    const nextBtn = document.getElementById("nextPage");
    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = end >= totalRecords;
}

function deleteBill(id) {
    if (confirm("Are you sure you want to delete this bill?")) {
        fetch(`/bills/${id}`, { method: "DELETE" })
            .then(() => {
                alert("Bill deleted successfully!");
                loadBills();
            })
            .catch(err => {
                console.error("Error deleting bill:", err);
                alert("Failed to delete bill");
            });
    }
}

// Event listeners for filters
document.addEventListener('DOMContentLoaded', function() {
    loadBills();
    
    // Filter event listeners
    ['searchInput', 'yearFilter', 'monthFilter', 'statusFilter', 'categoryFilter', 'minAmount', 'maxAmount', 'dueDateFrom', 'dueDateTo', 'sortBy'].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', applyFilters);
            element.addEventListener('change', applyFilters);
        }
    });
    
    // Pagination
    document.getElementById("prevPage")?.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderBills();
        }
    });
    
    document.getElementById("nextPage")?.addEventListener('click', () => {
        const totalPages = Math.ceil(filteredBills.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderBills();
        }
    });
});
        