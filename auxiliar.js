
function adicionaZero(num, aux) {
    num = num + aux;
    return num > 9 ? num : "0" + num;
}

function desenhaLista(atendimentos) {
    eraseAll()

    if (atendimentos.length > 0) {
        document.querySelector(".listaDeAgendamentos").innerHTML = `
    <tr>
        <th>Opções</th>
        <th>Cliente</th>
        <th>Pet</th>
        <th>Serviço</th>
        <th>Data</th>
        <th>Status</th>
    </tr>`;


        atendimentos.forEach((agendamento) => {
            const date = new Date(agendamento.data);

            const parseDate = `${date.getDate()}/${adicionaZero(date.getMonth(), 1)}/${date.getFullYear()}`

            document.querySelector(".listaDeAgendamentos").innerHTML += `
            <tr>
                <td>
                    <img 
                        src="images/delete-icon.png"
                        class="optionButtons"
                        id="delete" 
                        alt="botão de delete"
                        onclick="apagar('${agendamento._id}')"
                    >
                    <img 
                        src="images/edit-icon.png"
                        class="optionButtons"
                        id="edit"
                        alt="botão de editar"
                        onclick="desenhaEditForm('${agendamento._id}')"    
                    >
                </td>
                <td>${agendamento.cliente}</td>
                <td>${agendamento.pet}</td>
                <td>${agendamento.servico}</td>
                <td>${parseDate}</td>
                <td>${agendamento.status}</td>
            </tr>
        `
        })
    } else {
        drawEmptyList()
    }
    wholeDocument.style.cursor = 'default'
}

function drawSearchBox() {
    eraseAll()
    document.querySelector(".form").innerHTML = "";

    const searchField = document.querySelector(".searchField");
    searchField.innerHTML = `
        <input type="text" id="searchBox" placeholder="Pesquisar por Id, Nome, Pet">
        <button id="searchButton" onclick="search()">Pesquisar</button>
    `
}

async function searchForId(terms) {
    const id = terms;
    if (id) {
        const url = baseUrl + id;
        const res = await fetch(url).then((res) => {
            if (res.status == 200) {
                return res.json()
            } else {
                return res.status;
            }
        });
        return res
    } else return 400
}

async function searchByKeyword(terms) {

    const url = baseUrl;
    const res = await fetch(url).then((res) => {
        return res.json()
    });

    const resultado = res.filter((atendimento) => {
        for (let i in atendimento) {
            terms = terms.toLowerCase();

            let emTexto = atendimento[i].toString().toLowerCase();

            if (emTexto.includes(terms)) {
                return atendimento
            }
        }
    });

    if (resultado.length == 0) {
        return 400;
    } else {
        return resultado;
    }

}

function drawEmptyList() {

    document.querySelector(".listaDeAgendamentos").innerHTML = "";

    document.querySelector(".emptyList").innerHTML = `
        <img id="emptyImage" src="images/no-data.svg" alt="duas pranchetas vazias">
        <p>Nenhum agendamento encontrado!</p>
    `

    wholeDocument.style.cursor = 'default'
}

function desenhaForm() {
    eraseAll();

    document.querySelector(".form").innerHTML = `
        <form action="javascript:agendar()" method="post" autocomplete="off">
        
            <h3>Cadastrar novo Agendamento</h3>
        
            <div class="formField">
                <label class="inputLabels" for="cliente">Nome: </label>
                <input class="inputField" type="text" id="cliente" required>
            </div>
        
            <div class="formField">
                <label class="inputLabels" for="cpf">CPF:</label>
                <input class="inputField" type="number" id="cpf" required>
            </div>
        
            <div class="formField">
                <label class="inputLabels" for="pet">Pet: </label>
                <input class="inputField" type="text" id="pet" required>
            </div>
        
            <div class="formField">
                <label class="inputLabels" for="servico">Serviço: </label>
                <input class="inputField" type="text" id="servico" required>
            </div>
        
            <div class="formField">
                <label class="inputLabels" for="data">Data: </label>
                <input class="inputField" type="datetime-local" id="data" required>
            </div>
        
            <input class="button" type="submit" name="enviar" value="Enviar" id="enviar">
        </form>
    `;
}

async function desenhaEditForm(agendamento) {
    eraseAll();

    const atendimento = await searchForId(agendamento)
    console.log('atendimento:', atendimento)

    //Formata a data para ser exibida corretamente
    atendimento.data = atendimento.data.substring(0, atendimento.data.length - 8)

    document.querySelector(".form").innerHTML = `
         <form action="javascript:alterar('${atendimento._id}')" method="post" autocomplete="off">

            <h3>Cadastrar novo Agendamento</h3>

            <div class="formField">
                <label class="inputLabels" for="cliente">Nome: </label>
                <input class="inputField" type="text" id="cliente" value="${atendimento.cliente}" required>
            </div>

            <div class="formField">
                <label class="inputLabels" for="cpf">CPF:</label>
                <input class="inputField" type="number" id="cpf" value="${atendimento.cpf}" required>
            </div>

            <div class="formField">
                <label class="inputLabels" for="pet">Pet: </label>
                <input class="inputField" type="text" id="pet" value="${atendimento.pet}" required>
            </div>

            <div class="formField">
                <label class="inputLabels" for="servico">Serviço: </label>
                <input class="inputField" type="text" id="servico" value="${atendimento.servico}" required>
            </div>

            <div class="formField">
                <label class="inputLabels" for="data">Data: </label>
                <input class="inputField" type="datetime-local" id="data" 
                value="${atendimento.data}" required>
            </div>

            <div class="formField">
                <label class="inputLabels" for="status">Status: </label>
                <input class="inputField" type="text" id="status" value="${atendimento.status}">
            </div>

            <input class="button" type="submit" name="enviar" value="Enviar" id="enviar">
        </form>
    `;
}

function formHandle() {
    const values = document.querySelectorAll(".inputField")
    var str = {};

    values.forEach((value) => {
        str[value.id] = value.value;
    })

    const finalForm = JSON.stringify(str)

    return finalForm;
}

function eraseAll() {

    document.querySelector(".emptyList").innerHTML = "";
    document.querySelector(".listaDeAgendamentos").innerHTML = "";
    document.querySelector(".searchField").innerHTML = "";
    document.querySelector(".form").innerHTML = "";

}