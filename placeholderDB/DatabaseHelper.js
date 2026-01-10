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
                profile_image_path TEXT
        );`, // profileImage path to wherever its stored on phone
            `CREATE TABLE IF NOT EXISTS contacts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                personal_contact INTEGER DEFAULT 0,
                name TEXT UNIQUE NOT NULL,
                image TEXT
        );`,
            `CREATE TABLE IF NOT EXISTS contact_fields (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                profile_id INTEGER NOT NULL,
                field_type TEXT NOT NULL,
                field_value TEXT NOT NULL,
                FOREIGN KEY (profile_id) REFERENCES profiles(id)
        );`
        ];

        try{
            for (const query of queries){
                await this.db.executeSql(query);
            }
        }catch(error){
            console.log('Error when creating tables: ', error);
            throw error;
        }

    }

    async createNewUser(username, password_hash){
        const query = `INSERT INTO users (username, password_hash) VALUES (?, ?)`;
        try{
            const result = await this.db.executeSql(query, [username, password_hash]);
        }catch(error){
            console.log('Theres been an error when creating new user: ', error);
            throw(error);
        }

    }
    
    async createContact(name, image = null){
        const query = `INSERT INTO contacts (name, image) VALUES (?, ?)`;

        try{
            const result = await this.db.executeSQL(query, [name, image]);
        } catch(error) {
            console.log('Error when creating contact: ', error);
            throw error;
        }
    }
    //delete the profile and related contact fields
    async deleteContact(name){
        const query = `DELETE contacts WHERE (name) VALUES(?)`;
        
        try{
            const result = await this.db.executeSql(query, [name]);
        }catch(error){
            console.log('There was an error with deleting the contact: ', error);
            throw error;
        }

    }

    async updateContact(username){
        //need to grab all relevent contact fields and update them by calling addContactField
        const query = ``;
    }

    async getContact(username){
        const query = ``;
    }

    async addContactField(profileID, field_type, field_value){
        const query = ``;
    }

    async editContactField(profileID, field_type, field_value){
        const query = ``;

    }

    async getContactFields(profileID, field_type = null){
        const query = ``;

    }

    async deleteContactField(to_delete_field){
        const query = `DELETE contacts WHERE (field_type) VALUES (?)`;
        try{
            const result = await this.db.executeSql(query, [to_delete_field])
        }catch(error){
            console.log('Error deleting contact field: ', error);
            throw(error);
        }
        

    }

}
