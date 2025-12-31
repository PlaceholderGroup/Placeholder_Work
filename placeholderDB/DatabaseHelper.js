import SQLite from 'react-native-sqlite-storage';


SQLite.enablePromise(true);


class DBHelper {
    constructor(){
        this.db = null;
    }


    async initDB() {
        // await = pause while this happens
        try{ 
        this.db = await SQLite.openDatabase({
            name: 'contactsDB.db',
            location:'default'
        });
        console.log('Database opened successfully!');

        // create necessary tables
        await this.createTables(); //need to make this still

        } catch(error){
        console.log('Issue with opening the database.');
        throw(error);
        }
    }

    async createTables(){
        // create the tables we need
        const queries = [
            `CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                photo REAL
        );`

        ];

    }

}
