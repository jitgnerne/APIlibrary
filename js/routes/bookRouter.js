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
                author: req.query.author ? String(req.query.author) : undefined,
                publisher: req.query.publisher ? String(req.query.publisher) : undefined
            }
        })
    } else {
        books = await prisma.book.findMany()
    }
    return res.status(200).json(books)
})

router.post("/Books", async (req, res) => {
    const { name, author, price, amount, publisher } = req.body

    const check_exist_book = await prisma.book.findMany({
        where: {
            name: name,
            author: author ? String(author) : undefined,
            price: price ? parseFloat(price) : undefined,
            amount: amount ? parseInt(amount) : undefined,
            publisher: publisher ? String(publisher) : undefined
        }
    })

    if (!name || !author || !price || !amount || !publisher) {
        return res.status(400).json({ message: "Você não pode criar um livro sem expecificar o seu nome, author, preço, quantidade e publicadora" })
    } else {

        if (check_exist_book.length > 0) {
            await prisma.book.create({
                data: {
                    name: name,
                    author: author ? String(author) : undefined,
                    price: price ? parseFloat(price) : undefined,
                    amount: amount ? parseInt(amount) : undefined,
                    publisher: publisher ? String(publisher) : undefined
                }
            })

            return res.status(201).json(req.body)
        }else{
            return res.status(400).json({message: "Você não pode adicionar um livro que tem o mesmo nome, author, preço, quantidade e publicadora"})
        }

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
    const { name, author, price, amount, publisher } = req.body
    
    let book = await prisma.book.findUnique({
        where: {
            id: req.params.id
        }
    })

    if (check_id(req.params.id) && book) {
        
        if (!name || !author || !price || !amount || !publisher) {
            res.status(400).json({ message: "Você não pode criar um livro sem expecificar o seu nome, author, preço, quantidade e publicadora" })
        } else {
            await prisma.book.update({
                data: {
                    name: name,
                    author: author ? String(author) : undefined,
                    price: price ? parseFloat(price) : undefined,
                    amount: amount ? parseInt(amount) : undefined,
                    publisher: publisher ? String(publisher) : undefined
                },
                where: {
                    id: req.params.id
                }
            })
            return res.status(200).json(req.body)
        }

    } else {
        return res.status(400).json({ message: "Você não pode atualizar um livro sem expecificar o seu nome, author, preço, quantidade e publicadora" })
    }
})

export default router
