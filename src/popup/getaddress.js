window.onload = function () {
    hideDiv('status');
    hideDiv('outputbox');

    // return key submits
    document.getElementById("handletext").addEventListener("keyup", function (e) {
        e.preventDefault();
        if ((e.keyCode > 47 && e.keyCode < 112) || e.keyCode === 8 || e.keyCode === 46) {
            hideDiv('outputbox');
            checkHandleType();
                
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
            checkHandleType();
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
                    // document.getElementById('qrcode').innerHTML = "<img src=\"https://api.qrserver.com/v1/create-qr-code/?data=" + address + "&amp;size=150x150\" /img>"
                    var typeNumber = 0;
                    var errorCorrectionLevel = 'L';
                    var qr = qrcode(typeNumber, errorCorrectionLevel);
                    qr.addData(address);
                    qr.make();
                    
                    document.getElementById('qrcode').innerHTML = qr.createSvgTag(5,0,address);              

                    document.getElementById('address').innerHTML = address;                      
                    document.getElementById('outputbox').style.display=('block');
                    
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

function checkHandleType () {
    var handle = document.getElementById('handletext').value.trim()
    if (handle.charAt(0) == '$')  {
        shadeHandle('Handcash');
    } else if (handle.charAt(0) == '1')  {
        shadeHandle('RelayX');
    } else {
        shadeHandle('Paymail');
    }
}

function shadeHandle (handletype) {
    if (handletype == 'Handcash') {
        document.getElementById('handletext').style.backgroundColor = "#38CB7C";
    } else if (handletype == 'RelayX') {
        document.getElementById('handletext').style.backgroundColor = "#99b8ff";
    } else {
        document.getElementById('handletext').style.backgroundColor = "whitesmoke";
    }
}