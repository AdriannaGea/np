require('babel-register');
const bodyParser = require('body-parser');
//installer le package mysql avec npm install mysql ou npm install --save babel-register mysql
const mysql = require('mysql'); // mysql module pour etablir la connexion avec la base de donnees
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodejs'
});

db.connect((err) => {
    if(err){
        console.log(err); // afficher les erreurs de connexion a la base de donnees 
    }else{

        console.log('Connected to database'); // afficher le message de connexion a la base de donnees

        db.query(' SELECT * FROM members',(err,result) =>{ // requete sql pour afficher tous les membres de la base de donnees
            if(err){
                console.log(err); // afficher les erreurs de requete sql
            }else{
                console.log(result); // afficher les resultats de la requete sql
            }
        })


    }
});