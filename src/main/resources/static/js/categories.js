console.log("Categories.js loaded");

function loadCategories() {
    console.log("Loading categories...");
    fetch("/bills")
        .then(res => {
            if (!res.ok) throw new Error("HTTP " + res.status);
            return res.json();
        })
        .then(bills => {
            console.log("Bills for categories:", bills);
            const categoryCounts = {
                "Rent": 0,
                "Utilities": 0,
                "Internet": 0,
                "Food": 0,
                "Transportation": 0,
                "Healthcare": 0,
                "Entertainment": 0,
                "Other": 0
            };

            bills.forEach(bill => {
                const category = bill.category || "Other";
                if (categoryCounts.hasOwnProperty(category)) {
                    categoryCounts[category]++;
                }
            });

            console.log("Category counts:", categoryCounts);
            
            Object.keys(categoryCounts).forEach(category => {
                const countId = category.toLowerCase().replace(/ /g, "") + "Count";
                const count = categoryCounts[category];
                const element = document.getElementById(countId);
                if (element) {
                    element.textContent = `${count} bill${count !== 1 ? "s" : ""}`;
                } else {
                    console.warn("Element not found:", countId);
                }
            });
        })
        .catch(err => {
            console.error("Error loading categories:", err);
            alert("Error loading categories: " + err.message);
        });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadCategories);
} else {
    loadCategories();
}
