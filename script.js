const resultados = document.getElementById('resultados')
const msg = document.getElementById('contador-pessoas')
let usuarios = []

async function buscarOsUsuarios() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users')
        if(!response.ok) {
            throw new Error('Ocorreu um erro na requisição: ' + response.status)
        }
        usuarios = await response.json()
        renderizarUsuarios()

    } catch (error) {
        console.error(error)                        // o console ajuda a descobrir o que falhou.
        msg.textContent = "Ops! Algo deu errado..." // enquanto a mensagem na página mantém a experiência mais amigável
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

buscarOsUsuarios()