const path = require('path');
const logger = require('node-color-log');
const cmd = require('./includes/app_commands');

require("nodejs-dashboard");

console.log('-------------------------------------------------------------');
console.log('filename: ' + path.basename(__filename));
console.log('collection variables:');
console.log(JSON.stringify(cmd.collection_processor_cli_config));
console.log('-------------------------------------------------------------');

/**
 *  ----------------------------------------------------------------------------------------
 */

var fs = require('fs'),
    es = require('event-stream');

const db = require('./includes/es_sqlite');

const extension = '.txt';
const at_symbol = '@';
const regex = /[:;].*/g

var files = [];
var number_files = 0;

var total_lines = 0;
var total_emails = 0;
var absolute_emails = 0;
var absolute_lines = 0;
var extension_count = 0;

function linecount_stream_file(filename) {
    total_lines = 0;
    total_emails = 0;
    var s = fs
        .createReadStream(filename)
        .pipe(es.split())
        .pipe(
            es
                .mapSync(function (line) {
                    total_lines++;
                    absolute_lines++;
                    if (line.indexOf(at_symbol) != -1) {
                        total_emails++;
                    }
                })
                .on('error', function (err) {
                    logger.error('es: error reading: ' + filename, err);
                })

                .on('end', function () {
                    number_files++;
                    logger.warn('-------------------------------------------------------------');
                    logger.warn('es: read entire file: (' + filename + ')');
                    logger.info('es: total lines: (' + total_lines + ')');
                    logger.warn('es: total emails/inserts: (' + total_emails + ')');
                    logger.info('es: total lines over all files: (' + absolute_lines + ')');
                    logger.info('number of files: (' + number_files + ')');
                    logger.warn('-------------------------------------------------------------');
                    db.insert_files(number_files, filename, total_lines, total_emails + 1);
                })
        );
}

function read_stream_file(filename) {
    total_lines = 0;
    total_emails = 0;
    cmd.collection_processor_cli_config.current_stream_file_path = filename;

    var s = fs
        .createReadStream(filename)
        .pipe(es.split())
        .pipe(
            es
                .mapSync(function (line) {
                    total_lines++;
                    cmd.collection_processor_cli_config.current_stream_line = total_lines;
                    absolute_lines++;
                    if (line.indexOf(at_symbol) != -1) {
                        cmd.collection_processor_cli_config.current_stream_email = line;
                        db.insert_credentials(absolute_lines, filename, line, total_lines + 1);
                        db.insert_emails(absolute_emails, line, false, false, false);
                        total_emails++;
                        absolute_emails++;
                    }
                })
                .on('error', function (err) {
                    logger.error('es: error reading: ' + filename, err);
                })

                .on('end', function () {
                    logger.warn('-------------------------------------------------------------');
                    logger.warn('es: read entire file: (' + filename + ')');
                    logger.info('es: total lines: (' + total_lines + ')');
                    logger.info('es: total inserts: (' + total_emails + ')');
                    logger.info('es: total lines over all files: (' + absolute_lines + ')');
                    logger.info('es: total emails over all files: (' + absolute_emails + ')');
                    logger.warn(JSON.stringify(cmd.collection_processor_cli_config));
                    logger.warn('-------------------------------------------------------------');
                })
        );
}

function walk(dir, done) {
    fs.readdir(dir, function (error, list) {
        if (error) {
            return done(error);
        }
        var i = 0;
        (function next() {
            var file = list[i++];
            if (!file) {
                return done(null);
            }
            file = dir + '/' + file;
            fs.stat(file, function (error, stat) {
                if (stat && stat.isDirectory()) {
                    walk(file, function (error) {
                        next();
                    });
                } else {
                    if (file.indexOf(extension) !== -1) {
                        extension_count++;
                        logger.warn('-------------------------------------------------------------');
                        logger.warn('walk: eligible file: (' + file + ') of (' + files.length + ')');
                        logger.warn('-------------------------------------------------------------');
                        // files.push(file);
                        linecount_stream_file(file);
                        setTimeout(function () { read_stream_file(file); }, 3000);
                    }
                    next();
                }
            });
        })();
    });
}

function ingest_content() {
    try {
        db.create_credential_storage(cmd.collection_processor_cli_config.sqlite_filename);
    } catch (e) {
        logger.error('db: failed create credential storage: ' + e);
    }

    setTimeout(function () {
        if (cmd.collection_processor_cli_config.ingest_filename != undefined) {
            logger.info('--filename: ' + cmd.collection_processor_cli_config.ingest_filename);
            read_stream_file(cmd.collection_processor_cli_config.ingest_filename);
        } else {
            var walk_path = cmd.collection_processor_cli_config.ingest_directory;
            walk(walk_path, function (error) {
                if (error) {
                    logger.info('db: walk error thrown :' + walk_path);
                    throw error;
                } else {
                    logger.warn('-------------------------------------------------------------');
                    logger.warn('db: finished enumerating walk path: (' + walk_path + ')');
                    logger.warn('-------------------------------------------------------------');
                }
            });
        }
    }, 1000);

    



    try {
        db.close_credential_storage
    } catch (e) {
        logger.error('db: close: ' + e);
    }
}

ingest_content();

var ctrl_count = 0;
const EXIT_COUNT = 3;

process.on('SIGINT', function () {
    if (ctrl_count <= EXIT_COUNT) {
        logger.error("ctrl-c detected...");
        ctrl_count++;
    } else {
        logger.info(JSON.stringify(cmd.collection_processor_cli_config));
        db.close_remove_credential_storage();
        setTimeout(function () { process.exit(); }, 1000);
    }
});


module.exports = {
    total_lines: total_lines,
    total_emails: total_emails,
    absolute_lines: absolute_lines,
    extension_count: extension_count,
    read_stream_file: read_stream_file,
    walk: walk,
    files: files
};
