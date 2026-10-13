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

    } catch (error) {
        console.error(error)                        // o console ajuda a descobrir o que falhou.
        msg.textContent = "Ops! Algo deu errado..." // enquanto a mensagem na página mantém a experiência mais amigável
    }
}

buscarOsUsuarios()