
const tbody = document.querySelector('tbody')

const url = 'http://localhost:8080/tarefas'

const addForm = document.querySelector('.add-form')
const inputNome = document.querySelector('.inputNome')
const inputCusto = document.querySelector('.inputCusto')
const inputData = document.querySelector('.inputData')


const editForm = document.querySelector('.edit-form')
const editInputNome = document.querySelector('.editNome')
const editInputCusto = document.querySelector('.editCusto')
const editInputData = document.querySelector('.editData')


// Metodos get, post, put, delete
const buscarTarefas = async () => {
    const response = await fetch(url)
    const tarefas = await response.json()
    return tarefas
}
const carregaTarefas = async () => {

    tbody.innerHTML = ''

    const tarefas = await buscarTarefas();

    tarefas.forEach((tarefa) => {

        const tr = criarLinha(tarefa, tarefas)

        tbody.appendChild(tr)

    });
}
const deletarTarefa = async (id) => {
    const resultado = window.confirm("Deseja mesmo deletar a tarefa: " + id)
    if (resultado === true) {
        await fetch(url + `/${id}`, {
            method: 'delete',
        })

        carregaTarefas();
    }
    else {
        alert('A tarefa ' + id + ' foi mantida')
    }
}

const editarTarefa = async ({ id, nome, custo, dataLimite }) => {

    await fetch(url + `/${id}`, {
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, custo, dataLimite })
    })

    carregaTarefas()

}

const adicionarTarefa = async (event) => {
    event.preventDefault()

    const inputTarefa = {
        nome: inputNome.value,
        custo: parseFloat(inputCusto.value),
        dataLimite: inputData.value
    }
    await fetch(url, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputTarefa)
    })

    carregaTarefas()
    inputNome.value = ''
    inputData.value = ''
    inputCusto.value = ''
}

const trocarOrdem = async (tarefa, acao) => {
    // Recarrega as tarefas
    const tarefas = await buscarTarefas()
    const indexTarefa = tarefas.findIndex(t => t.ordem === tarefa.ordem);

    if (acao === 'subir' && indexTarefa > 0) {
        // Troca a tarefa com a anterior
        const buffer = tarefas[indexTarefa - 1]
        tarefas[indexTarefa - 1] = tarefa
        tarefas[indexTarefa] = buffer

    } else if (acao === 'descer' && indexTarefa < tarefas.length - 1) {
        // Troca a tarefa com a seguinte
        const buffer = tarefas[indexTarefa + 1]
        tarefas[indexTarefa + 1] = tarefa
        tarefas[indexTarefa] = buffer

    }
    //atualiza as ordens
    /*
    const tarefasAtualizadas = [];
    for (let i = 0; i < tarefas.length; i++) {
        const tarefaAtualizada = {
            ...tarefas[i],
            ordem: i
        }
        tarefasAtualizadas.push(tarefaAtualizada);
    }
    */
    // Atualiza a ordem das tarefas no backend
    console.log(tarefas)
    await fetch(url + '/reordenar', {
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tarefas)
    });


    carregaTarefas(); // Recarrega as tarefas para mostrar a nova ordem
};



const createElement = (tag, innerText = '', innerHTML = '') => {
    const elemento = document.createElement(tag)
    if (innerText) {
        elemento.innerText = innerText
    }
    if (innerHTML) {
        elemento.innerHTML = innerHTML
    }
    return elemento
}

// cria a tabela linha por linha
const criarLinha = (tarefa, tarefas) => {

    const { id, nome, dataLimite, custo, ordem } = tarefa

    //criando os elementos da html
    const tr = createElement('tr')
    const tdId = createElement('td', id)
    const tdNome = createElement('td', nome)
    const tdDataLimite = createElement('td', dataLimite)
    const tdCusto = createElement('td', custo)
    const tdAcao = createElement('td')
    //adicionando icone ao botao
    const botaoEditar = createElement('button', '', '<span class="material-symbols-outlined">edit</span>')
    const botaoExcuir = createElement('button', '', '<span class="material-symbols-outlined">delete</span>')
    const botaoConfirmar = createElement('button', '', '<span class="material-symbols-outlined">check_circle</span>')
    const botaoCancel = createElement('button', '', '<span class="material-symbols-outlined">cancel</span>')
    const botaoSubir = createElement('button', '', '<span class="material-symbols-outlined">arrow_upward</span>')
    const botaoDescer = createElement('button', '', '<span class="material-symbols-outlined">arrow_downward</span>')

    // adicionando a classe ao botao
    botaoEditar.classList.add('btn-action')
    botaoExcuir.classList.add('btn-action')
    botaoConfirmar.classList.add('btn-action')
    botaoCancel.classList.add('btn-action')
    botaoSubir.classList.add('btn-action')
    botaoDescer.classList.add('btn-action')



    //criando o formulario para editar uma tarefa
    //nome
    const editForm = createElement('form')
    const editInput = createElement('input')
    editInput.value = nome
    editForm.appendChild(editInput)
    // custo
    const editFormCusto = createElement('form')
    const editInputCusto = createElement('input')
    editInputCusto.value = custo
    editFormCusto.appendChild(editInputCusto)
    //dataLimite
    const editFormData = createElement('form')
    const editInputData = createElement('input')
    editInputData.type = 'date'
    editInputData.value = dataLimite
    editFormData.appendChild(editInputData)

    //logica dos botoes
    botaoEditar.addEventListener('click', () => {

        tdAcao.innerHTML = ''
        tdAcao.appendChild(botaoConfirmar)
        tdAcao.appendChild(botaoCancel)

        editInput.value = nome
        editInputCusto.value = custo
        editInputData.value = dataLimite

        tdNome.innerText = ''
        tdCusto.innerText = ''
        tdDataLimite.innerText = ''

        tdNome.appendChild(editForm)
        tdCusto.appendChild(editFormCusto)
        tdDataLimite.appendChild(editFormData)


    })

    botaoConfirmar.addEventListener('click', () => {
        tarefaAtualizada = {
            id,
            nome: editInput.value,
            custo: parseFloat(editInputCusto.value),
            dataLimite: editInputData.value
        }
        console.log(tarefaAtualizada)
        editarTarefa(tarefaAtualizada)

    })

    botaoCancel.addEventListener('click', () => { carregaTarefas() })

    botaoExcuir.addEventListener('click', () => { deletarTarefa(id) })

    if (ordem === 0) {
        botaoSubir.disabled = true; // Primeira tarefa não pode subir
    }
    if (ordem === tarefas.length - 1) {
        botaoDescer.disabled = true; // Última tarefa não pode descer
    }
    botaoSubir.addEventListener('click', () => {
        trocarOrdem(tarefa, 'subir');
    });

    botaoDescer.addEventListener('click', () => {
        trocarOrdem(tarefa, 'descer');
    });

    //adicionando os botoes ao campo acao no formulario
    tdAcao.appendChild(botaoSubir)

    tdAcao.appendChild(botaoEditar)
    tdAcao.appendChild(botaoExcuir)

    tdAcao.appendChild(botaoDescer)
    //adicionando os campos a tabela

    tr.appendChild(tdId)
    tr.appendChild(tdNome)
    tr.appendChild(tdCusto)
    tr.appendChild(tdDataLimite)
    tr.appendChild(tdAcao)

    return tr
}

//evento de adicionar uma nova tarefa
addForm.addEventListener('submit', adicionarTarefa)


carregaTarefas()





