function displayMessage() {
    const urlParams = new URLSearchParams(window.location.search);
    const mensagem = urlParams.get('msg');

    console.log("Mensagem recebida:", mensagem); // Para você testar no console

    if (mensagem === "index") {
        window.location.href = 'index.html';
    } 
    else {
        window.location.href = "Layout.html";
    }
}
