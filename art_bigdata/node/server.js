const express = require('express')
const fs = require('fs');
const { exec } = require('child_process');

const app = express()
const port = 3000

app.get('/', async (req, res) => {
  let binaryNumber = [];
  getMemData().then((data) => {
    let nbData = data.length;
    for (let i = 0; i < nbData; i++) {
      let binaryElement = hex2bin(data[i]).toString().split('')
      binaryElement.forEach(element => {
        binaryNumber.push(element)
      });
    }
    console.log(binaryNumber)
    console.log(binaryNumber.length)
    let largeur = Math.floor(Math.sqrt(binaryNumber.length))
    let result = '<table cellspacing=0 style="height: 100%, width: 100%">';
    for (let i = 0; i < largeur; i++) {
      result+='<tr>'
      for (let j = 0; j < largeur; j++) {
        if(binaryNumber[i+j] == 1) {
          result+='<td bgcolor=#000></td>'
        } else {
          result+='<td bgcolor=#FFF></td>'
        }
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
    let data = null;
    let betterData = [];
    exec('sudo hexdump /dev/mem', (err, stdout, stderr) => {
      if (err) {
        console.error(err)
      } else {
        data = stdout.split(' ')
        let bin = null;
        for (let i = 0; i < data.length; i++) {
          if ((i + 1) % 8 != 1) {
            nbdata = nbdata + 1
            betterData.push(data[i])
            //console.log(data[i])
            //bin=hex2bin(data[i])
            //console.log(bin)
          }
        }
      }
      //console.log(betterData)
      resolve(betterData)
    });
  });
}

function hex2bin(hex) {
  return ("00000000" + (parseInt(hex, 16)).toString(2)).substr(-8);
}