#!/bin/bash
echo which folder to count js file lines
read FLD
cat /dev/null > tmp
find ${FLD} -name "*.js" | grep -Ev "node_modules|coverage" | \
while IFS= read -r line; do
    echo ${line} line: `sed -n '/[^(^\s*($|\/|\*))]/p' ${line} | wc -l | tee -a tmp`
done

echo ''
awk '{s+=$1} END {printf "you have written %s total lines", s}' tmp
rm tmp