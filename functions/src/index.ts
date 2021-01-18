import * as functions from 'firebase-functions';
import { saveFeederDetails } from './SaveDetailsFeeder';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const savefeedDetails = functions.https.onRequest((req, res) => {
    functions.logger.info("Hello logs!", { structuredData: true });

    res.set('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') {
        // Send response to OPTIONS requests
        res.set('Access-Control-Allow-Methods', 'GET');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.set('Access-Control-Max-Age', '3600');
        res.status(204).send('');
    } else {
        saveFeederDetails(req.body).then(result => {
            res.status(200).send('Success');
        }).catch(err => {
            console.log(err);
            res.status(500).send('Faild to save Details');
        })
    }
});
