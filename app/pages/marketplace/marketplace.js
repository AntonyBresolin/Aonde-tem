const stateEl = document.querySelectorAll(".estado")

stateEl.forEach(state => {
  state.addEventListener("click", () =>{
    estado = state.children[state.children.length - 1].textContent;
    estado = estado.trim()
    buscaCidades(estado);
  })
})

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



function findTransactions(user) {
    showLoading();
    const orderedList = document.getElementById('transactions')
    orderedList.innerHTML ="";
    localStorage.setItem('estado', document.getElementById("cidade").value);
    transactionService.findByUser(user)
        .then(transactions => {
            hideLoading();
            addTransactionsToScreen(transactions);
        })
        .catch(error => {
            hideLoading();
            console.log(error);
            alert('Erro ao recuperar transacoes');
        })
}

// function findTransactionsMunicipio() {
//     showLoading();
    
//     localStorage.setItem('estado', document.getElementById("cidade").value);
//     transactionService.findByUser(document.getElementById("cidade"))
//         .then(transactions => {
//             hideLoading();
//             addTransactionsToScreen(transactions);
//         })
//         .catch(error => {
//             hideLoading();
//             console.log(error);
//             alert('Erro ao recuperar transacoes');
//         })
// }

function addTransactionsToScreen(transactions) {
    
    const orderedList = document.getElementById('transactions');
    transactions.forEach(transaction => {
     
        const li = createTransactionListItem(transaction);

        const divImg = document.createElement('div');
        divImg.classList.add('img-wrapper')

        const divInfo = document.createElement('div');
        divInfo.classList.add('container-info');

        divImg.appendChild(createImage(formatImage(transaction.image)));
        divInfo.appendChild(createParagraph(`<strong>Nome:</strong> ${transaction.nome}`));
        divInfo.appendChild(createParagraph(`<strong>Moeda:</strong> ${transaction.money.currency}`));
        divInfo.appendChild(createParagraph(`<strong>Preço:</strong> R$${transaction.money.value.toFixed(2)}`));
        if (transaction.description) {
            divInfo.appendChild(createTextArea(`<strong>Descrição:</strong> ${transaction.description}`));
        }

        divInfo.appendChild(createParagraph(`<strong>Data:</strong> ${formatDate(transaction.date)}`));
        divInfo.appendChild(createParagraph(`<strong>Telefone:</strong> ${transaction.telefone}`));

        li.appendChild(divImg);
        li.appendChild(divInfo);
        orderedList.appendChild(li);
       
    });
}

function createTransactionListItem(transaction) {
    const li = document.createElement('li');
    li.classList.add(transaction.type);
    li.id = transaction.telefone;
    li.addEventListener('click', () => {
        window.location.href = "https://api.whatsapp.com/send?phone=55" + transaction.telefone + "&text=Ol%C3%A1%2C%20vi%20seu%20produto%20*" + transaction.nome + "*%20anunciado%20no%20site%20do%20AondeTem%20por%20*R%24%20"+
        transaction.money.value.toFixed(2)+ "*. %20Ainda%20estaria%20disponível?";

    })
    return li;
}



function createParagraph(value) {
    const element = document.createElement('p');
    element.innerHTML = value;
    return element;
}
function createTextArea(value) {
  const element = document.createElement('label');
  element.innerHTML = value;
  return element;
}

function createButton(value) {
  const element = document.createElement('a');
  element.innerHTML = value;
  return element;
}

function createImage(value) {
    if(value != ''){
        const element = document.createElement('img');
        element.src = value;
        return element;
    } else {
        const element = document.createElement('p');
        element.innerHTML = 'Sem Imagem!';
        return element;
    }
    
}
function formatDate(date) {
    return new Date(date).toLocaleDateString('pt-br');
}

function formatMoney(money) {
    return `${money.currency} ${money.value.toFixed(2)}`
}

function formatImage(image){
    try{ url = `${image.url}`} 
    catch{ url = ''}
    return url
}

const form = {
     municipio: () => document.getElementById("cidade"),
};




function buscaCidades(e) {
  document.querySelector("#cidade").innerHTML = "";
  var cidade_select = document.querySelector("#cidade");

  var num_estados = estadoLista.length;
  var j_index = -1;

  for (var x = 0; x < num_estados; x++) {
    if (estadoLista[x].sigla == e) {
      j_index = x;
    }
  }

  if (j_index != -1) {
    estadoLista[j_index].cidades.forEach(function (cidade) {
      var cid_opts = document.createElement("option");
      cid_opts.setAttribute("value", cidade);
      cid_opts.innerHTML = cidade;
      cidade_select.appendChild(cid_opts);
    });
  } else {
    document.querySelector("#cidade").innerHTML = "";
  }
}


  