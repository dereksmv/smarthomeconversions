


function test() {
    alert("shit")
}

function postToServer() {

    let data = {};
    let inputs = document.getElementsByTagName("input")
    for (var i = 0; i < inputs.length; i++) {
        data[inputs[i].id] = inputs[i].value
    };
    Axios.post("/api/pages/new-page", data)
         .then(res => {
             alert(res.data)
         })
}

