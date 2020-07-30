const express = require('express')
const assistant = require('./utils/assistent')

const routes = express.Router()

const handleError = (res, err) => {
  const status = err.code !== undefined && err.code > 0 ? err.code : 500;
  return res.status(status).json(err);
}


routes.get('/assistent', (req, res) => {
  assistant.session()
    .then(sessionid => {
      console.log('Successfully connected to Watson Assistant');
      return res.json("Ok")
    })
    .catch(err => {
      const msg = 'Failed to connect to Watson Assistant';
      console.error(msg);
      console.error(err);
      return res.status(400).json("Deu ruim")
    })
})

routes.get('/assistent/session', (req, res) => {
  assistant.session()
    .then(session_id => res.send({ session_id }))
    .catch(err => handleError(res, err))
})

routes.post('/assistent/message', (req, res) => {
  const { text = "", session_id } = req.body

  assistant.message(text, session_id)
    .then(result => {
      const message = result.generic[0].text

      res.json({ message })
    })
    .catch(err => handleError(res, err));
})

module.exports = routes
