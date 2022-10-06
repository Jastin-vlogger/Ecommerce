function changeQuantity(cartId, proId,userId ,count) {
    let quantity = parseInt(document.getElementById(proId).innerHTML)
    count = parseInt(count)
        $.ajax({
        url: '/change-product-quantity',
        data: {
            cart: cartId,
            product: proId,
            count: count,
            quantity:quantity,
            user:userId,
        },
        method: 'post',
        success: (res) => {
            if (res.removeProduct) { 
                swal.fire({
                    showCancelButton: false, // There won't be any cancel button
                    showConfirmButton: false,
                    title: 'Product has been removed from the cart',
                })
                setTimeout(() => {
                    location.reload()
                }, 2000)
            } else {
                document.getElementById(proId).innerHTML = quantity + count;
                document.getElementById('total').innerHTML = res.total;
                document.getElementById('totals').innerHTML = res.total;
                // document.getElementById('prosingleprice').innerHTML = totalprice;
                //  console.log(res.singleproamount);
            }
        }
    })
}