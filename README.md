#collection-processor-cli

Nodejs package to shove the contents of any "collection" or hundreds of files with credentials using the format of email [:;] sha per line of .txt files into a sqlite database. Simply untar email.collection.tar.gz into a folder or use the enclosed bash script, which takes a directory of tar.gz and untars, uncompresses, and cleans up the files for digestion. (email_preprocessor.sh).
This package uses event-stream to tear through files. During development I use at least four sets of data: small, medium, large, and massive. The following statistics were tested several times. No crashing or running out of memory. The largest file I tested was 4.1GB and the total files in the test suite was 888. This has also run against over 100,000,000 records spanning 8,691 files.
If you want to buy me beer, BTC. 3Gjm838VRzhV8cp4zHecekhUrMPo1H4GJ6.

'''
large       	216,053,550 (emails)
medium		586,199
medium 		1,690,000
small 		35,166
very small  	6,000
'''

##Installation

npm -i collection-processor-cli -g

##Usage

'''
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
'''

##Party

After installation, something like this works.


'''
collection-processor-cli -d DEBUG --sqlite --directory /Volume/HDD/Collection1-6/

'''


