window.onload = function () {
    // return key submits
    document.getElementById("handletext").addEventListener("keyup", function (e) {
        event.preventDefault();
        if ((event.keyCode > 47 && event.keyCode < 112) || event.keyCode === 8 || event.keyCode === 46) {
            document.getElementById('outputbox').innerHTML = null;
            document.getElementById('qrcode').innerHTML = null;

        } else if (e.keyCode === 13) {  //checks whether the pressed key is "Enter"
            updateStatus("Loading");
            if (typeof (Storage) !== "undefined") {
                var userinput = document.getElementById('handletext').value.trim();
                localStorage.setItem("handle", userinput);
                getAddress(userinput);
                var head = document.getElementsByTagName("head")[0].innerHTML;
                if (head.indexOf("moneybutton") === -1) {
                    loadMoneyButton();
                }
            }
            document.getElementById('handletext').value.trim();
        }
    });

    // get the handle saved in storage and populate textbox with it, and load photo
    if (typeof (Storage) != null) {
        var handle = this.localStorage.getItem("handle");
        if (handle != null) {
            document.getElementById("handletext").value = handle;
            // getPhoto(handle);
        }
    }

    document.getElementById("handletext").focus();
}

function updateStatus (message, type) {
    var alertClass;
    switch (type) {
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
    document.getElementById('status').classList.add("alert");
    document.getElementById('status').classList.add(alertClass);

}
function getAddress(handle) {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (req.readyState === 4) {
            if (req.status === 200) {
                var response = req.responseText;
                var json = JSON.parse(response);
                address = json['address']
                document.getElementById('qrcode').innerHTML = "<img src=\"https://api.qrserver.com/v1/create-qr-code/?data=" + address + "&amp;size=150x150\" /img>"
                document.getElementById('outputbox').innerHTML = address;
            }
            else if (req.status === 404) {
                updateStatus('$handle does not exist', 'error');
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
    const div = document.getElementById('moneyButton')
    moneyButton.render(div, {
        amount: amount,
        to: "271",
        currency: "USD",
        amount: "0.02",
        label: "Tip Marquee",
        clientIdentifier: "4819bb79f7c579c20a14fd761b2192aa",
        buttonId: "1539184004542",
        buttonData: "{}",
        type: "tip",
        editable: false
    }); // Render MB
}