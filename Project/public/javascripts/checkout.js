
var el = document.getElementById("wrapper");
var toggleButton = document.getElementById("menu-toggle");
let myChart = document.getElementById('myChart')
let Charts = document.getElementById('Chart')
let chartz = document.getElementById('Chartz')
// let form = document.getElementById('checkoutform')
let catchart = document.getElementById('CategoryChartz')

toggleButton.onclick = function () {
    el.classList.toggle("toggled");
};




fetch('/admin/dashboard/day', {
    method: 'get',
}).then((val) => val.json())
    .then((data) => {
        console.log(data);
        let xaxis = []
        let countss = []
        for (const val of data) {
            let date = `${val.detail.day}/${val.detail.month}/${val.detail.year}`
            xaxis.push(date)
            countss.push(val.count)
        }

        const masspopChart = new Chart(myChart, {
            type: 'line',
            data: {
                labels: [...xaxis],
                datasets: [{
                    label: 'Number of orders',
                    data: [...countss],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(245, 125, 75, 1.2)',
                        'rgb(255, 99, 132)',
                        'rgb(54, 162, 235)',
                        'rgb(255, 205, 86)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        })

        // Get the chart's base64 image string
        var image = masspopChart.toBase64Image();
        console.log(image);

        document.getElementById('btn-download').onclick = function () {
            // Trigger the download
            var a = document.createElement('a');
            a.href = masspopChart.toBase64Image();
            a.download = 'my_file_name.png';
            a.click();
        }
    })



fetch('/admin/dashboard/month', {
    method: "get",
}).then(data => data.json()).then((data) => {
    // console.log(data);

    let xaxis = []
    let countss = []
    var months = ['a',"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    for (const val of data) {
        let month = `${val.detail.month}`
        let m = months[month]
        xaxis.push(m)
        countss.push(val.count)
    }

    const masspopChart1 = new Chart(chartz, {
        type: 'bar',
        data: {
            labels: [...xaxis],
            datasets: [{
                label: 'Number of orders in a week',
                data: [...countss],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(245, 125, 75, 1.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    })
    // Get the chart's base64 image string
        var image = masspopChart1.toBase64Image();
        console.log(image);

        document.getElementById('btn-download').onclick = function () {
            // Trigger the download
            var a = document.createElement('a');
            a.href = masspopChart1.toBase64Image();
            a.download = 'my_file_name.png';
            a.click();
        }

})


fetch('/admin/dashboard/week', {
    method: "get",
}).then(data => data.json()).then((data) => {
    // console.log(data);

    let xaxis = []
    let countss = []
    for (const val of data) {
        let week = `${val.detail.week}`
        xaxis.push(week)
        countss.push(val.count)
    }

    const masspopChart = new Chart(Charts, {
        type: 'doughnut',
        data: {
            labels: [...xaxis],
            datasets: [{
                label: 'Number of orders in a week',
                data: [...countss],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(245, 125, 75, 1.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    })

})


fetch('/admin/dashboard/catSalesReport', {
    method: 'get',
}).then((data => data.json())).then((data) => {
    // console.log(data);
    let xaxis = []
    let countss = []
    for (const val of data) {
        let week = `${val.detail.cat}`
        xaxis.push(week)
        countss.push(val.count)
    }

    const masspopChart = new Chart(catchart, {
        type: 'bar',
        data: {
            labels: [...xaxis],
            datasets: [{
                label: 'Category wise',
                data: [...countss],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(245, 125, 75, 1.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    })
})