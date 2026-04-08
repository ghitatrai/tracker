const API_URL = "http://localhost:8081/bills";

const API = {
    getDashboardData: () => {
        return fetch('/bills/dashboard')
            .then(res => res.json())
            .catch(err => {
                console.error('Dashboard API error:', err);
                return { totalThisMonth: 0, totalThisYear: 0, unpaid: 0, upcoming: [] };
            });
    },

    getAnalyticsData: () => {
        return Promise.resolve({
            monthly: [100, 200, 150, 300, 250, 180, 220, 300, 280, 350, 320, 400],
            lastYear: [80, 180, 130, 250, 200, 150, 180, 250, 220, 280, 260, 350],
            categories: {
                labels: ["Rent", "Food", "Utilities", "Transportation"],
                values: [500, 300, 200, 150]
            }
        });
    }
};

// GET all
async function getBills() {
    const res = await fetch(API_URL);
    return res.json();
}

// GET by ID
async function getBill(id) {
    const res = await fetch(`${API_URL}/${id}`);
    return res.json();
}

// CREATE
async function createBill(bill) {
    return fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bill)
    });
}

// UPDATE
async function updateBill(id, bill) {
    return fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bill)
    });
}

// DELETE
async function deleteBill(id) {
    return fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    });
}