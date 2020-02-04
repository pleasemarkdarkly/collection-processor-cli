const sqlite = require('./aa_sqlite');
const logger = require('node-color-log');
const cmd = require('./app_commands');

const email_step_count = 1000;

async function create_credential_storage() {
    try {
        await sqlite.open(cmd.collection_processor_cli_config.sqlite_filename);
    } catch (e) {
        logger.error('db: opening: ' + e);
    }

    try {
        var r = await sqlite.run('CREATE TABLE IF NOT EXISTS tbl_files ' +
            '(ID integer PRIMARY KEY AUTOINCREMENT, filepath text, ' +
            'line_count integer, possible_emails integer); ' +
            'DELETE from tbl_files;')
        if (r) logger.info("db: tbl_files created");
    } catch (e) {
        logger.error('db: create tbl_files: ' + e);
    }

    try {
        var r = await sqlite.run('CREATE TABLE IF NOT EXISTS tbl_credentials ' +
            '(ID integer PRIMARY KEY AUTOINCREMENT, filename text, ' +
            'line text, line_number integer); ' +
            'DELETE from tbl_credentials;')
        if (r) logger.info("db: tbl_credentials created");
    } catch (e) {
        logger.error('db: create tbl_credentials: ' + e);
    }

    try {
        var r = await sqlite.run('CREATE TABLE IF NOT EXISTS tbl_emails ' +
            '(ID integer PRIMARY KEY AUTOINCREMENT, ' +
            'email text, is_valid integer, is_error integer, is_warning integer); ' +
            'DELETE from tbl_emails;')
        if (r) logger.info("db: tbl_emails created");
    } catch (e) {
        logger.error('db: create tbl_emails: ' + e);
    }
}

async function insert_files(id, filepath, line_count, possible_emails) {
    var entry = `'${id}', '${filepath}', '${line_count}', '${possible_emails}'`
    var sql = "INSERT INTO tbl_files(ID, filepath, line_count, possible_emails) VALUES (" + entry + ")"

    try {
        var r = await sqlite.run(sql);
        if (r) logger.info('db: (inserted) file: (' + filepath + ') lines: (' + line_count + ') emails: (' + possible_emails + ')');
    } catch (e) {
        logger.error('db: insert: ' + e);
        logger.error('db: variables: ' + sql)
    }
}

async function insert_credentials(id, filename, line, line_number) {
    var entry = `'${id}', '${filename}', '${line}', '${line_number}'`
    var sql = "INSERT INTO tbl_credentials(ID, filename, line, line_number) VALUES (" + entry + ")"

    try {
        var r = await sqlite.run(sql);
        if (id % email_step_count == 0) {
            if (r) logger.info('db: (inserted) (' + line_number + ') [' + line + '] file: (' + filename + ')');
        }
    } catch (e) {
        logger.error('db: insert: ' + e);
        logger.error('db: variables: ' + sql);
    }
}

async function insert_emails(id, email, is_valid = null, is_error = null, is_warning = null) {
    var entry = `'${id}', '${email}', '${is_valid}', '${is_error}', '${is_warning}'`
    var sql = "INSERT INTO tbl_emails(ID, email, is_valid, is_error, is_warning) VALUES (" + entry + ")"

    try {
        var r = await sqlite.run(sql);
        if (id % email_step_count == 0) {
            if (r) logger.info('db: (inserted) (' + email + ') (is_valid/is_error/is_warning)[' + is_valid + '][' + is_error + '][' + is_warning + ']');
        }
    } catch (e) {
        logger.error('db: insert: ' + e);
        logger.error('db: variables: ' + sql);
    }
}

async function close_credential_storage() {
    try {
        logger.warn('db: closing credential storage');
        await sqlite.close();
    } catch (e) {
        logger.error('db: closing: ' + e);
    }
}

async function remove_credentials_storage() {
    const fs = require('fs');
    try {
        logger.warn('db: removing db: ' + cmd.collection_processor_cli_config.sqlite_filename);
        fs.unlinkSync(cmd.collection_processor_cli_config.sqlite_filename);
    }
    catch (e) {
        logger.error('db: removing db: ' + e);
    }
}

function close_remove_credential_storage() {
    remove_credentials_storage();
    close_credential_storage();
}

module.exports = {
    create_credential_storage: create_credential_storage,
    insert_files: insert_files,
    insert_credentials: insert_credentials,
    insert_emails: insert_emails,
    close_credential_stroage: close_credential_storage,
    remove_credentials_storage: remove_credentials_storage,
    close_remove_credential_storage: close_remove_credential_storage
}
