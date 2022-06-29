const express = require("express")
const argv = require("minimist")(process.argv.slice(2))
const bodyParser = require("body-parser")
const { SES } = require("aws-sdk")

const PORT = argv.port || 8080

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.listen(PORT, () => {
  console.log("server running")
})

app.get("/uptime", (_req, res) => {
  res.json(`Server Up ${new Date()}`)
})

app.post("/get-ses-quota", (req, res) => {
  const { key, secret, region } = req.body

  if (!key || !secret || !region)
    res.json("Please provide key, secret and region!")

  const CONFIG = {
    accessKeyId: `${key}`,
    secretAccessKey: `${secret}`,
    region: `${region}`,
  }

  try {
    const ses = new SES(CONFIG)
    ses.getSendQuota((err, data) => {
      if (err) res.json(`Error: ${err.message}`)

      res.json(data)
    })
  } catch (err) {
    res.json(`Error: ${err.message}`)
  }
})
