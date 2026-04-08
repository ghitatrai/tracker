API.getDashboardData().then(data => {
    document.getElementById("totalMonth").innerText = data.totalThisMonth;
    document.getElementById("totalYear").innerText = data.totalThisYear;
    document.getElementById("unpaid").innerText = data.unpaid;

    const list = document.getElementById("upcomingList");
    data.upcoming.forEach(bill => {
        const li = document.createElement("li");
        li.textContent = `${bill.title} - ${bill.amount}`;
        list.appendChild(li);
    });
});