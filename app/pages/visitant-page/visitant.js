const storage = firebase.storage();
const input = document.querySelector('input[type=file]');





toggleSaveButtonDisable()
const estadoLista = []

async function getCidades() {
  const response = await fetch('../../estados.json')
  const data = await response.json();
  return data.estados
}

getCidades().then(estadoArray => {
  estadoArray.forEach(estado => {
    estadoLista.push(estado)
  })
})






function getTransactionMunicipio() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("municipio");
}

function findTransactionByState(municipio) {
  const municipio1 = getTransactionMunicipio();
  showLoading();

  transactionService
      .findByMunicipio(municipio1)
      .then((transaction) => {
          hideLoading();
          if (transaction) {
              fillTransactionScreen(transaction);
              toggleSaveButtonDisable();
          } else {
              alert("Documento nao encontrado");
              window.location.href = "../home/home.html";
          }
      })
      .catch(() => {
          hideLoading();
          alert("Erro ao recuperar documento");
          window.location.href = "../home/home.html";
      });
}







function update(transaction) {
    showLoading();
    transactionService.update(transaction)
        .then(() => {
            hideLoading();
            window.location.href = "../home/home.html";
        })
        .catch(() => {
            hideLoading();
            alert('Erro ao atualizar transaçao');
        });
}









function buscaCidades(sigla) {
  toggleSaveButtonDisable();
  document.querySelector("#cidade").innerHTML = "";
  let cidade_select = document.querySelector("#cidade");

  let index = estadoLista.findIndex(estado => {
    return estado.sigla === sigla
  })

  if (index != -1) {
    estadoLista[index].cidades.forEach(function (cidade) {
      let cid_opts = document.createElement("option");
      cid_opts.setAttribute("value", cidade);
      cid_opts.innerHTML = cidade;
      cidade_select.appendChild(cid_opts);
    });
  } else {
    document.querySelector("#cidade").innerHTML = "";
  }
}