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
        await this.createTables(); 

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
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                profile_image_path TEXT
        );`, // profileImage path to wherever its stored on phone
            `CREATE TABLE IF NOT EXISTS contacts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                personal_contact INTEGER DEFAULT 0,
                name TEXT UNIQUE NOT NULL,
                existing_contact_path TEXT,
                image TEXT
        );`,
            `CREATE TABLE IF NOT EXISTS contact_fields (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                contact_id INTEGER NOT NULL,
                field_type TEXT NOT NULL,
                field_value TEXT NOT NULL,
                FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE
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

//CREATE:

    async createNewUser(username){
        const query = `INSERT INTO users (username) VALUES (?)`;
        try{
            const result = await this.db.executeSql(query, [username]);
            return result[0].insertId;
        }catch(error){
            console.log('Theres been an error when creating new user: ', error);
            throw(error);
        }

    }
    
    async createContact(name, image = null, existing_contact_path = null){
        const query = `INSERT INTO contacts (name, image, existing_contact_path) VALUES (?, ?, ?)`;

        try{
            const result = await this.db.executeSql(query, [name, image, existing_contact_path]);
            return result[0].insertId;
        } catch(error) {
            console.log('Error when creating contact: ', error);
            throw error;
        }
    }

    async createContactField(contact_id, field_type, field_value){
        const query = `INSERT INTO contact_fields (contact_id, field_type, field_value) VALUES (?, ?, ?)`;

        try{
            const result = await this.db.executeSql(query, [contact_id, field_type, field_value]);
            return result[0].insertId;
        } catch(error){
            console.log('Error when adding the contact field: ', error);
            throw(error);
        }
    }


//READ:

     async getContact(name){
        const query = `SELECT * FROM contacts WHERE name = ?`;
        try{
            const result = await this.db.executeSql(query, [name]);
            if (result[0].rows.length > 0){
                return result[0].rows.item(0);
            };
            return null;
        }catch(error){
            console.log('Error when grabbing contact: ', error);
            throw(error);
        }

    }

    //make field_type an array so you can grab any number of field types at one time
    async getContactFields(contact_id, field_type = null){
        if (field_type){
            const query = `SELECT field_value FROM contact_fields WHERE contact_id = ? AND field_type = ?`;
            try{
                const result = await this.db.executeSql(query, [contact_id, field_type])
                if (result[0].rows.length > 0){
                return result[0].rows.item(0);
                };
                return null;
            } catch(error){
                console.log('Error getting the contact field: ', error);
                throw(error);
            }
        }else{
            const query = `SELECT field_type, field_value FROM contact_fields WHERE contact_id = ?`;
            try{
                const result = await this.db.executeSql(query, [contact_id]);
                const fields = [];
                for(let i = 0; i < result[0].rows.length; i++){
                    fields.push(result[0].rows.item(i));
                }
                
            return fields;
            } catch(error){
                console.log('Error trying to retrieve contact fields: ', error);
                throw(error);
            }
        }
        

    }
    

//UPDATE:



    async updateContact(name, newName, image=null, existing_contact_path=null){
        
        const query = `UPDATE contacts SET name = ?, image = ?, existing_contact_path = ? WHERE name = ?`;
        try{
            const result = await this.db.executeSql(query, [newName, image, existing_contact_path, name])
            console.log('Rows affected: ', result[0].rowsAffected)
            return result[0].rowsAffected
        }catch(error){
            console.log('Error updating contact: ', error);
            throw(error);
        }
    }

   
    async updateContactField(contact_id, field_type, field_value){
        const query = `UPDATE contact_fields SET field_value = ? WHERE contact_id = ? AND field_type = ?`;
        try{
            const result = await this.db.executeSql(query, [field_value, contact_id, field_type])
            console.log('Rows affected: ', result[0].rowsAffected)
            return result[0].rowsAffected;
        }catch(error){
            console.log('Error when editing contact fields: ', error);
            throw(error);
        }

    }


//DELTE:
    async deleteContact(name){
        const query = `DELETE FROM contacts WHERE name = ?`;
        try{
            const result = await this.db.executeSql(query, [name]);
            return result[0].rowsAffected;
        }catch(error){
            console.log('There was an error with deleting the contact: ', error);
            throw error;
        }

    }

    async deleteContactField(contact_id, to_delete_field){
        const query = `DELETE FROM contact_fields WHERE contact_id = ? AND field_type = ?`;
        try{
            const result = await this.db.executeSql(query, [contact_id, to_delete_field])
            console.log('Rows affected: ', result[0].rowsAffected);
            return result[0].rowsAffected;
        }catch(error){
            console.log('Error deleting contact field: ', error);
            throw(error);
        }
    }
}

//export for imports elsewhere:
export default new DBHelper();