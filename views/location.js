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