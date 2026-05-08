function btnf(entrada) {
  if (entrada == 5) {
    window.location.href = `index.html?msg=${encodeURIComponent("Finalistas")}`;
  }
  if (entrada == 6) {
    window.location.href = `index.html?msg=${encodeURIComponent("Projetos Febrace")}`;
  }
  if (entrada == 7) {
    window.location.href = `index.html?msg=${encodeURIComponent("Projetos MostraTec")}`;
  }
}
function minichat() {
  let minichati = document.getElementById('minichat');
  minichati.classList.toggle('displayNone');
  minichati.classList.toggle('displayTrue');

}
