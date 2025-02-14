document.addEventListener("DOMContentLoaded", function() {
    // Tanay, Rizal center and bounds
    var tanayCenter = [14.498230, 121.285389]; // Approximate center of the defined area
    var minZoomLevel = window.innerWidth <= 768 ? 16 : 17; // Set lower minZoom for mobile devices

    var map = L.map('map', {
        center: tanayCenter,
        zoom: 18,            // Initial zoom level for a closer view of the area
        maxZoom: 18,         // Max zoom to keep focus on Tanay
        minZoom: minZoomLevel, // Adjust minZoom based on device
        // maxBounds: [         // Restrict the view to these bounds
        //     [14.487523, 121.274111],  // Southwest corner of the defined area
        //     [14.513158, 121.296611]   // Northeast corner of the defined area
        // ],
        maxBoundsViscosity: 1.0,  // Makes the boundaries hard to cross
        bounceAtZoomLimits: false // Prevents snapping back when hitting the boundary
    });

    L.tileLayer('https://api.maptiler.com/maps/basic/{z}/{x}/{y}.png?key=xZL9GQgnbzaUJBDNErxW', {
        attribution: '&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a>',
    }).addTo(map);

    // Utility function to handle toggle logic
    function setupToggle(buttonId, targetId, scaledClass) {
        const button = document.getElementById(buttonId);
        const target = document.getElementById(targetId);

        if (!button || !target) {
            console.error(`Elements with IDs ${buttonId} or ${targetId} not found.`);
            return;
        }

        // Initially hide the target element
        target.classList.remove("visible");

        // Toggle visibility and scaling on button click
        button.addEventListener("click", function () {
            target.classList.toggle("visible");
            button.classList.toggle(scaledClass);
        });

        // Close the target when clicking outside of it
        document.addEventListener("click", function (event) {
            const isClickInside = target.contains(event.target);
            const isClickOnButton = button.contains(event.target);

            if (!isClickInside && !isClickOnButton && target.classList.contains("visible")) {
                target.classList.remove("visible");
                button.classList.remove(scaledClass);
            }
        });
    }

    // Setup toggle logic for sidebar and help tab
    setupToggle("toggleSidebar", "sidebar", "scaled");
    setupToggle("toggleHelp1", "helpTab1", "scaled");
    setupToggle("toggleHelp2", "helpTab2", "scaled");

    const searchInput = document.getElementById('searchInput');
    const searchResultsDiv = document.getElementById('searchResults');
    const searchInput2 = document.getElementById('searchInput2');
    const searchResultsDiv2 = document.getElementById('searchResults2');

    // Function to zoom to and reveal a specific location
    function zoomToLocation(lat, lng, name, type) {
        map.setView([lat, lng], 18); // Adjust zoom level as needed

        // Add a temporary marker to highlight the location
        const tempMarker = L.marker([lat, lng], {
            icon: type === "worship" ? worshipIcon :
                type === "school" ? schoolIcon :
                type === "store" ? storeIcon :
                type === "supermarket" ? supermarketIcon :
                type === "hospital" ? hospitalIcon :
                type === "vet" ? vetIcon :
                type === "police" ? policeIcon :
                type === "fire" ? fireIcon :
                type == "gas" ? gasIcon :
                type == "brgyhall" ? brgyhallIcon :
                type == "bank" ? bankIcon :
                type == "vulcanize" ? vulcanizeIcon :
                type == "inn" ? innIcon :
                type == "terminal" ? terminalIcon : 
                dinerIcon // Default to dinerIcon
        }).bindPopup(`<strong>${name}</strong>`).addTo(map);

        // Open popup
        tempMarker.openPopup();

        // Optionally remove the marker after a few seconds
        setTimeout(() => {
            map.removeLayer(tempMarker);
        }, 5000); // Adjust timing as necessary
    }

    // Attach event listener to search results // Only on desktop view
    searchInput.addEventListener('input', async function () {
        const query = searchInput.value.trim();

        if (!query) {
            searchResultsDiv.innerHTML = ''; // Clear results when input is empty
            return;
        }

        try {
            // Fetch search results from the backend
            const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
            const results = await response.json();

            // Clear previous results
            searchResultsDiv.innerHTML = '';

            // Check if results are available
            if (results.length === 0) {
                searchResultsDiv.innerHTML = '<p>No results found.</p>';
                return;
            }

            // Display search results
            results.forEach(result => {
                const resultElement = document.createElement('div');
                resultElement.classList.add('search-result');
                resultElement.innerHTML = `
                    ${result.name}<br>
                `;
                resultElement.addEventListener('click', () => {
                    zoomToLocation(result.latitude, result.longitude, result.name, result.type);
                });
                searchResultsDiv.appendChild(resultElement);
            });
        } catch (error) {
            console.error("Error fetching search results:", error);
        }
    });

    // Attach event listener to search results // Only on Mobile View
    searchInput2.addEventListener('input', async function () {
        const query = searchInput2.value.trim();

        if (!query) {
            searchResultsDiv2.innerHTML = ''; // Clear results when input is empty
            return;
        }

        try {
            // Fetch search results from the backend
            const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
            const results = await response.json();

            // Clear previous results
            searchResultsDiv2.innerHTML = '';

            // Check if results are available
            if (results.length === 0) {
                searchResultsDiv2.innerHTML = '<p>No results found.</p>';
                return;
            }

            // Display search results
            results.forEach(result => {
                const resultElement = document.createElement('div');
                resultElement.classList.add('search-result');
                resultElement.innerHTML = `
                    ${result.name}<br>
                `;
                resultElement.addEventListener('click', () => {
                    zoomToLocation(result.latitude, result.longitude, result.name, result.type);
                });
                searchResultsDiv2.appendChild(resultElement);
            });
        } catch (error) {
            console.error("Error fetching search results:", error);
        }
    });

    // Custom icons
    const dinerIcon = L.icon({
        iconUrl: 'poi/diner.png',
        iconSize: [32, 32], // Size of the icon
        iconAnchor: [16, 32], // Point of the icon which will correspond to marker's location
        popupAnchor: [0, -32] // Point from which the popup should open relative to the iconAnchor
    });

    const schoolIcon = L.icon({
        iconUrl: 'poi/school.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    });

    const hospitalIcon = L.icon({
        iconUrl: 'poi/hospital.png',
        iconSize: [32, 32], // Size of the icon
        iconAnchor: [16, 32], // Point of the icon which will correspond to marker's location
        popupAnchor: [0, -32] // Point from which the popup should open relative to the iconAnchor
    });

    const supermarketIcon = L.icon({
        iconUrl: 'poi/supermarket.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    });

    const storeIcon = L.icon({
        iconUrl: 'poi/store.png',
        iconSize: [32, 32], // Size of the icon
        iconAnchor: [16, 32], // Point of the icon which will correspond to marker's location
        popupAnchor: [0, -32] // Point from which the popup should open relative to the iconAnchor
    });

    const fireIcon = L.icon({
        iconUrl: 'poi/fire.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    });

    const policeIcon = L.icon({
        iconUrl: 'poi/police.png',
        iconSize: [32, 32], // Size of the icon
        iconAnchor: [16, 32], // Point of the icon which will correspond to marker's location
        popupAnchor: [0, -32] // Point from which the popup should open relative to the iconAnchor
    });

    const vetIcon = L.icon({
        iconUrl: 'poi/vet.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    });

    const gasIcon = L.icon({
        iconUrl: 'poi/gas.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    });

    const worshipIcon = L.icon({
        iconUrl: 'poi/worship.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    });

    const brgyhallIcon = L.icon({
        iconUrl: 'poi/hall.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    });

    const bankIcon = L.icon({
        iconUrl: 'poi/bank.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    });

    const vulcanizeIcon = L.icon({
        iconUrl: 'poi/vulcanize.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    });

    const terminalIcon = L.icon({
        iconUrl: 'poi/terminal.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    });

    const innIcon = L.icon({
        iconUrl: 'poi/inn.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    });

    const dinerMarkers = [];
    const schoolMarkers = [];
    const hospitalMarkers = [];
    const supermarketMarkers = [];
    const storeMarkers = [];
    const fireMarkers = [];
    const policeMarkers = [];
    const vetMarkers = [];
    const gasMarkers = [];
    const worshipMarkers = [];
    const brgyhallMarkers = [];
    const bankMarkers = [];
    const vulcanizeMarkers = [];
    const terminalMarkers = [];
    const innMarkers = [];

    // Function to add markers
    function addMarkers(type) {
        fetch(`/api/locations?type=${type}`)
            .then(response => response.json())
            .then(data => {
                data.forEach(loc => {
                    let icon;
                    switch (type) {
                        case 'diner':
                            icon = dinerIcon;
                            break;
                        case 'school':
                            icon = schoolIcon;
                            break;
                        case 'hospital':
                            icon = hospitalIcon;
                            break;
                        case 'supermarket':
                            icon = supermarketIcon;
                            break;
                        case 'store':
                            icon = storeIcon;
                            break;
                        case 'fire':
                            icon = fireIcon;
                            break;
                        case 'police':
                            icon = policeIcon;
                            break;
                        case 'vet':
                            icon = vetIcon;
                            break;
                        case 'gas':
                            icon = gasIcon;
                            break;
                        case 'worship':
                            icon = worshipIcon;
                            break;
                        case 'brgyhall':
                            icon = brgyhallIcon;
                            break;
                        case 'bank':
                            icon = bankIcon;
                            break;
                        case 'vulcanize':
                            icon = vulcanizeIcon;
                            break;
                        case 'terminal':
                            icon = terminalIcon;
                            break;
                        case 'inn':
                            icon = innIcon;
                            break;
                        default:
                            console.warn(`Unknown type: ${type}`);
                            return;
                    }
    
                    const marker = L.marker([loc.latitude, loc.longitude], { icon: icon }).bindPopup(`<strong>${loc.name}</strong>`);
                    marker.addTo(map);
    
                    // Store markers in separate arrays based on type
                    if (type === 'diner') dinerMarkers.push(marker);
                    if (type === 'school') schoolMarkers.push(marker);
                    if (type === 'hospital') hospitalMarkers.push(marker);
                    if (type === 'supermarket') supermarketMarkers.push(marker);
                    if (type === 'store') storeMarkers.push(marker);
                    if (type === 'fire') fireMarkers.push(marker);
                    if (type === 'police') policeMarkers.push(marker);
                    if (type === 'vet') vetMarkers.push(marker);
                    if (type === 'gas') gasMarkers.push(marker);
                    if (type === 'worship') worshipMarkers.push(marker);
                    if (type === 'brgyhall') brgyhallMarkers.push(marker);
                    if (type === 'bank') bankMarkers.push(marker);
                    if (type === 'vulcanize') vulcanizeMarkers.push(marker);
                    if (type === 'terminal') terminalMarkers.push(marker);
                    if (type === 'inn') innMarkers.push(marker);
                });
            });
    }
    

    // Function to remove markers
    function removeMarkers(markers) {
        markers.forEach(marker => map.removeLayer(marker));
        markers.length = 0; // Clear the array
    }

    // Event listeners for checkboxes
    document.getElementById('toggle1').addEventListener('change', function () {
        if (this.checked) {
            addMarkers('diner');
        } else {
            removeMarkers(dinerMarkers);
        }
    });

    document.getElementById('toggle2').addEventListener('change', function () {
        if (this.checked) {
            addMarkers('school');
        } else {
            removeMarkers(schoolMarkers);
        }
    });

    // Event listeners for checkboxes
    document.getElementById('toggle3').addEventListener('change', function () {
        if (this.checked) {
            addMarkers('hospital');
        } else {
            removeMarkers(hospitalMarkers);
        }
    });

    document.getElementById('toggle4').addEventListener('change', function () {
        if (this.checked) {
            addMarkers('supermarket');
        } else {
            removeMarkers(supermarketMarkers);
        }
    });

    // Event listeners for checkboxes
    document.getElementById('toggle5').addEventListener('change', function () {
        if (this.checked) {
            addMarkers('store');
        } else {
            removeMarkers(storeMarkers);
        }
    });

    document.getElementById('toggle6').addEventListener('change', function () {
        if (this.checked) {
            addMarkers('fire');
        } else {
            removeMarkers(fireMarkers);
        }
    });

    // Event listeners for checkboxes
    document.getElementById('toggle7').addEventListener('change', function () {
        if (this.checked) {
            addMarkers('police');
        } else {
            removeMarkers(policeMarkers);
        }
    });

    document.getElementById('toggle8').addEventListener('change', function () {
        if (this.checked) {
            addMarkers('vet');
        } else {
            removeMarkers(vetMarkers);
        }
    });

    document.getElementById('toggle9').addEventListener('change', function () {
        if (this.checked) {
            addMarkers('gas');
        } else {
            removeMarkers(gasMarkers);
        }
    });

    document.getElementById('toggle10').addEventListener('change', function () {
        if (this.checked) {
            addMarkers('worship');
        } else {
            removeMarkers(worshipMarkers);
        }
    });

    document.getElementById('toggle11').addEventListener('change', function () {
        if (this.checked) {
            addMarkers('brgyhall');
        } else {
            removeMarkers(brgyhallMarkers);
        }
    });

    document.getElementById('toggle12').addEventListener('change', function () {
        if (this.checked) {
            addMarkers('bank');
        } else {
            removeMarkers(bankMarkers);
        }
    });

    document.getElementById('toggle13').addEventListener('change', function () {
        if (this.checked) {
            addMarkers('vulcanize');
        } else {
            removeMarkers(vulcanizeMarkers);
        }
    });

    document.getElementById('toggle14').addEventListener('change', function () {
        if (this.checked) {
            addMarkers('inn');
        } else {
            removeMarkers(innMarkers);
        }
    });

    document.getElementById('toggle15').addEventListener('change', function () {
        if (this.checked) {
            addMarkers('terminal');
        } else {
            removeMarkers(terminalMarkers);
        }
    });

    // GPS
    function updateLocation(position) {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
    
        // Define the custom icon for the user's location
        var userIcon = L.icon({
            iconUrl: 'icon/userloc.png', // Path to your user location icon
            iconSize: [30, 30],        // Adjust size to fit your design
            iconAnchor: [15, 40],      // Anchor point for the icon
            popupAnchor: [0, -40],     // Popup position relative to the icon
        });
    
        // Add or update a marker at the user's location
        if (userMarker) {
            userMarker.setLatLng([lat, lng]); // Update marker position
        } else {
            // Create a new marker with the custom icon
            userMarker = L.marker([lat, lng], { icon: userIcon })
                .addTo(map)
                .bindPopup("You are here")
                .openPopup(); // Open popup immediately
        }
    
        // Center the map only on the first GPS update
        if (shouldCenter) {
            map.setView([lat, lng], 13); // Adjust zoom level as needed
            shouldCenter = false;       // Prevent further centering
        }
    }
    
    // Handle geolocation errors
    function handleLocationError(error) {
        console.log("Error with geolocation: ", error);
        alert("Unable to retrieve location. Please enable GPS and refresh the page.");
    }
    
    // Add a marker to show the user's location (initialize as null)
    var userMarker = null;
    
    // Flag to center map only once
    var shouldCenter = true;
    
    // Request the user’s location continuously
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(updateLocation, handleLocationError, {
            enableHighAccuracy: true,
            maximumAge: 5000, // Cache the position for 5 seconds
            timeout: 5000     // Timeout if position not available after 5 seconds
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
});
