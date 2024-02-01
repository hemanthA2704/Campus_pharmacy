let listCart = [];
// function checkCart(){
//         var cookieValue = document.cookie
//         .split('; ')
//         .find(row => row.startsWith('listCart='));
//         if(cookieValue){
//             listCart = JSON.parse(cookieValue.split('=')[1]);
//         }
// }
// checkCart();
function addlistCart(){
    var cookieValue = localStorage.getItem('cart');

}
addlistCart();
cookieValue = localStorage.getItem('cart');
console.log((cookieValue.split(',',2)));
// console.log(JSON.parse(localStorage.getItem('cart')));
listCart = [{image: 'images/paracetamol.png',name: "Paracetamol", quantity: 2, price: 200},{image: 'images/cough_syrup.png',name: "Cough Syrup", quantity: 3, price: 100}]
addCartToCheckout();
function addCartToCheckout(){
    // clear data default
    let listCartHTML = document.querySelector('.returnCart .list');
    listCartHTML.innerHTML = '';

    let totalQuantityHTML = document.querySelector('.totalQuantity');
    let totalPriceHTML = document.querySelector('.totalPrice');
    let totalQuantity = 0;
    let totalPrice = 0;
    // if has product in Cart
    if(listCart){
        listCart.forEach(product => {
            if(product){
                let newCart = document.createElement('div');
                newCart.classList.add('item');
                newCart.innerHTML = 
                    `<img src="${product.image}">
                    <div class="info">
                        <div class="name">${product.name}</div>
                        <div class="price">₹${product.price}/1 product</div>
                    </div>
                    <div class="quantity">${product.quantity}</div>
                    <div class="returnPrice">₹${product.price * product.quantity}</div>`;
                listCartHTML.appendChild(newCart);
                totalQuantity = totalQuantity + product.quantity;
                totalPrice = totalPrice + (product.price * product.quantity);
            }
        })
    }
    totalQuantityHTML.innerText = totalQuantity;
    totalPriceHTML.innerText = '₹' + totalPrice;
}
document.getElementById('residence').addEventListener('change', function() {
    // Get the selected residence value
    var selectedResidence = this.value;

    // Get the "Building" dropdown element
    var buildingDropdown = document.getElementById('building');

    // Remove existing options
    buildingDropdown.innerHTML = '<option value="">Choose..</option>';

    // Add new options based on the selected residence
    if (selectedResidence === 'hostels') {
        var hostelOptions = ['Kanhar Hostel', 'Indravati Hostel', 'Shivnath Hostel'];
        hostelOptions.forEach(function(option) {
            var optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.textContent = option;
            buildingDropdown.appendChild(optionElement);
        });
    }
    if (selectedResidence === 'faculty') {
        var hostelOptions = ["Delta Residence", "Director's Residence"];
        hostelOptions.forEach(function(option) {
            var optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.textContent = option;
            buildingDropdown.appendChild(optionElement);
        });
    }
    if (selectedResidence === 'academic') {
        var hostelOptions = ['Lecture Hall', 'ED1', 'ED2', 'SD1'];
        hostelOptions.forEach(function(option) {
            var optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.textContent = option;
            buildingDropdown.appendChild(optionElement);
        });
    }
    // Add other conditions for different residences if needed
});
document.getElementById('locate-address').addEventListener('click', function () {
// Check if the Geolocation API is supported by the browser
if (navigator.geolocation) {
    // Request permission to access the user's location
    navigator.geolocation.getCurrentPosition(
        function (position) {
            // Get the latitude and longitude from the position object
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            // Now, you can use the obtained latitude and longitude as needed
            console.log("Latitude: " + latitude + ", Longitude: " + longitude);

            // You can update the input field with the obtained coordinates
            document.getElementById('address').value = `Latitude: ${latitude}, Longitude: ${longitude}`;
        },
        function (error) {
            // Handle errors here, e.g., user denied permission or there was an issue with geolocation
            console.error("Error getting location:", error.message);
        }
    );
} else {
    // Geolocation is not supported by the browser
    console.error("Geolocation is not supported by this browser.");
}
});

