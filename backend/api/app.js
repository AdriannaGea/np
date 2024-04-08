const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mysql = require("mysql");
const cors = require("cors");
const config = require("./config");
const { success, error } = require("./functions");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "mydatabase",
});

db.connect((err) => {
  //ATTENTION IMPORTANT
  if (err) {
    console.log(err); // afficher les erreurs de connexion a la base de donnees
  } else {
    console.log("Connecté à la base de données"); // afficher le message de connexion a la base de donnees

    // Router pour les endpoints concernant les lieux
    const NicePlacesRouter = express.Router();

    // Endpoint pour récupérer tous les lieux (ajouté ici)
    NicePlacesRouter.route("/")
      .get((req, res) => {
        // Requête SQL pour sélectionner tous les lieux
        db.query("SELECT * FROM niceplaces", (err, result) => {
          if (err) {
            console.error(
              "Erreur lors de l'exécution de la requête SQL:",
              err.message
            );
            res.json(error(err.message));
          } else {
            res.json(success(Array.isArray(result) ? result : [result]));
          }
        });
      })
      .post((req, res) => {
        // Extraction des données du corps de la requête
        const { title, description, imageUrl, location, tags } = req.body;
        // Requête SQL pour insérer un nouveau lieu dans la base de données
        const createdDate = new Date();
        const likes = 0;
        const dislikes = 0;
        db.query(
          "INSERT INTO niceplaces (title, description, imageUrl, createdDate, location, likes, dislikes, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          [
            title,
            description,
            imageUrl,
            createdDate,
            location,
            likes,
            dislikes,
            tags,
          ],
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

    // Endpoint pour un lieu spécifique (par ID) (ajouté ici)
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
        const {
          title,
          description,
          imageUrl,
          createdDate,
          location,
          likes,
          dislikes,
          tags,
        } = req.body;
        // Requête SQL pour mettre à jour un lieu spécifique par son ID
        db.query(
          "UPDATE niceplaces SET title = ?, description = ?, imageUrl = ?, createdDate = ?, location = ?, likes = ?, dislikes = ?, tags = ? WHERE id = ?",
          [
            title,
            description,
            imageUrl,
            createdDate,
            location,
            likes,
            dislikes,
            tags,
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
    // Route pour "liker" un lieu
    NicePlacesRouter.route("/:id/like").put((req, res) => {
      db.query(
        "UPDATE niceplaces SET likes = likes + 1 WHERE id = ?",
        [req.params.id],
        (err, result) => {
          if (err) {
            res.json(error(err.message));
          } else {
            db.query(
              "SELECT * FROM niceplaces WHERE id = ?",
              [req.params.id],
              (err, result) => {
                if (err) {
                  res.json(error(err.message));
                } else {
                  res.json(success(result[0]));
                }
              }
            );
          }
        }
      );
    });

    // Route pour "disliker" un lieu
    NicePlacesRouter.route("/:id/dislike").put((req, res) => {
      db.query(
        "UPDATE niceplaces SET dislikes = dislikes + 1 WHERE id = ?",
        [req.params.id],
        (err, result) => {
          if (err) {
            res.json(error(err.message));
          } else {
            db.query(
              "SELECT * FROM niceplaces WHERE id = ?",
              [req.params.id],
              (err, result) => {
                if (err) {
                  res.json(error(err.message));
                } else {
                  res.json(success(result[0]));
                }
              }
            );
          }
        }
      );
    });

    app.use(config.rootAPI + "niceplaces", NicePlacesRouter);

    // Router pour les endpoints concernant les membres
    const MembersRouter = express.Router();

    // Endpoint pour récupérer tous les membres (ajouté ici)
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
          res.json(error("Mauvaise valeur pour max"));
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
              res.json(error("déjà existant"));
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
                            })
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

    // Endpoint pour un membre spécifique (par ID) (ajouté ici)
    MembersRouter.route("/:id")
      // Récupération d'un membre par ID
      .get((req, res) => {
        db.query(
          "SELECT * FROM members WHERE id = ?",
          [req.params.id],
          (err, result) => {
            if (err) {
              res.json(err.message);
            } else {
              // Si un résultat est trouvé, renvoyer les données du membre
              if (result[0] != undefined) {
                res.json(success(result[0]));
              } else {
                // Sinon, renvoyer une erreur indiquant que le membre n'a pas été trouvé
                res.json(error("Membre non trouvé"));
              }
            }
          }
        );
      })
      // Modification d'un membre par ID
      .put((req, res) => {
        db.query(
          "SELECT * FROM members WHERE id = ?",
          [req.params.id],
          (err, result) => {
            if (err) {
              res.json(err.message);
            } else {
              if (result[0] != undefined) {
                // Mettre à jour le nom du membre dans la base de données
                db.query(
                  "UPDATE members SET name = ? WHERE id = ?",
                  [req.body.name, req.params.id],
                  (err, result) => {
                    if (err) {
                      res.json(err.message);
                    } else {
                      // Récupérer et renvoyer les nouvelles données du membre
                      db.query(
                        "SELECT * FROM members WHERE id = ?",
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
              } else {
                // Si le membre n'est pas trouvé, renvoyer une erreur
                res.json(error("Membre non trouvé"));
              }
            }
          }
        );
      })
      // Suppression d'un membre par ID
      .delete((req, res) => {
        db.query(
          "DELETE FROM members WHERE id = ?",
          [req.params.id],
          (err, result) => {
            if (err) {
              res.json(err.message);
            } else {
              // Renvoyer une réponse de succès après suppression
              res.json(success(result));
            }
          }
        );
      });

    // Utilisation du routeur pour l'endpoint "members"
    app.use(config.rootAPI + "members", MembersRouter);

    // Endpoint pour la connexion d'un utilisateur
    app.post("/login", (req, res) => {
      const { email, password } = req.body;
      db.query(
        "SELECT * FROM members WHERE email = ?",
        [email],
        async (err, result) => {
          if (err) {
            res.json(error(err.message));
          } else {
            if (result.length > 0) {
              // Vérification du mot de passe hashé
              const isPasswordValid = await bcrypt.compare(
                password,
                result[0].password
              );

              if (isPasswordValid) {
                // Si le mot de passe est valide, renvoyer un token (à générer)
                res.json(success({ token: "YourGeneratedTokenHere" }));
              } else {
                // Si le mot de passe est invalide, renvoyer une erreur
                res.json(error("Invalid credentials"));
              }
            } else {
              // Si l'email n'est pas trouvé, renvoyer une erreur
              res.json(error("Invalid credentials"));
            }
          }
        }
      );
    });

    app.listen(config.port, () => {
      console.log("Serveur démarré");
    });
  }
});
