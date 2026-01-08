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
            `CREATE TABLE IF NOT EXISTS profiles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                personal_profile INTEGER DEFAULT 0,
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

    }
    
    async createProfile(username, image = null){
        const query = `INSERT INTO profiles (name, image) VALUES (?, ?)`;

        try{
            const result = await this.db.executeSQL(query, [username, image]);
        } catch(error) {
            console.log('Error when creating profile: ', error);
            throw error;
        }
    }
    //delete the profile and related contact fields
    async deleteProfile(username){

    }

    async updateProfile(username){

    }

    async getProfile(username){

    }

    async addContactField(profileID, field_type, field_value){

    }

    async editContactField(profileID, field_type, field_value){

    }

    async getContactFields(profileID, field_type = null){

    }

    async deleteContactField(){

    }

}
