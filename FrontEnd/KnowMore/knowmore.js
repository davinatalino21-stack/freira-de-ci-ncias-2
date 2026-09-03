function displayMessage() {
    const urlParams = new URLSearchParams(window.location.search);
    const mensagem = urlParams.get('msg');

    if (mensagem === "index") {
        window.location.href = 'index.html';
    } else {
        window.location.href = "Layout.html";
    }
}
