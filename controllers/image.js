const Clarifai = require('clarifai');


const app = new Clarifai.App({
    apiKey: '937877526b2b4fa4818a0eac45ea430d'
})

const handleApiCall = (req,res) => {
    app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
        res.json(data);
    })
    .catch(err => res.status(400).json('Unable to Work Request'))

}

const handleImage = (req,res, db) => {
    const {id} = req.body;
    db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries)
    })
    .catch(error => res.status(400).json('Unable to get entries.'))
}

module.exports = {
    handleImage: handleImage, handleApiCall: handleApiCall
}