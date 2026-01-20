import DBHelper from './DatabaseHelper'

describe('DB Tests', () => {

    let testContactId;
    //init a test db
    beforeAll(async () => {
        await DBHelper.initDB();
    });

    //test user creation
    test('should create a new user', async() =>{
        const userId = await DBHelper.createNewUser('testUser');
        expect(userId).toBeGreaterThan(0);
    });

    test('should create new contact', async() => {
        const contactId = await DBHelper.createContact('Alice', 'Alice.jpg');
        expect(contactId).toBeGreaterThan(0);
    });

    test('should create new contact field', async() => {
        const contactField = await DBHelper.createContactField(1, 'LinkedIn', 'linkedin.com');
        const contactField2 = await DBHelper.createContactField(1, 'Email', 'Alice@email.com');
        expect(contactField).toBeGreaterThan(0);
        expect(contactField2).toBeGreaterThan(0);
    });

    test('should get contact', async() => {
        const contactRetrieved = await DBHelper.getContact('Alice');
        expect(contactRetrieved).not.toBeNull();
        expect(contactRetrieved.name).toBe('Alice');
        expect(contactRetrieved.image).toBe('Alice.jpg');
    });



    test('should get contact field', async() => {
        const fieldRetrieved = await DBHelper.getContactFields('1', 'LinkedIn');
        expect(fieldRetrieved).not.toBeNull();
        expect(fieldRetrieved.field_value).toBe('linkedin.com');
    });

    test('should get all contact fields', async() => {
        const fieldsRetrieved = await DBHelper.getContactFields('1');
        expect(fieldsRetrieved).toHaveLength(2);
        expect(fieldsRetrieved).toEqual(
            expect.arrayContaining([
                expect.objectContaining({field_type: 'LinkedIn', field_value:'linkedin.com'}),
                expect.objectContaining({field_type: 'Email', field_value: 'Alice@email.com'})
            ])
        );
    });

    test('should update contact field', async() => {
        const updatedField = await DBHelper.updateContactField('1', 'LinkedIn', 'AliceLinkedIn');
        expect(updatedField.field_value).toBe('AliceLinkedIn');
    });

    test('should update contact', async() => {
        const rowsAffected = await DBHelper.updateContact('Alice', 'newAlice', 'AlicePic.jpg');
        expect(rowsAffected).toBe(1);

        const updatedContactGrab = await DBHelper.getContact('Alice');
        expect(updatedContactGrab.name).toBe('newAlice');
        expect(updatedContactGrab.image).toBe('AlicePic.jpg');
    });

    test('should delete a contact field', async () => {
        const rowsAffected = DBHelper.deleteContactField('1', 'LinkedIn');
        expect(rowsAffected).toBe(1);

        const fieldsRemaining = DBHelper.getContactFields('1');
        expect(fieldsRemaining).toHaveLength(1);
    });

    test('should CASCADE delete on deletion of contact', async() => {
        const rowsAffected = DBHelper.deleteContact('Alice');
        expect(rowsAffected).toBe(1);

        const deleteContact = DBHelper.getContact('Alice');
        expecte(deleteContact).toBeNull();

        const fields = DBHelper.getContactFields('Email');
        expect(fields).toHaveLength(0);
    });

    test('should check for null contact', async() => {
        const contact = DBHelper.getContact('Alice');
        expect(contact).toBeNull();

    });

    test('should check for null contact field', async () => {
        const field  = DBHelper.getContactFields('1');
        expect(field).toBeNull();
    });

})