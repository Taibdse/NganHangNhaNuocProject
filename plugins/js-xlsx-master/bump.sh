#!/bin/sh

current_version="0.8.7"
new_version="0.8.8"

find . -type f -not -name "*.sh" -not -path '*/\.*' -exec replace "$current_version" "$new_version" -- "{}" ";"