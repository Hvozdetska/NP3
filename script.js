window.onload = () => {
    const cityName = document.getElementById("cityName");
    const streetName = document.getElementById("streetName");
    const findByCityName = document.getElementById("findByCityName");
    const streets = document.getElementById("streets");

    cityName.addEventListener("change", connectToNP);
    streetName.addEventListener("change", connectToNP);
    findByCityName.addEventListener("click", connectToNP);

    function connectToNP() {
        fetch("https://api.novaposhta.ua/v2.0/json/", { //make request to NP
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({
                "apiKey": "api",
                "modelName": "Address",
                "calledMethod": "getSettlements",
                "methodProperties": {
                    "Page" : "1",
                    "Warehouse" : "1",
                    "FindByString" : cityName.value,
                    "Limit" : "20"
                }
            })
        })
            .then(res => res.json())//receive JSON answer
            .then(data => {
                document.getElementById("latitude").innerHTML = (data.data[0].Latitude);
                document.getElementById("longitude").innerHTML = (data.data[0].Longitude);
                document.getElementById("type").innerHTML = (data.data[0].SettlementTypeDescription);
                document.getElementById("index").innerHTML = (data.data[0].Index1);
                document.getElementById("area").innerHTML = (data.data[0].AreaDescription);
                document.getElementById("district").innerHTML = (data.data[0].RegionsDescription);
            });

        fetch("https://api.novaposhta.ua/v2.0/json/", { //make request to NP
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({
                "apiKey": "api",
                "modelName": "Address",
                "calledMethod": "getCities",
                "methodProperties": {
                    "FindByString" : cityName.value
                }
            })
        })
            .then(res => res.json())//receive JSON answer
            .then(data => {
                document.getElementById("ref").innerHTML = (data.data[0].Ref);
                localStorage.setItem("ref", data.data[0].Ref);
            });

        fetch("https://api.novaposhta.ua/v2.0/json/", { //make request to NP
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({
                "apiKey": "api",
                "modelName": "Address",
                "calledMethod": "getStreet",
                "methodProperties": {
                    "CityRef" : localStorage.getItem("ref"),
                    "FindByString" : streetName.value
                }
            })
        })
            .then(res => res.json())//receive JSON answer
            .then(data => {
                if(streetName.value === "") {
                    data.data.forEach(street => {
                        streets.innerHTML += street.Description+"<br>"
                    })
                } else {
                    streets.innerHTML = JSON.stringify(data.data)
                        .replaceAll(",", ",<br>")
                        .replaceAll("{", "{<br>")
                        .replaceAll("}", "<br>}");
                }
            });
    }
}