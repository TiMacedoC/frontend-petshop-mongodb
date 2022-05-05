const buttons = document.querySelectorAll(".actions")

buttons.forEach(button => {

    button.addEventListener("click", onClick)

})

const baseUrl = `https://petshop-mongodb.herokuapp.com/atendimentos/`

//Controla os botões principais
function onClick() {
    switch (this.id) {
        case "post":
            desenhaForm();
            break;
        case "get":
            lista();
            break;
        case "getById":
            drawSearchBox();
            break;
    }
}

const lista = async () => {
    const url = baseUrl;
    const res = await fetch(url).then((res) => {
        return res.json()
    });

    //Chama a função que vai mostrar na tela todos os agendamentos
    //Essa função está no arquivo auxiliar.js
    desenhaLista(res)

};

const apagar = async (id) => {
    const url = baseUrl + id;
    const config = {
        method: 'DELETE'
    }

    await fetch(url, config);

    lista();

}

const search = async () => {
    const terms = document.querySelector("#searchBox").value;
    console.log('terms:', terms)

    //Se o resultado da primeira pesquisa por id for 400 ele faz uma nova
    //Se o resultado continuar 400 ele imprime a tela de vazio, senão ele imprime com o resultado da segunda pesquisa;
    const result = await searchForId(terms);

    if (result == 400) {
        let result = await searchByKeyword(terms);
        if (result == 400) {
            drawEmptyList();
        } else {
            desenhaLista(result)
        }
    } else {
        console.log('result:', result)
        desenhaLista([result])
    }
};

const agendar = async () => {
    var formulario = formHandle();

    formulario = JSON.parse(formulario)
    formulario.status = "Agendado"
    formulario = JSON.stringify(formulario)
    console.log('formulario:', formulario)

    const header = {
        method: "POST",
        body: formulario,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }

    const url = baseUrl;

    const res = await fetch(url, header).then((res) => {
        return res.json()
    });

    window.alert("Serviço agendado com sucesso")
    eraseAll()
}

const alterar = async (id) => {
    const formulario = formHandle();

    const url = baseUrl + id

    const header = {
        method: "PATCH",
        body: formulario,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }

    const res = await fetch(url, header).then((res) => {
        return res.json()
    });

    window.alert("Serviço alterado com sucesso")
    eraseAll()

}





