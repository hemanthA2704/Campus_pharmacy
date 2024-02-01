const products = [
    {
        "id": 1,
        "name":" Paracetamol",
        "price": 200,
        "image": "images/paracetamol.png",
        "description": "Paracetamol Tablet belongs to the group of medicines called analgesics (pain killers), and antipyretics (fever-reducing agents) used to reduce fever and treat mild to moderate pain. Also, it is used to relieve headache, migraine, toothache, period pain, back pain, muscle pain and rheumatic pains. Pain and fever are caused by the activation of pain receptors due to the release of certain natural chemicals in the body like prostaglandin. Paracetamol Tablet works by inhibiting the production of certain chemical messengers in the brain known as prostaglandins. Thus, reduces pain. Also, Paracetamol Tablet affects an area of the brain that regulates body temperature known as the hypothalamic heat-regulating centre. Thereby, it reduces fever."
    },
    {
        "id": 2,
        "name":" Cough Syrup",
        "price": 250,
        "image": "images/cough_syrup.png",
        "description": "It is used for the temporary relief of the symptoms of coughs and cold. Helps to ease non-productive coughs, nasal and chest congestion, sneezing and runny nose associated with the common cold and itchy and watery eyes"
    },
    {
        "id": 3,
        "name":" Energy Drink",
        "price": 290,
        "image": "images/energy_drink.png",
        "description": "ORSL® Apple Drink 200 ml is an Electrolyte Drink. It helps restore fluids, electrolytes and energy. This tasty fruit juice-based electrolyte drink is enriched with Vitamin C and 3 vital electrolytes, namely Sodium, Potassium and Chloride. All ORSL® variants are ‘food’ products under the category of ‘Electrolyte Drink’, registered under the FSSAI (Food Safety and Standards Authority of India) regulations. ORSL® range of products helps in the restoration of fluid, electrolytes, and energy. They are NOT intended for the prevention, alleviation, treatment or cure of any disease or disorder. "
    },
    {
        "id": 4,
        "name":" Protein Powder",
        "price": 200,
        "image": "images/protein_powder.png",
        "description": "24 gm of protein per serving helps in building and maintaining your muscle. Contains branched-chain amino acids (BCCAAs) 5.5 gm of BCAAs per serving helps in supporting endurance and recovery. Free from gluten, banned substances, and artificial growth hormones. Can be used during start of the day (30 min after waking up), pre-workout (before workout), post-workout (after workout), and between meals (20-40 gm per meal)"
    },
    {
        "id": 5,
        "name":" Skin Cream",
        "price": 300,
        "image": "images/skin_cream.png",
        "description": "Fast absorbing and non-greasy formula. Contains pure oat extracts and micro-droplets of Vaseline Jelly to lock in moisture. Moisturizing body lotion, clinically proven to restore dry skin. Daily body lotion best for: dry skin and rough skin. Suitable for all skin types"
    },
    {
        "id": 6,
        "name":" Hand Sanitizer",
        "price": 200,
        "image": "images/hand_sanitizer.png",
        "description": "Experience the optimal on-the-go protection with Dettol Instant Hand Sanitizer, which is the ultimate solution for keeping your hands clean and germ-free anytime, anywhere. This powerful sanitiser kills 99.9% of germs without the need for water, making it perfect for those moments when you cannot access a sink. Whether you are travelling, commuting, or simply out and about, this sanitiser is your go-to defence against harmful bacteria and viruses. One of the standout features of Dettol Instant Hand Sanitizer is its rinse-free and non-sticky formula. Unlike traditional hand sanitisers, this product leaves your hands feeling clean, refreshed and residue-free. Its quick-drying formula ensures that you can get back to your daily activities without any inconvenience. With Dettol sanitiser, you can trust that you are providing your hands with the best protection against germs."
    },
    {
        "id": 7,
        "name":" Face Mask",
        "price": 200,
        "image": "images/face_mask.png",
        "description": "This mask is made of 100% ultra-light weight cotton fabric, making it soft and comfortable to your face, can be used for the whole day for easy breathing. ANTI-DUST & ANTI BACTERIA : Wearing this face mask, you could be protected from dust, bacteria small particles on-air, pollen, and much more. Anti-dust, Anti-odor. Comfortable : The ear loop of our cotton face mask is very comfortable which reduces irritation around ears"    
    },
    {
        "id": 8,
        "name":" Band Aid",
        "price": 200,
        "image": "images/band_aid.png",
        "description": "Introducing Hansaplast Regular Breathable Fabric Strips, the perfect solution for all your minor cut and wound care needs. With its regular size and breathable fabric, these strips provide effective protection and promote quick healing. Each pack contains 10 strips, ensuring you have an ample supply to address any unexpected cuts or wounds. The regular size of Hansaplast band aid makes them versatile and suitable for use on various parts of the body. Whether it's a small scrape on your knee or a cut on your finger, Hansaplast Regular Breathable Fabric Strips have got you covered. What sets these fabric strips apart is their breathable design. The fabric allows air to reach the wound, creating an optimal environment for faster healing. Say goodbye to those uncomfortable, sticky bandages that trap moisture and prolong the healing process. With Hansaplast Regular bandage, you can experience the benefits of improved airflow while ensuring superior protection for your wounds. Do not let minor cuts and wounds slow you down. Trust Hansaplast Regular bandage to provide effective protection and support speedy healing. Stock up on this essential first aid item today and be prepared for any unexpected mishaps that come your way."  
    }

];
const cart = () => {
    let listCartHTML = document.querySelector('.listCart');
    let iconCart = document.querySelector('.icon-cart');
    let iconCartSpan = iconCart.querySelector('span');
    let body = document.querySelector('body');
    let closeCart = document.querySelector('.close');
    let cart = [];

    // open and close tab
    iconCart.addEventListener('click', () => {
        body.classList.toggle('activeTabCart');
    })
    closeCart.addEventListener('click', () => {
        body.classList.toggle('activeTabCart');
    })

    const setProductInCart = (idProduct, value) => {
        let positionThisProductInCart = cart.findIndex((value) => value.product_id == idProduct);
        if(value <= 0){
            cart.splice(positionThisProductInCart, 1);
        }else if(positionThisProductInCart < 0){
            cart.push({
                product_id: idProduct,
                quantity: 1
            });
        }else{
            cart[positionThisProductInCart].quantity = value;
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        addCartToHTML();
    }

    const addCartToHTML = () => {
        listCartHTML.innerHTML = '';
        let totalQuantity = 0;
        if(cart.length > 0){
            cart.forEach(item => {
                totalQuantity = totalQuantity +  item.quantity;
                let newItem = document.createElement('div');
                newItem.classList.add('item');
                newItem.dataset.id = item.product_id;
    
                let positionProduct = products.findIndex((value) => value.id == item.product_id);
                let info = products[positionProduct];
                listCartHTML.appendChild(newItem);
                newItem.innerHTML = `
                <div class="image">
                        <img src="${info.image}">
                    </div>
                    <div class="name">
                    ${info.name}
                    </div>
                    <div class="totalPrice">₹${info.price * item.quantity}</div>
                    <div class="quantity">
                        <span class="minus" data-id="${info.id}">-</span>
                        <span>${item.quantity}</span>
                        <span class="plus" data-id="${info.id}">+</span>
                    </div>
                `;
            })
        }
        iconCartSpan.innerText = totalQuantity;
    }

    document.addEventListener('click', (event) => {
        let buttonClick = event.target;
        let idProduct = buttonClick.dataset.id;
        let quantity = null;
        let positionProductInCart = cart.findIndex((value) => value.product_id == idProduct);
        switch (true) {
            case (buttonClick.classList.contains('addCart')):
                quantity = (positionProductInCart < 0) ? 1 : cart[positionProductInCart].quantity+1;
                setProductInCart(idProduct, quantity);
                break;
            case (buttonClick.classList.contains('minus')):
                quantity = cart[positionProductInCart].quantity-1;
                setProductInCart(idProduct, quantity);
                break;
            case (buttonClick.classList.contains('plus')):
                quantity = cart[positionProductInCart].quantity+1;
                setProductInCart(idProduct, quantity);
                break;
            default:
                break;
        }
    })

    const initApp = () => {
        
    if(localStorage.getItem('cart')){
        cart = JSON.parse(localStorage.getItem('cart'));
        addCartToHTML();
    }
    }
    initApp();
}


cart() ;


document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("search");
    const locateButton = document.getElementById("locate");

    // Search feature (You may customize this based on your needs)
    searchInput.addEventListener("input", function () {
        const searchTerm = this.value.trim().toLowerCase();
        // Implement your search logic here
        // You may filter or highlight relevant content based on the search term
    });

    // Location detection feature
    locateButton.addEventListener("click", function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    // Implement your logic to use the detected location
                    alert(`Your current location: Latitude ${latitude}, Longitude ${longitude}`);
                },
                function (error) {
                    console.error("Error getting location:", error.message);
                    alert("Unable to get your current location. Please check your browser settings.");
                }
            );
        } else {
            alert("Geolocation is not supported by your browser.");
        }
    });
});