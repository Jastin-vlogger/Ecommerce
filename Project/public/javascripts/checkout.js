
        var el = document.getElementById("wrapper");
        var toggleButton = document.getElementById("menu-toggle");
        let myChart = document.getElementById('myChart')
        let Charts = document.getElementById('Chart')
        let chartz = document.getElementById('Chartz')
        // let form = document.getElementById('checkoutform')

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


        // function addcoupon() {
        //     let total = document.getElementById('sum').value
        //     let promo = document.getElementById('promocode')
        //     let coupon = document.getElementById('couponvalue')
        //     $.ajax({
        //         url: '/checkpromo',
        //         method: 'post',
        //         data: { promo: promo.value},
        //         success: (response) => {
        //             console.log(response);
        //             if (response.status == false) {
        //                 let error = document.getElementById('msg')
        //                 error.innerHTML = 'Enter valid Promocode'
        //             } else {
        //                 let a = document.getElementById('total').innerHTML =total - response.discount;
        //                 coupon.value = a
        //             }
        //         }
        //     })
        //     }

           


            // function addtofields(firstname, lastname, address, town, pin) {
            //     let firstnames = document.getElementById('firstName').value = firstname
            //     let lastnames = document.getElementById('lastName').value = lastname
            //     let addresses = document.getElementById('address').value = address
            //     let stateinfo = document.getElementById('state').value = town
            //     let pincode = document.getElementById('pin').value = pin
            // }

            // function razorPayment(order) {
            //     var options = {
            //         "key": "rzp_test_kC80uilJbJoVnc", // Enter the Key ID generated from the Dashboard
            //         "amount": order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            //         "currency": "INR",
            //         "name": "Jastin",
            //         "description": "Test Transaction",
            //         "image": "https://example.com/your_logo",
            //         "order_id": order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
            //         "handler": (response) => {
            //             verifyPayment(response, order)
            //         },
            //         "prefill": {
            //             "name": "Gaurav Kumar",
            //             "email": "gaurav.kumar@example.com",
            //             "contact": "9999999999"
            //         },
            //         "notes": {
            //             "address": "Razorpay Corporate Office"
            //         },
            //         "theme": {
            //             "color": "#3399cc"
            //         }
            //     };
            //     var rzp1 = new Razorpay(options);
            //     rzp1.open();
            // }

            // function verifyPayment(payment, order) {
            //     console.log(payment, order);
            //     $.ajax({
            //         url: '/verify-payment',
            //         data: {
            //             payment,
            //             order,
            //         },
            //         method: 'post',
            //         success: (response) => {
            //             console.log(response);
            //             if (response.status) {
            //                 location.href = '/order-placed'
            //             } else {
            //                 alert('payment failed')
            //             }
            //         }
            //     })
            // }

            // function displayCheckout() {
            //     let list1 = document.getElementById("checkout-button").classList
            //     let list2 = document.getElementById("paypal-button-container").classList;
            //     list1.add('disbtn')
            //     list2.remove('disbtn')
            // }

            // function displayPaypal() {
            //     let list1 = document.getElementById("checkout-button").classList
            //     let list2 = document.getElementById("paypal-button-container").classList;
            //     list1.remove('disbtn')
            //     list2.add('disbtn')

            // }
   