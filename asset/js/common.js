function includeHTML() {
    var z, i, elmnt, file, xhttp;
    z = document.getElementsByTagName("*");
    for (i = 0; i < z.length; i++) {
        elmnt = z[i];
        file = elmnt.getAttribute("include-html");
        if (file) {
            xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    var tempDiv = document.createElement('div');
                    tempDiv.innerHTML = this.responseText;
                    while (tempDiv.firstChild) {
                        elmnt.parentNode.insertBefore(tempDiv.firstChild, elmnt);
                    }
                    elmnt.parentNode.removeChild(elmnt);
                    includeHTML();
                    executeScripts(tempDiv);
                }
            }
            xhttp.open("GET", file, true);
            xhttp.send();
            return;
        }
    }
}

function executeScripts(element) {
    var scripts = element.getElementsByTagName("script");
    for (var i = 0; i < scripts.length; i++) {
        var script = document.createElement("script");
        script.type = scripts[i].type || "text/javascript";
        if (scripts[i].src) {
            script.src = scripts[i].src;
            script.onload = function() {
                // Script has been loaded and executed
            };
            document.head.appendChild(script);
        } else {
            script.text = scripts[i].innerHTML;
            document.head.appendChild(script);
        }
        document.head.removeChild(script);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    includeHTML();
});