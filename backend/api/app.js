const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mysql = require("mysql"); // on installe le module mysql avec npm install mysql
const cors = require("cors");
const config = require("./config");
const { success, error } = require("./functions");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const db = mysql.createConnection({ // on cree une connexion a la base de donnees nodejs
  host: "localhost",
  user: "root",
  password: "",
  database: "mydatabase",
});

db.connect((err) => { //ATTENTION IMPORTANT
  if (err) {
    console.log(err); // afficher les erreurs de connexion a la base de donnees
    //ont met tout notre code dans le else car on veut que le serveur tourne toujours
  } else {
    console.log("Connecté à la base de données"); // afficher le message de connexion a la base de donnees
    // recuperation des membres de la base de donnees

    // Router pour les endpoints concernant les lieux
    const NicePlacesRouter = express.Router();

    // Endpoint pour récupérer tous les lieux
    NicePlacesRouter.route("/")
      .get((req, res) => {
        // Requête SQL pour sélectionner tous les lieux
        db.query("SELECT * FROM niceplaces", (err, result) => {
          if (err) {
            console.error("Error executing SQL query:", err.message);
            res.json(error(err.message));
          } else {
            console.log("Nice places retrieved from the database:", result);
            res.json(success(Array.isArray(result) ? result : [result]));
          }
        });
      })
      .post((req, res) => {
        // Extraction des données du corps de la requête
        const { title, description, imageUrl, location } = req.body;
        // Requête SQL pour insérer un nouveau lieu dans la base de données
        const createdDate = new Date();
        const likes = 0;
        db.query(
          "INSERT INTO niceplaces (title, description, imageUrl, createdDate, likes, location) VALUES (?, ?, ?, ?, ?, ?)",
          [title, description, imageUrl, createdDate, likes, location],
          (err, result) => {
            if (err) {
              res.json(err.message);
            } else {
              // Sélection du lieu nouvellement inséré pour le renvoyer en réponse
              db.query(
                "SELECT * FROM niceplaces WHERE id = ?",
                [result.insertId],
                (err, result) => {
                  if (err) {
                    res.json(err.message);
                  } else {
                    res.json(success(result[0]));
                  }
                }
              );
            }
          }
        );
      });

    // Endpoint pour un lieu spécifique (par ID)
    NicePlacesRouter.route("/:id")
      .get((req, res) => {
        // Requête SQL pour sélectionner un lieu spécifique par son ID
        db.query(
          "SELECT * FROM niceplaces WHERE id = ?",
          [req.params.id],
          (err, result) => {
            if (err) {
              res.json(err.message);
            } else {
              if (result[0] != undefined) {
                res.json(success(result[0]));
              } else {
                res.json(error("Lieu non trouvé"));
              }
            }
          }
        );
      })
      .put((req, res) => {
        // Extraction des données du corps de la requête
        const { title, description, imageUrl, createdDate, likes, location } =
          req.body;
        // Requête SQL pour mettre à jour un lieu spécifique par son ID
        db.query(
          "UPDATE niceplaces SET title = ?, description = ?, imageUrl = ?, createdDate = ?, likes = ?, location = ? WHERE id = ?",
          [
            title,
            description,
            imageUrl,
            createdDate,
            likes,
            location,
            req.params.id,
          ],
          (err, result) => {
            if (err) {
              res.json(err.message);
            } else {
              // Sélection du lieu mis à jour pour le renvoyer en réponse
              db.query(
                "SELECT * FROM niceplaces WHERE id = ?",
                [req.params.id],
                (err, result) => {
                  if (err) {
                    res.json(err.message);
                  } else {
                    res.json(success(result[0]));
                  }
                }
              );
            }
          }
        );
      })
      .delete((req, res) => {
        // Requête SQL pour supprimer un lieu spécifique par son ID
        db.query(
          "DELETE FROM niceplaces WHERE id = ?",
          [req.params.id],
          (err, result) => {
            if (err) {
              res.json(err.message);
            } else {
              res.json(success("Lieu supprimé avec succès"));
            }
          }
        );
      });

    // Utilisation du routeur pour les endpoints relatifs aux lieux
    app.use(config.rootAPI + "niceplaces", NicePlacesRouter);

    // -------------------------------------------------------- //

    // Router pour les endpoints concernant les membres
    const MembersRouter = express.Router();

    // Endpoint pour récupérer tous les membres
    MembersRouter.route("/")
      .get((req, res) => {
        // Vérification du paramètre max pour la pagination
        if (req.query.max != undefined && req.query.max > 0) {
          // Requête SQL pour sélectionner un nombre limité de membres
          db.query(
            " SELECT * FROM members LIMIT 0, ? ",
            [req.query.max],
            (err, result) => {
              if (err) {
                res.json(err.message);
              } else {
                res.json(success(result));
              }
            }
          );
        } else if (req.query.max != undefined) {
          res.json(error("wrong max value"));
        } else {
          // Requête SQL pour sélectionner tous les membres
          db.query(" SELECT * FROM members", (err, result) => {
            if (err) {
              res.json(err.message);
            } else {
              res.json(success(result));
            }
          });
        }
      })
      // Endpoint pour ajouter un nouveau membre
      .post((req, res) => {
        // Vérification si le membre existe déjà
        db.query("SELECT * FROM members", (err, result) => {
          if (err) {
            res.json(err.message);
          } else {
            let alredyExist = result.some(
              (member) => member.email == req.body.email
            );

            if (alredyExist == true) {
              res.json(error("already exist"));
            } else {
              // Requête SQL pour insérer un nouveau membre
              db.query(
                "INSERT INTO members(firstName, lastName, email, phone, userName, password) VALUES (?, ?, ?, ?, ?, ?)",
                [
                  req.body.firstName,
                  req.body.lastName,
                  req.body.email,
                  req.body.phone,
                  req.body.userName,
                  req.body.password,
                ],
                (err, result) => {
                  if (err) {
                    res.json(err.message);
                  } else {
                    // Sélection du membre nouvellement inséré pour le renvoyer en réponse
                    db.query(
                      "SELECT * FROM members WHERE email = ?",
                      [req.body.email],
                      (err, result) => {
                        if (err) {
                          res.json(err.message);
                        } else {
                          res.json(
                            success({
                              id: result[0].id,
                              firstName: result[0].firstName,
                              lastName: result[0].lastName,
                              email: result[0].email,
                              phone: result[0].phone,
                              userName: result[0].username,
                              password: result[0].password,
                            }) // afficher les resultats de la requete sql
                          );
                        }
                      }
                    );
                  }
                }
              );
            }
          }
        });
      });

    // Endpoint pour un membre spécifique (par ID)
    MembersRouter.route("/:id")
      .get((req, res) => {
        // Requête SQL pour sélectionner un membre spécifique par son ID
        db.query(
          "SELECT * FROM members WHERE id = ?",
          [req.params.id],
          (err, result) => {
            if (err) {
              res.json(err.message);
            } else {
              if (result[0] != undefined) {
                // si le membre existe
                res.json(success(result[0])); // afficher les resultats de la requete sql
              } else {
                // si le membre n'existe pas
                res.json(error("Membre non trouvé"));
              }
            }
          }
        );
      })
      .put((req, res) => {
        // Vérification si le membre existe
        db.query(
          "SELECT * FROM members WHERE id = ?",
          [req.params.id],
          (err, result) => {
            if (err) {
              res.json(err.message);
            } else {
              if (result[0] != undefined) {
                // Requête SQL pour mettre à jour un membre spécifique par son ID
                db.query(
                  "UPDATE members SET name = ? WHERE id = ?",
                  [req.body.name, req.params.id],
                  (err, result) => {
                    if (err) {
                      res.json(err.message);
                    } else {
                      // Sélection du membre mis à jour pour le renvoyer en réponse
                      db.query(
                        "SELECT * FROM members WHERE id = ?",
                        [req.params.id],
                        (err, result) => {
                          if (err) {
                            res.json(err.message); // afficher les erreurs de requete sql
                          } else {
                            res.json(success(result[0])); // afficher les resultats de la requete sql
                          }
                        }
                      );
                    }
                  }
                );
              } else {
                // si le membre n'existe pas
                res.json(error("Membre not found"));
              }
            }
          }
        );
      })
      .delete((req, res) => {
        // Requête SQL pour supprimer un membre spécifique par son ID
        db.query(
          "DELETE FROM members WHERE id = ?",
          [req.params.id],
          (err, result) => {
            if (err) {
              res.json(err.message); // afficher les erreurs de requete sql
            } else {
              res.json(success(result)); // afficher les resultats de la requete sql
            }
          }
        );
      });

    // Utilisation du routeur pour les endpoints relatifs aux membres
    app.use(config.rootAPI + "members", MembersRouter); // on modifi avec config.json

    // Démarrage du serveur
    app.listen(config.port, () => {
      console.log("Serveer started");
    });
  }
});
