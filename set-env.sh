BUILD_DIR="/usr/share/nginx/html"

mkdir -p "$BUILD_DIR/assets"

echo "---"
echo "Starting to create environment variables in '$BUILD_DIR/assets/env.js'."
echo "---"

echo "window.env = {" > "$BUILD_DIR/assets/env.js"

echo "  API_URL: \"$API_URL\"," >> "$BUILD_DIR/assets/env.js"
echo "  SECRET_KEY: \"$SECRET_KEY\"" >> "$BUILD_DIR/assets/env.js"

echo "};" >> "$BUILD_DIR/assets/env.js"

echo "---"
echo "Environment variable replacement process completed."
echo "---"

nginx -g 'daemon off;'