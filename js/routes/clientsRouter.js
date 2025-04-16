//clients route

import express from "express"
import { ObjectId } from "mongodb"

const router = express.Router()

import { PrismaClient } from "../../prisma/db2/generated/index.js"

const prisma = new PrismaClient()

function check_id(id) {
    return ObjectId.isValid(id)
}

router.get("/Clients", async (req, res) => {
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

router.post("/Clients", async (req, res) => {
    const { name, email, age } = req.body

    const check_exist_client = await prisma.client.findMany({
        where: {
            email: email
        }
    })

    if (!name || !email || !age){
        return res.status(400).json({ message: "Você não pode criar um cliente sem expecificar o seu nome, e email" })
    } else {
        if (check_exist_client.length > 0) {
            return res.status(400).json({ message: "Você não pode adicionar um cliente que tem o mesmo email" })
        } else {
            await prisma.client.create({
                data: {
                    name,
                    email,
                    age
                }
            })
        }

        return res.status(201).json(req.body)
    }
})

router.delete("/Clients/:id", async (req, res) => {
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

router.put("/Books/:id", async (req, res) => {
    const { name, age, email } = req.body
    
    let clients = await prisma.client.findUnique({
        where: {
            id: req.params.id
        }
    })

    if (check_id(req.params.id) == true && clients.length > 0) {
        
        if (!name || !age || !email) {
            res.status(400).json({ message: "Você não pode cadastrar um cliente sem expecificar o seu nome, idade e email" })
        } else {
            await prisma.client.update({
                data: {
                    name,
                    age,
                    email
                },
                where: {
                    id: req.params.id
                }
            })
            return res.status(200).json(req.body)
        }

    } else {
        return res.status(400).json({ message: "Você não pode atualizar as informações de um cliente sem expecificar o seu nome, idade e email" })
    }
})

export default router
