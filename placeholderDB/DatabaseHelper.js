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
                contact_id INTEGER NOT NULL,
                field_type TEXT NOT NULL,
                field_value TEXT NOT NULL,
                FOREIGN KEY (contact_id) REFERENCES contacts(id)
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
            const result = await this.db.executeSql(query, [name, image]);
        } catch(error) {
            console.log('Error when creating contact: ', error);
            throw error;
        }
    }
    //delete the profile and related contact fields
    async deleteContact(name){
        const query = `DELETE FROM contacts WHERE name = ?`;
        try{
            const result = await this.db.executeSql(query, [name]);
        }catch(error){
            console.log('There was an error with deleting the contact: ', error);
            throw error;
        }

    }

    async updateContact(name, newName, image=null){
        //need to grab all relevent contact fields and update them by calling addContactField
        const query = `UPDATE contacts SET name = ?, image = ? WHERE name = ?`;
        try{
            const result = await this.db.executeSql(query, [newName, image, name])
        }catch(error){
            console.log('Error updating contact: ', error);
            throw(error);
        }
    }

    async getContact(name){
        const query = `SELECT * FROM contacts WHERE name = ?`;
        try{
            const result = await this.db.executeSql(query, [name]);
            return result;
        }catch(error){
            console.log('Error when grabbing contact: ', error);
            throw(error);
        }

    }

    async addContactField(contact_id, field_type, field_value){
        const query = `INSERT INTO contact_fields (contact_id, field_type, field_value) VALUES (?, ?, ?)`;
        try{
            const result = await this.db.executeSql(query, [contact_id, field_type, field_value]);
        } catch(error){
            console.log('Error when adding the contact field: ', error);
            throw(error);
        }
    }

    async editContactField(contact_id, field_type, field_value){
        const query = `UPDATE contact_fields SET field_value = ? WHERE contact_id = ? AND field_type = ?`;
        try{
            const result = await this.db.executeSql(query, [field_value, contact_id, field_type])
        }catch(error){
            console.log('Error when editing contact fields: ', error);
            throw(error);
        }

    }

    async getContactFields(contact_id, field_type = null){
        if (field_type){
            const query = `SELECT field_value FROM contact_fields WHERE contact_id = ? AND field_type = ?`;
            try{
                const result = await this.db.executeSql(query, [contact_id, field_type])
                return result;
            } catch(error){
                console.log('Error getting the contact field: ', error);
                throw(error);
            }
        }else{
            const query = `SELECT field_type, field_value FROM contact_fields WHERE contact_id = ?`;
            try{
                const result = await this.db.executeSql(query, [contact_id]);
                return result;
            } catch(error){
                console.log('Error trying to retrieve contact fields: ', error);
                throw(error);
            }
        }
        

    }

    async deleteContactField(contact_id, to_delete_field){
        const query = `DELETE FROM contact_fields WHERE contact_id = ? AND field_type = ?`;
        try{
            const result = await this.db.executeSql(query, [contact_id, to_delete_field])
        }catch(error){
            console.log('Error deleting contact field: ', error);
            throw(error);
        }
    }
}

//export for imports elsewhere:
export default new DBHelper();