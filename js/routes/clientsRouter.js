//clients route

import express from "express"
import { ObjectId } from "mongodb"

const router = express.Router()

import { PrismaClient } from "../../prisma/db2/generated/index.js"

const prisma = new PrismaClient()

function check_id(id) {
    return ObjectId.isValid(id)
}

router.get("/ClientsGet", async (req, res) => {
    let clients = []

    if (req.body) {
        clients = await prisma.client.findMany({
            where: {
                name: req.body.name ? String(req.body.name) : undefined,
                email: req.body.email ? String(req.body.email) : undefined
            }
        })
    } else {
        clients = await prisma.client.findMany()
    }

    return res.status(200).json(clients)
})

router.post("/ClientsPost", async (req, res) => {
    const { name, email, age, books } = req.body

    const check_exist_client = await prisma.client.findMany({
        where: {
            email: email
        }
    })

    if (!name || !email || !age || !books){
        return res.status(400).json({ message: "Você não pode criar um cliente sem expecificar o seu nome, e email, idade e seus livros que comprou." })
    } else {
        if (check_exist_client.length > 0) {
            return res.status(400).json({ message: "Você não pode adicionar um cliente que tem o mesmo email" })
        } else {
            await prisma.client.create({
                data: {
                    name: name,
                    email: email,
                    age: age,
                    books: books
                }
            })
        }

        return res.status(201).json(req.body)
    }
})

router.delete("/ClientsDelete/:id", async (req, res) => {
    if (check_id(req.params.id) == true) {
        await prisma.client.delete({
            where: {
                id: req.params.id
            }
        })
        return res.status(200).json({message: "Cliente deletado com sucesso."})
    } else {
        return res.status(404).json({message: "O id do Cliente não foi encontrado, ou não é valido."})
    }
})

router.put("/ClientsPut/:id", async (req, res) => {
    const { name, age, email, books } = req.body
    
    let clients = await prisma.client.findUnique({
        where: {
            id: req.params.id
        }
    })

    if (check_id(req.params.id) && clients) {
        
        if (!name || !age || !email || !books || !Array.isArray(books)) {
            res.status(400).json({ message: "Você não pode cadastrar um cliente sem expecificar o seu nome, idade e email e livros comprados." })
        } else {
            await prisma.client.update({
                data: {
                    name: name,
                    age: age,
                    email: email,
                    books: books
                },
                where: {
                    id: req.params.id
                }
            })
            return res.status(200).json(req.body)
        }

    } else {
        return res.status(400).json({ message: "Você não pode atualizar as informações de um cliente sem expecificar o seu nome, idade e email e livros comprados ou se seu ID for inválido." })
    }
})

export default router
