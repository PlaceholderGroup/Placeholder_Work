import SQLite from 'react-native-sqlite-storage';


SQLite.enablePromise(true);


class DBHelper {
    constructor(){
        this.db = null;
    }


    async initDB() {
        this.db = await SQLite.openDatabase({
            name: 'contactsDB.db',
            location:'default'
        });
        console.log('Database opened successfully!');
    }

}
