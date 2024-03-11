exports.success =  function(result) { // fonction qui permet de retourner un succès
    return {
        status: 'success',
        result: result
    }
}

exports.error = function(error){ // fonction qui permet de retourner une erreur
    return {
        status: 'error',
        error: error
    }
}