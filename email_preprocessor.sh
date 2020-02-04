#!/usr/bin/env bash

function untar_all() {
        find . -name '*.tar.gz' -execdir tar -xzvf '{}' \;
	rm -rf *.tar.gz
}

function number_all_folders() {
        local files_array=(*)
        for name in "${files_array[@]}";
        do
                newname="$(printf '%05d' "$num")"
                printf 'Renaming "%s" into "%s"\n' "$name" "$newname"
                mv "$name" "$newname"
                (( num = num + 1 ))
        done
}

function number_all_files() {
 	local files_array=(*.txt)
  	for name in "${files_array[@]}";
  	do
    		stem="${name%.txt}"
    		newname="$(printf '%05d.txt' "$num")"
    		printf 'Renaming "%s" into "%s"\n' "$name" "$newname"
    		mv "$name" "$newname"
    		(( num = num + 1 ))
  	done
}

function remove_credentials() {
        find . -name "*.txt" -exec sed -i.backup 's/[;:].*//g' '{}' \;
	find . -name "*.backup" -exec rm -rf '{}' \;
}

function cleanup_other_files() {
	find . -name "*.7z" -exec rm -rf {} \;
	find . -name "*.zip" -exec rm -rf {} \;
	find . -name "*.sql" -exec rm -rf {} \;
	find . -name "*.xls" -exec rm -rf {} \;
	find . -name "*.html" -exec rm -rf {} \;
	find . -name "*.encrypted" -exec rm -rf {} \;
	find . -name "*.tar.gz" -exec rm -rf {} \;
}

export -f number_all_files
export -f remove_credentials

function number_all_files_in_dirs_and_remove_credentials(){
	number_all_folders
	find . -maxdepth 1 -type d \( ! -name . \) -exec bash -c "cd '{}' && pwd && number_all_files && remove_credentials" \;
}

function main(){
        untar_all
	number_all_folders
	number_all_files_in_dirs_and_remove_credentials
	cleanup_other_files

	echo "following extensions exist"
	find . -type f -name '*.*' | sed 's|.*\.||' | sort -u
}

main



