const express = require("express") // Aqui estou iniciando o express
const router = express.Router() // Aqui estou configurando a primeira parte da rota
const cors = require('cors') //aqui estou trazendo o pacite cors que permite consumir esta api no front end
const conectaBancoDeDados = require('./bancoDeDados')// Aqui estou ligando ao arquivo bancoDeDados
conectaBancoDeDados()// estou chamando a fuinção que conscta o banco de dados

const Mulher = require('./mulherModel')

const app = express() // Aqui estou iniciando o app
app.use(express.json())
app.use(cors())
const porta = 3333 // Aqui estou criando a porta

//GET
async function mostraMulheres(request, response) {
    try {
        const mulheresVindasDoBancoDeDados = await Mulher.find()

        response.json(mulheresVindasDoBancoDeDados)
    }catch (erro) {
        console.log(erro)
    }
}

// POST 
async function criaMulher(request, response){     
    const novaMulher = new Mulher({
        nome: request.body.nome,
        imagem: request.body.imagem,
        minibio: request.body.minibio,
        ciracao: request.body.citacao
    })

    try {
        const mulherCriada =  await novaMulher.save()
        response.status(201).jason(mulherCriada)  
    }catch(erro){
        console.log(erro)
    }

}
//PATCH
async function corrigeMulher(request, response){
    try{
        const mulherEncontrada = await Mulher.findById(request.params.id)

        if(request.body.nome){
            mulherEncontrada.nome = request.body.nome
        }
    
        if(request.body.minibio){
            mulherEncontrada.minibio = request.body.minibio
        }
    
        if(request.body.imagem){
            mulherEncontrada.imagem = request.body.imagem
        }

        if(request.body.citacao){
            mulherEncontrada.citacao = request.body.citacao
        }

        const mulherAtualizadaNoBancoDeDados = await mulherEncontrada.save()

        response.json(mulherAtualizadaNoBancoDeDados)
     }catch (erro){
        console.log(erro)
    }


//DELETE
async function deletaMulher(request, response){
    try{
        await Mulher.findByIdAndDelete(request.params.id)
        response.jason ({menssagem: 'Mulher deletada com  sucesso!'})
    }catch(erro){
        console.log(erro)
    }
}

app.use(router.get('/mulheres',mostraMulheres)) //Configurei rota GET /mulheres
app.use(router.post('/mulheres', criaMulher)) // Configurei rota POST /mulheres
app.use(router.patch('/mulheres/:id', corrigeMulher))// Configurei a rota PATCH / mulheres/
app.use(router.delete('/mulheres/:id', deletaMulher))// Configurei a rota DELETE / mulheres

// PORTA
function mostraPorta() {
    console.log("Servidor criado e rodando na porta ", porta)
}

app.listen(porta,mostraPorta) // servidor ouvindo a porta
}