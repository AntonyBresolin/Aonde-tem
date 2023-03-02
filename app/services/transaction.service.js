const transactionService = {
    findByUser: user => {
        return firebase.firestore()
            .collection('transactions')
            .where('municipio', '==',  localStorage.getItem('estado'))
            .orderBy('date', 'desc')
            .get()
            .then(snapshot => {
                return snapshot.docs.map(doc => ({
                    ...doc.data(),
                    uid: doc.id
                }));
            })
    },
    findByMunicipio: municipio => {
        return firebase.firestore()
            .collection('transactions')
            .where('municipio', '==', municipio)
            .orderBy('price', 'desc')
            .get()
            .then(snapshot => {
                return snapshot.docs.map(doc => ({
                    ...doc.data(),
                    uid: doc.id
                }));
            })
    },
    findAll: user => {
        return firebase.firestore()
            .collection('transactions')
            .orderBy('date', 'desc')
            .get()
            .then(snapshot => {
                return snapshot.docs.map(doc => ({
                    ...doc.data(),
                    uid: doc.id
                }));
            })
    },
    findByUid: uid => {
        return firebase.firestore()
            .collection("transactions")
            .doc(uid)
            .get()
            .then(doc => {
                return doc.data();
            })
    },
    findByMunicipio: municipio => {
        return firebase.firestore()
            .collection("transactions")
            .doc(municipio)
            .get()
            .then(doc => {
                return doc.data();
            })
    },
    remove: transaction => {
        return firebase.firestore()
            .collection("transactions")
            .doc(transaction.uid)
            .delete();
    },
    save: transaction => {
        return firebase.firestore()
            .collection('transactions')
            .add(transaction);
    },
    update: transaction => {
        return firebase.firestore()
            .collection("transactions")
            .doc(getTransactionUid())
            .update(transaction);
    }
}

