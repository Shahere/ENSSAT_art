const express = require('express')
const fs = require('fs');
const { exec } = require('child_process');

const app = express()
const port = 3000

app.get('/', async (req, res) => {
  getMemData().then((data) => {
    console.log(data)
    let result = '<table>';
    for (let i = 0; i < data; i++) {
      result+='<tr>'
      for (let i = 0; i < data; i++) {
        result+='<td>1</td>'
      }
      result+='</tr>'
    }
    result += '</table>';
    res.send(result)
  });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

async function getMemData() {
  return new Promise((resolve, reject) => {
    let nbdata = 0
    exec('sudo hexdump /dev/mem', (err, stdout, stderr) => {
      if (err) {
        //some err occurred
        console.error(err)
      } else {
        // the *entire* stdout and stderr (buffered)
        //console.log(stdout);
        let data = stdout.split(' ')
        let bin = null;
        for (let i = 0; i < data.length; i++) {
          if ((i + 1) % 8 != 1) {
            nbdata = nbdata + 1
            //console.log(data[i])
            //bin=hex2bin(data[i])
            //console.log(bin)
          }
        }
      }
      let nbBin = nbdata * 8
      console.log(nbBin)
      let nbCol = String(Math.sqrt(nbBin)).split('.')[0]
      console.log(nbCol)
      resolve(nbCol)
    });
  });
}

function hex2bin(hex) {
  return ("00000000" + (parseInt(hex, 16)).toString(2)).substr(-8);
}