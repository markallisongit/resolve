window.onload = function () {
    hideDiv('status');
    hideDiv('address');
    var head = document.getElementsByTagName("head")[0].innerHTML;
    if (head.indexOf("moneybutton") === -1) {
        console.log("Loading Moneybutton");
        loadMoneyButton();
    }    
    // return key submits
    document.getElementById("handletext").addEventListener("keyup", function (e) {
        e.preventDefault();
        if ((e.keyCode > 47 && e.keyCode < 112) || e.keyCode === 8 || e.keyCode === 46) {
            hideDiv('address');
        } else if (e.keyCode === 13) {  // Enter pressed   
            updateStatus("Resolving...", 'info');
            if (typeof (Storage) !== "undefined") {
                var userinput = document.getElementById('handletext').value.trim();
                localStorage.setItem("handle", userinput);
            }
            getAddress(userinput);
            document.getElementById('handletext').value.trim();
        }
    });
    // get the handle saved in storage and populate textbox with it
    if (typeof (Storage) != null) {
        var handle = this.localStorage.getItem("handle");
        if (handle != null) {
            document.getElementById("handletext").value = handle;
        }
    }
    document.getElementById("handletext").focus();
}

function updateStatus (message, type) {
    document.getElementById('status').classList.remove("alert-danger");
    var alertClass;
    switch (type) {
        case 'info':
            alertClass = "alert-info";
            break;
        case 'error':
            alertClass = "alert-danger";
            break;
        case 'warning':
            alertClass = "alert-warning";
            break;

        default:
            alertClass = "alert-info";
    }

    document.getElementById('status').innerHTML = message;
    document.getElementById('status').classList.add(alertClass);
    document.getElementById('status').style.display=('block');
}

function getAddress(handle) {
    var req = new XMLHttpRequest();
    var address;
    var error;
    req.onreadystatechange = function () {
        if (req.readyState === 4) {
            var response = req.responseText;
            var json = JSON.parse(response);
            address = json['address'];
            error = json['error'];

            if (req.status === 200) {
                hideDiv('status');
                if (address) {
                    document.getElementById('qrcode').innerHTML = "<img src=\"https://api.qrserver.com/v1/create-qr-code/?data=" + address + "&amp;size=150x150\" /img>"
                    document.getElementById('outputbox').innerHTML = address;                      
                    document.getElementById('address').style.display=('block');
                } else  {
                    updateStatus(error, 'error');    
                }             
            }
            else if (req.status === 400 || req.status === 404) {
                updateStatus(error, 'error');
                return;
            }
            else {
                updateStatus(req.statusText, 'error');
                return;
            }
        }
    };
    req.open('GET', 'https://api.polynym.io/getAddress/' + handle);
    req.send(null);
}

function hideDiv (div){
    document.getElementById(div).style.display=('none');
}

function clearOutput (){
    document.getElementById('address').style.display=('none');
}

function loadMoneyButton() {
    var x = document.createElement("script");
    x.src = "https://api.moneybutton.com/moneybutton.js";
    document.getElementsByTagName("head")[0].appendChild(x); // Insert MB script into document head
    setTimeout(function () { renderMoneyButton("0.25") }, 100);
}

function renderMoneyButton(amount) {
    if (typeof (moneyButton) === "undefined") {
        setTimeout(function () { renderMoneyButton(amount); }, 100);
        return; // If MoneyButton isn't defined, try again in 100 ms
    }
    if (typeof (moneyButton.render) === "undefined") {
        setTimeout(function () { renderMoneyButton(amount); }, 100);
        return; // If render isn't defined, try again in 100 ms
    }
    const div = document.getElementById('moneybutton')
    moneyButton.render(div, {
        amount: amount,
        to: "marquee@moneybutton.com",
        amount: "0.02",
        currency: "USD",
        label: "Tip",
        clientIdentifier: "4f07e9e4d6322bed4a8bcffe5aeb9ce4",
        buttonId: "1539184004542",
        buttonData: "{}",
        type: "tip",
        editable: false
    }); // Render MB
}