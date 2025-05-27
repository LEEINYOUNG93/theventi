function includeHTML(callback) {
  var z, i, elmnt, file, xhttp;
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    file = elmnt.getAttribute("include-html");
    if (file) {
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          var tempDiv = document.createElement("div");
          tempDiv.innerHTML = this.responseText;
          while (tempDiv.firstChild) {
            elmnt.parentNode.insertBefore(tempDiv.firstChild, elmnt);
          }
          elmnt.parentNode.removeChild(elmnt);
          includeHTML(callback);
          executeScripts(tempDiv);
        }
      };
      xhttp.open("GET", file, true);
      xhttp.send();
      return;
    }
  }
  if (typeof callback === "function") callback();
}

function executeScripts(element) {
  var scripts = element.getElementsByTagName("script");
  for (var i = 0; i < scripts.length; i++) {
    var script = document.createElement("script");
    script.type = scripts[i].type || "text/javascript";
    if (scripts[i].src) {
      script.src = scripts[i].src;
      script.onload = function () { };
      document.head.appendChild(script);
    } else {
      script.text = scripts[i].innerHTML;
      document.head.appendChild(script);
    }
    document.head.removeChild(script);
  }
}

function initSidebar() {
  const sidebar = document.querySelector(".sidebar");
  const openButton = document.querySelector(".sidebar--open");
  const closeButton = document.querySelector(".sidebar--close");
  const main = document.querySelector(".main");

  if (!sidebar || !openButton || !closeButton) {
    return;
  }

  openButton.addEventListener("click", () => {
    sidebar.classList.add("active");
    main.classList.add("active");
  });

  closeButton.addEventListener("click", () => {
    sidebar.classList.remove("active");
    main.classList.remove("active");
  });
}


document.addEventListener("DOMContentLoaded", function () {
  includeHTML(function () {
    initSidebar();
    AOS.init({
      duration: 1200,
      once: true,
    });

    $(window).scroll(function () {
      var curr = $(this).scrollTop();

      if (curr > 0) {
        $(".header").addClass("scrolled");
      } else {
        $(".header").removeClass("scrolled");
      }
    });
  });
});
