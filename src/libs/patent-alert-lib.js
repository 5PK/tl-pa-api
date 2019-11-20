const Fs = require('fs')
const Axios = require('axios')
const Path = require('path')
const AdmZip = require('adm-zip');
const parseString = require('xml2js').parseString;

export async function downloadZip(){

    console.log("start zip download")

    // TODO: dynamic URL to get date each week

    const url = 'https://patentscur.reedtech.com/downloads/PatentAssignmentText/2019/ad20191023.zip'
    const path = Path.resolve(__dirname, 'patentFiles', 'ad20191023.zip')
    console.log(path)

    const response = await Axios({
        method: 'GET',
        url: url,
        responseType: 'stream'
    })

    response.data.pipe(Fs.createWriteStream(path))

    return new Promise((resolve, reject) => {
        response.data.on('end', () => {

            console.log('resolve')

            var zip = new AdmZip(path);
            var zipEntries = zip.getEntries(); // an array of ZipEntry records

            zipEntries.forEach(function(zipEntry) {
                console.log(zipEntry.entryName); // outputs zip entries information
                if (zipEntry.entryName == "ad20191023.xml") {
                    var xml = zipEntry.getData().toString('utf8'); 

                    parseString(xml, function (err, result) {
                        
                        var obj = result
                        var patentArr = obj["us-patent-assignments"]["patent-assignments"][0]["patent-assignment"]

                        

                        console.log(patentArr)
                        


                    })
               }
            });

            resolve()
        })

        response.data.on('error', err => {
            reject(err)
        })
    }
)}

function checkForAlerts(){




}



