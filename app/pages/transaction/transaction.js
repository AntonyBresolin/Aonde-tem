const storage = firebase.storage();
const input = document.querySelector('input[type=file]');


const form = {
  nomeImagem: () => document.getElementById('image'),
  nome: () => document.getElementById('nome'),
  storage: () => firebase.storage(),
  currency: () => document.getElementById("currency"),
  date: () => document.getElementById("date"),
  description: () => document.getElementById("description"),
  dateRequiredError: () => document.getElementById("date-required-error"),
  saveButton: () => document.getElementById("save-button"),
  //estado
  transactionType: () => document.getElementById("transaction-type"),

  municipio: () => document.getElementById("cidade"),
  telefone: () => document.getElementById("telefone"),
  transactionTypeRequiredError: () =>
      document.getElementById("transaction-type-required-error"),
  typeExpense: () => document.getElementById("expense"),
  typeIncome: () => document.getElementById("income"),
  value: () => document.getElementById("value"),
  valueRequiredError: () => document.getElementById("value-required-error"),
  valueLessOrEqualToZeroError: () =>
      document.getElementById("value-less-or-equal-to-zero-error"),
}


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
let imagem = ''




input.addEventListener('change', (e) => {
    let file = e.target.files[0];
    const uploadTask = storage.ref('produtos/' + e.target.files[0].name)
        .put(e.target.files[0]);

    uploadTask.on("state_changed", function (snapshot) {
        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 1;

        document.querySelector('progress').value = progress;

    }, function (error) { }, function () {
        console.log("Upload feito!")
        uploadTask.snapshot.ref.getDownloadURL().then(function (image) {
            console.log("Url: " + image)
            imagem = image
        })
    })
})
function toggleSaveButtonDisable() {
  form.saveButton().disabled = isFormValid();
}

function logout() {
    firebase.auth().signOut().then(() => {
        window.location.href = "../../index.html";
    }).catch(() => {
        alert('Erro ao fazer logout');
    })
}

if (!isNewTransaction()) {
    const uid = getTransactionUid();
    findTransactionByUid(uid);
}

function getTransactionUid() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('uid');
}

function isNewTransaction() {
    return getTransactionUid() ? false : true;
}

function findTransactionByUid(uid) {
    showLoading();

    transactionService.findByUid(uid)
        .then(transaction => {
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

function fillTransactionScreen(transaction) {
  
form.nome().value = transaction.nome;
  form.municipio().value = transaction.municipio;
  form.telefone().value = transaction.telefone;


    form.date().value = transaction.date;
    form.currency().value = transaction.money.currency;
    form.value().value = transaction.money.value;
    form.transactionType().value = transaction.transactionType;

    if (transaction.description) {
        form.description().value = transaction.description;
    }
}

function saveTransaction() {
  const transaction = createTransaction();

  if (isNewTransaction()) {
      save(transaction);
  } else {
      update(transaction);
  }
}

function save(transaction) {
    showLoading();

    transactionService.save(transaction)
        .then(() => {
            hideLoading();
            window.location.href = "../home/home.html";
        })
        .catch(() => {
            hideLoading();
            alert('Erro ao salvar transaçao');
        })
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

function createTransaction() {
    return {
        date: form.date().value,
        money: {
            currency: form.currency().value,
            value: parseFloat(form.value().value),
        },
        //estado
        transactionType: form.transactionType().value,
        municipio: form.municipio().value,
        telefone: form.telefone().value,
        nome: form.nome().value,
        description: form.description().value,
        user: {
            uid: firebase.auth().currentUser.uid,
        },
        local: {
            municipio: form.municipio().value,
            transactionType: form.transactionType().value,
        },
        image: {
            url: imagem
        }
    };
}

function onChangeDate() {
    const date = form.date().value;
    form.dateRequiredError().style.display = !date ? "block" : "none";

    toggleSaveButtonDisable();
}

function onChangeValue() {
    const value = form.value().value;
    form.valueRequiredError().style.display = !value ? "block" : "none";

    form.valueLessOrEqualToZeroError().style.display = value <= 0 ? "block" : "none";

    toggleSaveButtonDisable();
}

function onChangeTransactionType() {
    const transactionType = form.transactionType().value;
    form.transactionTypeRequiredError().style.display = !transactionType ? "block" : "none";

    toggleSaveButtonDisable();
}

function isFormValid() {
    const name = form.nome().value;
    const date = form.date().value;
    const fone = form.telefone().value;
    const value = form.value().value;
    const transactionType = form.transactionType().value;

    if (value == "" || value <= 0) {
      teste = true;
    }else if (name == ""){
      teste = true;
    }else if (fone == ""){
      teste = true;
    } else if (transactionType == ""){
      teste = true;
    } else if (date == ""){
      teste = true;
    } else {
      teste = false;
    }
    return teste;
}

function cancelar() {
    window.location.href = "../home/home.html";
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