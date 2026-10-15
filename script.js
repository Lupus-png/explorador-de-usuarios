const msg = document.querySelectorAll('.contador')[1]       // seleciona a classeName 'contador', e o segundo item (0, 1) apenas
const resultados = document.getElementById('resultados')
const totalUsuarios = document.getElementById('total-usuarios')
const totalEncontrados = document.getElementById('total-encontrados')
const nome = document.getElementById('nome')
const cidade = document.getElementById('cidade')
const ordem = document.getElementById('ordem')
let usuarios = []

/* Função assincrona com a API e tratamento de Erros */
async function buscarOsUsuarios() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users')
        if(!response.ok) {
            throw new Error('Ocorreu um erro na requisição: ' + response.status)
        }
        usuarios = await response.json()
        renderizarUsuarios(usuarios)                        // depois de esperar o 'await' é exibido na tela
        atualizarContadores()                               // atualiza a quantidade de pessoas na rede
        preencherCidades()                                  // adiciona as options no select
        aplicarFiltros()                                    // aplica os filtros de busca e de cidade

    } catch (error) {
        console.error(error)                                // o console ajuda a descobrir o que falhou.
        msg.textContent = "Ops! Algo deu errado..."         // enquanto a mensagem na página mantém a experiência mais amigável
    }
}

/* Função de exibição no DOM */
function renderizarUsuarios(lista) {
    resultados.textContent = ''                             // sempre limpar a lista quando chamar a função

    lista.forEach(user => {                                 // lista atual, cria os cards na tela
        resultados.innerHTML += `<div class="user">
                    <p class="name-card">${user.name}</p>
                    <p class="username-card">@${user.username}</p>
                    <p class="info-card"><i class="fa-regular fa-envelope"></i> ${user.email}</p>
                    <p class="info-card"><i class="fa-solid fa-location-arrow"></i> ${user.address.city}</p>
                    <p class="info-card"><i class="fa-regular fa-building"></i> ${user.company.name}</p>
                 </div>`
    })
}

/* Atualiza os contadores de usuarios */
function atualizarContadores(lista) {
    totalUsuarios.textContent = usuarios.length             // mostra o total de usuarios na rede

    if (!lista) {                                           // se não tiver parametro, coloque usuarios
        totalEncontrados.textContent = usuarios.length
    } else {                                                // se tiver, mostre a quantidade atual na lista
        totalEncontrados.textContent = lista.length
    }
}

/* Mecanismo de busca por NOME e USERNAME*/
nome.addEventListener('input', (event) => { 
/*  const palavra = event.target.value.toLowerCase();       // valor de cada letra/palavra, em minuscula
    let resultado = usuarios.filter(item => 
        item.name.toLowerCase().includes(palavra)           // resultado recebe, usuarios filtrando o item, que inclui as letras/palavras em minuscula
        || item.username.toLowerCase().includes(palavra)    // ou username em minusculas.
    )  

    renderizarUsuarios(resultado)
    atualizarContadores(resultado) */

    aplicarFiltros()                                        // a função faz o mesmo que as duas funções juntas
})

/* Adiciona as 'options' do select */
function preencherCidades() {
    const cidades = usuarios.map(item => item.address.city) // cidades recebe o array usuarios, mas sómente com as cidades
    const set = new Set(cidades)                            // set é uma coleção de valores, que proibe duplicados (repetições)
    set.forEach(item => {                                   // percorre o 'set' e cria uma linha do tipo 'option' pra cada cidade, e adiciona no select(cidade)
        const linha = document.createElement('option')
        linha.innerText = item
        linha.value = item
        cidade.appendChild(linha)
    })
}

/* Quando selecionar/mudar um 'option' do select */
cidade.addEventListener('change', (event) => {
/*  const click = event.target.value                        // o event target captura aonde foi o click, no caso o change(mudança de valor)
    let resultado = usuarios.filter(item => 
        item.address.city === click)                        // resultado recebe, a cidade de 'usuarios' que são iguais ao 'click' (click === nome da cidade)
    if (!click) {                                           // se não tiver 'click' (cidade selecionada), resultado recebe usuarios
        resultado = usuarios
    }

    renderizarUsuarios(resultado)
    atualizarContadores(resultado) */

    aplicarFiltros()                                        // a função faz o mesmo que as duas funções juntas
})

/* Aplica o filtro de cidade e ao mesmo tempo o filtro de busca por nome */
function aplicarFiltros() {
    const termo = nome.value.toLowerCase()                  // termo recebe o que é digitado na caixa de busca, em minusculo
    const cidadeSelecionada = cidade.value                  // cidadeSelecionada recebe o valor selecionado no 'select'
    let resultado = usuarios.filter(item => (               // resultado recebe os dois filtros, com as quatro condições
        item.name.toLowerCase().includes(termo) ||          // se incluso o nome no array
        item.username.toLowerCase().includes(termo)) &&     // se incluso o nickname no array
        (item.address.city === cidadeSelecionada ||         // se selecionar uma cidade
        !cidadeSelecionada)                                 // se nao selecionar nenhuma/todas
    )
    const ascDesc = ordem.value                             // a variavel recebe o valor da ordem (asc ou desc, do select)

    resultado = ordenarUsuarios(resultado, ascDesc)         // resultado passa a guardar a lista ordenada (resultado é a lista com condições e ascDesc é a ordem)
    renderizarUsuarios(resultado)
    atualizarContadores(resultado)
}

/* Ordem crescente e decrescente */
function ordenarUsuarios(lista, ordemSelecionada) {
    const copia = [...lista]                                // cria uma copia do array, com o mesmo conteudo dele
    if (ordemSelecionada === 'asc') {                       
        copia.sort((a, b) => a.name.localeCompare(b.name))  // ordena em ordem crescente, comparando as iniciais com o localeCompare
        return copia                                        // retorna o array
    } else if (ordemSelecionada === 'desc') {
        copia.sort((a, b) => b.name.localeCompare(a.name))  // ordena em ordem decrescente, comparando as iniciais com o localeCompare
        return copia                                        // retorna o array
    } else {
        return copia
    }
}

/* O select de ordenação de A-Z e Z-A */
ordem.addEventListener('change', () => {       
    aplicarFiltros()                                        // chama aplicarFiltros quando seleciona a ordem (asc ou desc)
})

buscarOsUsuarios()                                          // chama a função da API