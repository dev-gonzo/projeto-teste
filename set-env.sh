BUILD_DIR="./admin"

ENV_MAP=(
  "API_URL":"__API_URL_PLACEHOLDER__"
  "SECRET_KEY":"__SECRET_KEY_PLACEHOLDER__"
)

echo "---"
echo "Starting to replace environment variables in JS files."
echo "Path of the build: $BUILD_DIR"

JS_FILES=$(find "$BUILD_DIR" -maxdepth 1 -type f -name 'main-.js' -o -name 'chunk-.js' | sort)

if [ -z "$JS_FILES" ]; then
  echo "Error: No file 'main-.js' or 'chunk-.js' found in '$BUILD_DIR'. Exiting."
  exit 1
fi

echo "---"
echo "JS files identified for processing:"
for file in $JS_FILES; do
  echo "  - $(basename "$file")"
done
echo "---"

for FILE_TO_MODIFY in $JS_FILES; do
  echo "Processing file: $(basename "$FILE_TO_MODIFY")..."

  for ITEM in "${ENV_MAP[@]}"; do
    IFS=':' read -r ENV_VAR_NAME PLACEHOLDER <<< "$ITEM"

    ENV_VALUE=$(eval echo "\$$ENV_VAR_NAME")
    if [ -z "$ENV_VALUE" ]; then
      echo "  Warning: Environment variable '$ENV_VAR_NAME' not set. Replacing with empty."
      ENV_VALUE=""
    fi
    
    sed -i "s#'$PLACEHOLDER'#'$ESCAPED_ENV_VALUE'#g" "$FILE_TO_MODIFY"

    sed -i "s#\"$PLACEHOLDER\"#\"$ESCAPED_ENV_VALUE\"#g" "$FILE_TO_MODIFY"

    echo "  - Attempt to replace '$PLACEHOLDER' with '$ENV_VALUE'"

    if grep -q "$PLACEHOLDER" "$FILE_TO_MODIFY"; then
      echo "    Warning: The placeholder '$PLACEHOLDER' is STILL present in $(basename "$FILE_TO_MODIFY")."
      echo "    This may indicate that the minifier has changed the placeholder format or that the sed pattern needs adjusting."
    else
      echo "    Success: Placeholder '$PLACEHOLDER' replaced in $(basename "$FILE_TO_MODIFY")."
    fi
  done
done

echo "---"
echo "Environment variable replacement process completed."
echo "---"

exec "$@"