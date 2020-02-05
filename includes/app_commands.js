const path = require('path');
const fs = require('fs');
const logger = require('node-color-log');
const ts = require('../includes/ts');

const debug_level = {
    DEBUG: 0,
    ERROR: 1,
    INFO: 2,
    WARN: 3
};

var array_emails = [];

var collection_processor_cli_config = {
    debug_mode: debug_level.DEBUG,
    module_name: undefined,
    node_application_name: path.basename(process.cwd()),
    application_version_number: undefined,
    use_sqlite: true,
    sqlite_filename: 'collection.db',
    ingest_filename: undefined,
    ingest_directory: process.cwd(),
    filter_emails: false,
    output_filename: ts.timestamp() + '.txt',
    array_files: undefined,
    current_stream_file_path: undefined,
    current_stream_line: undefined,
    current_stream_email: undefined
};

function sleep(milliseconds) {
    const spinner = ora().start();
    const date = Date.now();
    let current_date = null;
    do {
        current_date = Date.now();
    } while (current_date - date < milliseconds);
    spinner.stop();
};

function is_file_directory(file_path) {
    return fs.existsSync(file_path);
};

function get_current_module() {
    return path.basename(__filename);
};

(function process_arguments() {
    const cmd = require('commander');

    cmd
        .version('0.0.1')
        .description('Commandline Collection email digest and validation application.');

    collection_processor_cli_config.module_name = path.basename(__filename);
    collection_processor_cli_config.application_version_number = cmd.version();

    cmd
        .option('-d, --debug <string>', 'DEBUG, ERROR, INFO, WARN', 'ERROR')
        .option('--sqlite', 'use sqlite db, default: collection.db', 'collection.db')
        .option('-f, --filename <string>', 'filename to process')
        .option('--directory <string>', 'directory to process (overide --filename)', process.cwd())
        .option('-e, --only-emails', 'ingest only emails')
        .parse(process.argv);

    cmd.on('--help', function () {
        console.log('');
        console.log('Examples:');
        console.log('');
        console.log('  By default the application will create collection.db and search for .txt files with an email per line from the current directory.');
        console.log('  Changing the current directory use the --directory argument switch.');
        console.log('');
        console.log('  $ collection-processor-cli --directory /Volumes/HDD_4TB/Emails');
        console.log('');
        console.log('  $ collection-processor-cli --filename ./marketing_email_list.txt');
        console.log('');
    });

    switch (cmd.debug) {
        case 'DEBUG':
            logger.setLevel("debug");
            collection_processor_cli_config.debug_mode = debug_level.DEBUG;
            break;
        case 'ERROR':
            logger.setLevel("error");
            collection_processor_cli_config.debug_mode = debug_level.ERROR;
            break;
        case 'INFO':
            logger.setLevel("info");
            collection_processor_cli_config.debug_mode = debug_level.INFO;
            break;
        case 'WARN':
            logger.setLevel("warn");
            collection_processor_cli_config.debug_mode = debug_level.WARN;
            break;
        case 'ALL':
            logger.setLevel("debug")
            collection_processor_cli_config.debug_mode = debug_level.DEBUG;
            break;
        default:
            logger.setLevel("info");
            collection_processor_cli_config.debug_mode = debug_level.INFO;
            break;
    };

    if (cmd.sqlite || cmd.filename || cmd.directory || cmd.onlyEmails) {
        logger.info('-------------------------------------------------------------');
        logger.info('app args assignment to collections');
        if (cmd.sqlite) {
            logger.info('sqlite: (' + cmd.sqlite + ')');
            collection_processor_cli_config.sqlite_filename = `${cmd.sqlite}`;
        }

        if (cmd.filename) {
            if (is_file_directory(cmd.filename)) {
                logger.info('filename: (' + cmd.filename + ')');
                collection_processor_cli_config.ingest_filename = cmd.filename;
            } else {
                logger.error('--filename (' + cmd.filename + ') not found');
                logger.info('-------------------------------------------------------------');
                cmd.help();
                process.exit(1);
            }
        }

        if (cmd.directory) {
            if (is_file_directory(cmd.directory)) {
                logger.info('directory: (' + cmd.directory + ')');
                collection_processor_cli_config.ingest_directory = cmd.directory;
            } else {
                logger.error('--directory (' + cmd.directory + ') not found');
                logger.info('-------------------------------------------------------------');
                cmd.help();
                process.exit(1);
            }
        }

        if (cmd.onlyEmails) {
            logger.info('filter only emails: (' + cmd.onlyEmails + ')');
            collection_processor_cli_config.filter_emails = cmd.onlyEmails;
        }
        logger.info('-------------------------------------------------------------');
    };

    logger.info('-------------------------------------------------------------');
    logger.info('command line arguments:')
    logger.info(JSON.stringify(cmd.opts()));
    logger.info('-------------------------------------------------------------');
    logger.info('-------------------------------------------------------------');
    logger.info('collection variables:');
    logger.info(JSON.stringify(collection_processor_cli_config));
    logger.info('-------------------------------------------------------------');
})();

module.exports = {
    debug_level: debug_level,
    collection_processor_cli_config: collection_processor_cli_config,
    array_emails: array_emails,
    sleep: sleep,
    is_file_directory: is_file_directory,
    get_current_module: get_current_module
};