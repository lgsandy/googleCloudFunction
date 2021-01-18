import * as admin from 'firebase-admin'
admin.initializeApp();

function saveFeederDetails(reqDetails: any) {
    return new Promise((resolve, reject) => {
        let reqData: any = reqDetails;

        // check if data is available or not
        admin.firestore().collection('sectionsfeedinfo').doc(reqData.sectionId).collection('info').doc('todaydate').get()
            .then(retriveDocument => {

                let doucmentTobeSaved: any = { [reqData.sectionId]: {} }
                if (retriveDocument.exists) {
                    //check for Last update time
                    let previousDocument: any = retriveDocument.data();
                    var prevLut = previousDocument[reqData.sectionId]['lut'];
                    var reqLut = reqData.lastupdated;
                    var documentLut = new Date(prevLut * 1000);
                    var requestLut = new Date(reqLut * 1000);
                    var fdocumentLut = documentLut.toISOString().substr(0, 10)
                    var frequestLut = requestLut.toISOString().substr(0, 10)

                    if (fdocumentLut == frequestLut) {

                    } else {

                        console.log(
                            "sectionId:" + reqData.sectionId + " PrevLut:" + prevLut
                        );
                        var path = prevLut.toString();
                        // save to history
                        admin.firestore().collection('sectionsfeedinfo').doc(reqData.sectionId).collection('history').doc(path).set(previousDocument)
                            .then(result => {
                                // resolve(false)
                                let newPond = {
                                    'pondId': reqData.pondId,
                                    [reqData.mealId]: { 'leftoverpercentage': reqData.leftoverpercentage, 'kg': reqData.kg },
                                    'todayFeed': reqData.kg,
                                    'totalFeed': 0
                                }
                                doucmentTobeSaved[reqData.sectionId]['lut'] = reqData.lastupdated;
                                doucmentTobeSaved[reqData.sectionId][reqData.pondId] = newPond;
                                doucmentTobeSaved[reqData.sectionId]['todayFeed'] = 0;
                                doucmentTobeSaved[reqData.sectionId]['totalFeed'] = 0;
                                admin.firestore().collection('sectionsfeedinfo').doc(reqData.sectionId).collection('info').doc('todaydate').set(doucmentTobeSaved)
                                    .then(result => {
                                        console.log("Success");
                                        resolve('Success');
                                    }).catch(err => {
                                        reject(err)
                                    })
                            }).catch(err => {
                                reject(err)
                            })


                    }
                    //for datechange
                    //check for pond
                    if (previousDocument[reqData.sectionId][reqData.pondId]) {
                        //check for meal
                        console.log('in meal check');
                        if (previousDocument[reqData.sectionId][reqData.pondId][reqData.mealId]) {
                            //update meal
                            let updatedMeal = { 'leftoverpercentage': reqData.leftoverpercentage, 'kg': reqData.kg }
                            previousDocument[reqData.sectionId][reqData.pondId][reqData.mealId] = updatedMeal;
                            //update todyfeed
                            previousDocument[reqData.sectionId][reqData.pondId]['todayFeed'] += reqData.kg;
                            admin.firestore().collection('sectionsfeedinfo').doc(reqData.sectionId).collection('info').doc('todaydate').set(previousDocument, { merge: true })
                                .then(result => {
                                    console.log("Success");
                                    resolve('Success');
                                }).catch(err => {
                                    reject(err)
                                })
                        } else {
                            //create new meal
                            let newMeal = { 'leftoverpercentage': reqData.leftoverpercentage, 'kg': reqData.kg }
                            previousDocument[reqData.sectionId][reqData.pondId][reqData.mealId] = newMeal;
                            //update todyfeed
                            previousDocument[reqData.sectionId][reqData.pondId]['todayFeed'] += reqData.kg;
                            admin.firestore().collection('sectionsfeedinfo').doc(reqData.sectionId).collection('info').doc('todaydate').set(previousDocument, { merge: true })
                                .then(result => {
                                    console.log("Success");
                                    resolve('Success');
                                }).catch(err => {
                                    reject(err)
                                })
                        }
                    } else {
                        console.log("pond not found");
                        //create new pond
                        let newPond = {
                            'pondId': reqData.pondId,
                            [reqData.mealId]: { 'leftoverpercentage': reqData.leftoverpercentage, 'kg': reqData.kg },
                            'todayFeed': reqData.kg,
                            'totalFeed': 0
                        }
                        previousDocument[reqData.sectionId][reqData.pondId] = newPond;
                        admin.firestore().collection('sectionsfeedinfo').doc(reqData.sectionId).collection('info').doc('todaydate').set(previousDocument, { merge: true })
                            .then(result => {
                                console.log("Success");
                                resolve('Success');
                            }).catch(err => {
                                reject(err)
                            })
                    }
                } else {
                    let newPond = {
                        'pondId': reqData.pondId,
                        [reqData.mealId]: { 'leftoverpercentage': reqData.leftoverpercentage, 'kg': reqData.kg },
                        'todayFeed': reqData.kg,
                        'totalFeed': 0
                    }
                    doucmentTobeSaved[reqData.sectionId][reqData.pondId] = newPond;
                    doucmentTobeSaved[reqData.sectionId]['lut'] = reqData.lastupdated;
                    doucmentTobeSaved[reqData.sectionId]['todayFeed'] = 0;
                    doucmentTobeSaved[reqData.sectionId]['totalFeed'] = 0;
                    admin.firestore().collection('sectionsfeedinfo').doc(reqData.sectionId).collection('info').doc('todaydate').set(doucmentTobeSaved)
                        .then(result => {
                            console.log("Success");
                            resolve('Success');
                        }).catch(err => {
                            reject(err)
                        })
                }
            }).catch(err => {
                reject(err);
            })

        // .then(result => {
        //     console.log(result.exists);
        //     var document: any;
        //     var merge = false;
        //     if (result.exists) {
        //         document = result.data();
        //         //check pond is available or not
        //         if (document[reqData.sectionId][reqData.pondId]) {
        //             //check for meal
        //             if (document[reqData.sectionId][reqData.pondId][reqData.mealId]) {
        //                 //update meal
        //                 let updatedMeal = { 'leftoverpercentage': reqData.leftoverpercentage, 'kg': reqData.kg }
        //                 document[reqData.sectionId][reqData.pondId][reqData.mealId] = updatedMeal;
        //                 //update todyfeed
        //                 document[reqData.sectionId][reqData.pondId]['todayFeed'] += reqData.kg;
        //                 merge = true;
        //             } else {
        //                 //add new meal
        //                 let newMeal = { 'leftoverpercentage': reqData.leftoverpercentage, 'kg': reqData.kg }
        //                 document[reqData.sectionId][reqData.pondId][reqData.mealId] = newMeal;
        //                 //update todyfeed
        //                 document[reqData.sectionId][reqData.pondId]['todayFeed'] += reqData.kg;
        //                 merge = true;
        //             }
        //         } else {
        //             //add new pond
        //             let newPond = {
        //                 'pondId': reqData.pondId,
        //                 [reqData.mealId]: { 'leftoverpercentage': reqData.leftoverpercentage, 'kg': reqData.kg },
        //                 'todayFeed': reqData.kg,
        //                 'totalFeed': 0
        //             }
        //             document[reqData.sectionId][reqData.pondId] = newPond;
        //             merge = true;
        //         }
        //     } else {
        //         merge = false;
        //         document = { [reqData.sectionId]: {} }
        //         let newPond = {
        //             'pondId': reqData.pondId,
        //             [reqData.mealId]: { 'leftoverpercentage': reqData.leftoverpercentage, 'kg': reqData.kg },
        //             'todayFeed': reqData.kg,
        //             'totalFeed': 0
        //         }
        //         document[reqData.sectionId][reqData.pondId] = newPond;
        //         document[reqData.sectionId]['lut'] = reqData.lastupdated;
        //     }
        //     console.log('3');
        //     console.log(document[reqData.sectionId]['lut']);
        //     checkLastUpdatedTime(document, reqData).then(isDateChange => {
        //         console.log('1' + isDateChange);
        //         if (isDateChange) {

        //         } else {
        //             merge = true;
        //             document[reqData.sectionId]['lut'] = reqData.lastupdated;
        //             console.log('2');
        //         }
        //         admin.firestore().collection('sectionsfeedinfo').doc('todaydata')
        //             .set(document, { merge: merge }).then(details => {
        //                 resolve('Success')
        //             }).catch(err => {
        //                 reject(err);
        //             })
        //     })

        // }).
        // catch(err => {
        //     reject(err);
        // })
    })
}

// function checkLastUpdatedTime(prevDoc: any, reqData: any) {
//     console.log("in check last update");
//     return new Promise((resolve, reject) => {

//         var prevLut = prevDoc[reqData.sectionId]['lut'];
//         var reqLut = reqData.lastupdated;
//         var documentLut = new Date(prevLut * 1000);
//         var requestLut = new Date(reqLut * 1000);
//         var fdocumentLut = documentLut.toISOString().substr(0, 10)
//         var frequestLut = requestLut.toISOString().substr(0, 10)

//         if (fdocumentLut == frequestLut) {
//             resolve(true);
//         } else {
//             //save to history
//             // admin.firestore().collection('sectionsfeedinfo').doc(reqData.sectionId).collection('history').doc(prevLut).set(prevDoc)
//             //     .then(result => {
//             //         resolve(false)
//             //     }).catch(err => {
//             //         reject(err)
//             //     })

//         }
//     })

// }

export { saveFeederDetails }