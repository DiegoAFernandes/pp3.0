// Mudar cor da navbar quando rolar a página
window.onscroll = function() {
    const navbar = document.getElementById("navbar");
    if (window.pageYOffset > 0) {
        navbar.style.backgroundColor = "#222";
    } else {
        navbar.style.backgroundColor = "#333";
    }
};