fetch('http://127.0.0.1:5000/predict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        school: "GP", sex: "F", age: 17, famsize: "GT3", Pstatus: "T",
        Medu: 2, Fedu: 2, Mjob: "services", Fjob: "services", reason: "course",
        guardian: "mother", traveltime: 2, studytime: 2, failures: 0,
        schoolsup: "yes", famsup: "no", paid: "no", activities: "yes",
        nursery: "yes", higher: "yes", internet: "yes", romantic: "no",
        famrel: 4, freetime: 3, goout: 2, Dalc: 1, Walc: 2, health: 5,
        absences: 10, G1: 12, G2: 10
    })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));