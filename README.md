# collection-processor-cli

Nodejs package to feed the contents of any "collection" or hundreds of files with credentials using the format of email [:;] sha per line of .txt files into a sqlite database. Simply untar "email.collection.tar.gz" into a folder or use the enclosed bash script (email_preprocessor.sh).

This package uses event-stream to tear through files. During development I tested many permuations of the below described data sets. This package performed well, without crashing nor running out of memory. The largest file tested was 4.1GB (upper limit of the packaged collection files) and the total files in the test suite was at the maximum Linux limit per folder. In short, this has processed well over 100,000,000 email records spanning 8,691 files, likely over what your email budget maybe able to handle.

# applications
I strongly condone the use of this code to process the [Collection #1-5](https://www.intego.com/mac-security-blog/collection-1-and-2-5-are-the-latest-massive-password-dumps/), however, if you do embark on this activity, please act responsibly. 

### If you want to buy me beer. BTC. 3Gjm838VRzhV8cp4zHecekhUrMPo1H4GJ6.
### "Test dataset"

```
large           216,053,550 (emails)
medium          586,199
medium          1,690,000
small           35,166
very small      6,000
```

## Clone this repository

```
git clone https://github.com/pleasemarkdarkly/collection-processor-cli/
```

## Installation

```
npm -i collection-processor-cli -g
```

## Find a Folder full of tar.gz with credentials

```
./email_preprocessor.sh

You can use the following regex which will parse emails from files from the original Collection. 
grep -o '[[:alnum:]+\.\_\-]*@[[:alnum:]+\.\_\-]*' "$name" | sort | uniq -i > $newname
```

## Usage

Verbosity is defined by -d
```
-d DEBUG | INFO | ERROR | WARN
```

The most common usage is as follows.

```
collection-processor-cli -d DEBUG --sqlite --directory .



Usage: collection-processor-cli [options]

Commandline Collection email digest and validation application.

Options:
  -V, --version            output the version number
  -d, --debug <string>     DEBUG, ERROR, INFO, WARN (default: "ERROR")
  --sqlite                 use sqlite db, default: collection.db
  -f, --filename <string>  filename to process
  --directory <string>     directory to process (overide --filename) (default: "/Users/pleasemarkdarkly/Developer/emails")
  -e, --only-emails        ingest only emails
  -h, --help               output usage information
```

## Party

```
collection-processor-cli -d DEBUG --sqlite --directory /Volume/HDD/Collection1-6/
```

## Disclaimer

Author does not condone or promote the use of credential stuffing or use of stolen information. Shame on you.


