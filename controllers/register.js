// REGISTER
const handleRegister = (req,res,db,bcrypt) => {
    const {email, name, password} = req.body;
    if(!email || !name || !password){
        return res.status(400).json('Incorrect Form Submission');
    }
    /*
    we want to update 2 tables and if something messes up we want both to fail
    trx / transaction allows for this
    first we insert data into the login table then users
    */
    const hash = bcrypt.hashSync(password);
        db.transaction(trx => {
            trx.insert({
                hash: hash,
                email: email
            })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                    .returning('*')
                    .insert({
                        // loginEmial is an array grab first element
                        email: loginEmail[0],
                        name: name,
                        joined: new Date()
                    })
                    .then(user => {
                        res.json(user[0]);
                    })    
            })
            .then(trx.commit)
            .catch(trx.rollback)
        })
        
        .catch(error => res.status(400).json('Unable to register.'));
};

module.exports = {
    handleRegister: handleRegister
};
