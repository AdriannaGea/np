require('babel-register')
const config = require('./config') 
const { success, error } = require('./functions')
const express = require('express')
const app = express()
const mysql = require('mysql') // on installe le module mysql avec npm install mysql
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
const cors = require('cors')


const db = mysql.createConnection({ // on cree une connexion a la base de donnees nodejs
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mydatabase'
});

let MembersRouter = express.Router()

db.connect((err) => {//ATTENTION IMPORTANT
    if (err) {
        console.log(err); // afficher les erreurs de connexion a la base de donnees 
        //ont met tout notre code dans le else car on veut que le serveur tourne toujours
    } else {

        console.log('Connected to database'); // afficher le message de connexion a la base de donnees
        // recuperation des membres de la base de donnees
        MembersRouter.route('/')

            .get((req, res) => {
                if (req.query.max != undefined && req.query.max > 0) {
                    db.query(' SELECT * FROM members LIMIT 0, ? ',[req.query.max], (err, result) => { // requete sql pour afficher tous les membres de la base de donnees
                        if (err) {
                            res.json(err.message); // afficher les erreurs de requete sql
                        } else {
                            res.json(success(result)) // afficher les resultats de la requete sql
                        }
                    })

                } else if (req.query.max != undefined) {
                    res.json(error("wrong max value"))
                } else {

                    db.query(' SELECT * FROM members', (err, result) => { // requete sql pour afficher tous les membres de la base de donnees
                        if (err) {
                            res.json(err.message); // afficher les erreurs de requete sql
                        } else {
                            res.json(success(result)) // afficher les resultats de la requete sql
                        }
                    })
                }

            })



            .post((req, res) => {

                db.query('SELECT * FROM members', (err, result) => {

                    if (err) {
                        res.json(err.message); // afficher les erreurs de requete sql
                    } else {
                        let alredyExist = result.some(member => member.email == req.body.email) // on verifie si le membre existe deja


                        if (alredyExist == true) {
                            res.json(error("already exist"))
                        } else {


                            db.query('INSERT INTO members(firstName, lastName, email, phone, userName, password) VALUES (?, ?, ?, ?, ?, ?)', [req.body.firstName, req.body.lastName, req.body.email, req.body.phone, req.body.userName, req.body.password], (err, result) => { // requete sql pour ajouter un membre a la base de donnees
                                if (err) {
                                    res.json(err.message); // afficher les erreurs de requete sql
                                } else {
                                    db.query('SELECT * FROM members WHERE email = ?', [req.body.email], (err, result) => {
                                        if (err) {
                                            res.json(err.message); // afficher les erreurs de requete sql
                                        } else {
                                            res.json(success({
                                                id: result[0].id,
                                                firstName: result[0].firstName,
                                                lastName: result[0].lastName,
                                                email: result[0].email,
                                                phone: result[0].phone,
                                                userName: result[0].username,
                                                password: result[0].password,
                                            })) // afficher les resultats de la requete sql
                                        }
                                    })
                                }
                            })
                        }




                    }
                })


            })



        MembersRouter.route('/:id')
            // recuperation d'un membre de la base de donnees
            .get((req, res) => {

                db.query('SELECT * FROM members WHERE id = ?', [req.params.id], (err, result) => { // requete sql pour afficher tous les membres de la base de donnees
                    if (err) {
                        res.json(err.message); // afficher les erreurs de requete sql
                    } else {

                        if (result[0] != undefined) { // si le membre existe
                            res.json(success(result[0])) // afficher les resultats de la requete sql
                        } else { // si le membre n'existe pas
                            res.json(error("member not found"))
                        }

                    }
                })


            })







            .put((req, res) => {

                db.query('SELECT * FROM members WHERE id = ?', [req.params.id], (err, result) => { // requete sql pour afficher tous les membres de la base de donnees
                    if (err) {
                        res.json(err.message); // afficher les erreurs de requete sql
                    } else {

                        if (result[0] != undefined) { // si le membre existe
                            db.query('UPDATE members SET name = ? WHERE id = ?', [req.body.name, req.params.id], (err, result) => { // requete sql pour modifier un membre de la base de donnees
                                if (err) {
                                    res.json(err.message); // afficher les erreurs de requete sql
                                } else {
                                    db.query('SELECT * FROM members WHERE id = ?', [req.params.id], (err, result) => { // requete sql pour
                                        if (err) {
                                            res.json(err.message); // afficher les erreurs de requete sql
                                        } else {
                                            res.json(success(result[0])) // afficher les resultats de la requete sql
                                        }
                                    })
                                }
                            })
                        } else { // si le membre n'existe pas
                            res.json(error("member not found"))
                        }

                    }
                })

            })


            .delete((req, res) => {

                db.query('DELETE FROM members WHERE id = ?', [req.params.id], (err, result) => { // requete sql pour supprimer un membre de la base de donnees
                    if (err) {
                        res.json(err.message); // afficher les erreurs de requete sql
                    }
                    else {
                        res.json(success(result)) // afficher les resultats de la requete sql
                    }
                });

            })



        app.use(cors());
        app.use(config.rootAPI + 'members', MembersRouter) // on modifi avec config.json

        app.listen(config.port, () => {
            console.log('started')
        })

    }
});


