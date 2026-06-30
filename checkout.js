const SCRIPT_URL =
"https://script.google.com/macros/s/YOUR_GOOGLE_SCRIPT_ID/exec";

const itemsContainer = document.getElementById("checkoutItems");
const subtotalEl = document.getElementById("subtotal");
const grandTotalEl = document.getElementById("grandTotal");
const placeOrderBtn = document.getElementById("placeOrderBtn");
const checkoutMessage = document.getElementById("checkoutMessage");

let cart = JSON.parse(localStorage.getItem("ZEE_CART")) || [];

function currency(value){
    return "K" + value.toFixed(2);
}

function renderSummary(){

    if(cart.length===0){

        itemsContainer.innerHTML=`
        <p class="empty-cart-message">
            Your cart is empty.
        </p>`;

        subtotalEl.textContent="K0";
        grandTotalEl.textContent="K0";
        placeOrderBtn.disabled=true;

        return;
    }

    let total=0;

    itemsContainer.innerHTML="";

    cart.forEach(item=>{

        total+=item.qty*item.price;

        itemsContainer.innerHTML+=`

        <div class="checkout-item">

            <div>

                <strong>${item.name}</strong>

                <p>${item.qty} × ${currency(item.price)}</p>

            </div>

            <strong>

                ${currency(item.qty*item.price)}

            </strong>

        </div>

        `;

    });

    subtotalEl.textContent=currency(total);

    grandTotalEl.textContent=currency(total);

}

renderSummary();

async function submitOrder(){

    if(cart.length===0){

        alert("Your cart is empty.");

        return;

    }

    const name=document.getElementById("customerName").value.trim();

    const phone=document.getElementById("customerPhone").value.trim();

    if(name===""||phone===""){

        alert("Please enter your name and phone number.");

        return;

    }

    placeOrderBtn.disabled=true;

    placeOrderBtn.innerHTML="Submitting Order...";

    const delivery=document.querySelector(
        'input[name="delivery"]:checked'
    ).value;

    const payment=document.querySelector(
        'input[name="payment"]:checked'
    ).value;

    const order={

        customerName:name,

        phone:phone,

        email:document.getElementById("customerEmail").value,

        notes:document.getElementById("customerNotes").value,

        paymentReference:
        document.getElementById("paymentRef").value,

        deliveryMethod:delivery,

        paymentMethod:payment,

        items:cart,

        total:grandTotalEl.textContent,

        created:new Date().toISOString()

    };

    try{

        await fetch(SCRIPT_URL,{

            method:"POST",

            mode:"no-cors",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify(order)

        });

        localStorage.removeItem("ZEE_CART");

        checkoutMessage.innerHTML=`
        <div class="success-message">

        <i class="fa-solid fa-circle-check"></i>

        <h3>Order Received!</h3>

        <p>

        Thank you for ordering from
        Zee's Sweet Treats.

        We will contact you shortly to
        confirm your order.

        </p>

        </div>
        `;

        setTimeout(()=>{

            window.location.href="success.html";

        },2000);

    }

    catch(e){

        checkoutMessage.innerHTML=`
        <div class="error-message">

        Something went wrong.

        Please try again.

        </div>
        `;

        placeOrderBtn.disabled=false;

        placeOrderBtn.innerHTML=`
        Place Order
        <i class="fa-solid fa-arrow-right"></i>
        `;

    }

}

placeOrderBtn.addEventListener("click",submitOrder);
