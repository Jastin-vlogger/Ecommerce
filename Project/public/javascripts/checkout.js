
        var el = document.getElementById("wrapper");
        var toggleButton = document.getElementById("menu-toggle");
        let myChart = document.getElementById('myChart')
        let Charts = document.getElementById('Chart')
        let chartz = document.getElementById('Chartz')


        toggleButton.onclick = function () {
            el.classList.toggle("toggled");
        };


        fetch('/admin/dashboard/day', {
            method: 'get',
        }).then((val) => val.json())
            .then((data) => {
                // console.log(data);
                let xaxis = []
                let countss = []
                for (const val of data) {
                    let date = `${val.detail.day}/${val.detail.month}/${val.detail.year}`
                    xaxis.push(date)
                    countss.push(val.count)
                }

                const masspopChart = new Chart(myChart, {
                    type: 'bar',
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
            })


        fetch('/admin/dashboard/month', {
            method: "get",
        }).then(data => data.json()).then((data) => {
            console.log(data);

            let xaxis = []
            let countss = [] 
            var months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
            for (const val of data) {
                let month= `${val.detail.month}`
                let m = months[month]
                xaxis.push(m)
                countss.push(val.count)
            }

            const masspopChart = new Chart(chartz, {
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
                type: 'pie',
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
   