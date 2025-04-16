//books route

import express from "express"
import { ObjectId } from "mongodb"

const router = express.Router()

import { PrismaClient } from "../../prisma/db1/generated/index.js"

const prisma = new PrismaClient()

function check_id(id) {
    return ObjectId.isValid(id)
}

router.get("/Books", async (req, res) => {
    let books = []

    if (req.query) {
        books = await prisma.book.findMany({
            where: {
                name: req.query.name,
                price: req.query.price ? parseFloat(req.query.price) : undefined,
                author: req.query.author
            }
        })
    } else {
        books = await prisma.book.findMany()
    }
    return res.status(200).json(books)
})

router.post("/Books", async (req, res) => {
    const { name, author, price, amount } = req.body
    if (!name || !author || !price || !amount) {
        return res.status(400).json({ message: "Você não pode criar um livro sem expecificar o seu nome, author, preço e quantidade" })
    } else {
        await prisma.book.create({
            data: {
                name,
                author,
                price,
                amount
            }
        })

        return res.status(201).json(req.body)
    }
})

router.delete("/Books/:id", async (req, res) => {
    if (check_id(req.params.id) == true) {
        await prisma.book.delete({
            where: {
                id: req.params.id
            }
        })
        return res.status(200).json({message: "Livro deletado com sucesso."})
    } else {
        return res.status(404).json({message: "O id do Livro não foi encontrado, ou não é valido."})
    }
})

router.put("/Books/:id", async (req, res) => {
    const { name, author, price, amount } = req.body
    
    let book = await prisma.book.findUnique({
        where: {
            id: req.params.id
        }
    })

    if (check_id(req.params.id) == true && book.length > 0) {
        
        if (!name || !author || !price || !amount) {
            res.status(400).json({ message: "Você não pode criar um livro sem expecificar o seu nome, author, preço e quantidade" })
        } else {
            await prisma.book.update({
                data: {
                    name,
                    author,
                    price,
                    amount
                },
                where: {
                    id: req.params.id
                }
            })
            return res.status(200).json(req.body)
        }

    } else {
        return res.status(400).json({ message: "Você não pode atualizar um livro sem expecificar o seu nome, author, preço e quantidade" })
    }
})

export default router
