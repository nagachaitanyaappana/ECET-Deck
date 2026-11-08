#!/bin/sh
# Lightweight Maven Wrapper for ECET Desk.
set -eu
MAVEN_VERSION="3.9.11"
MAVEN_HOME="${MAVEN_USER_HOME:-$HOME/.m2}/wrapper/dists/apache-maven-$MAVEN_VERSION"
MAVEN_EXE="$MAVEN_HOME/bin/mvn"
MAVEN_URL="https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/$MAVEN_VERSION/apache-maven-$MAVEN_VERSION-bin.tar.gz"

if [ ! -x "$MAVEN_EXE" ]; then
  echo "Downloading Apache Maven $MAVEN_VERSION..."
  mkdir -p "$MAVEN_HOME"
  TMP_DIR="$(mktemp -d)"
  trap 'rm -rf "$TMP_DIR"' EXIT
  if command -v curl >/dev/null 2>&1; then
    curl -fsSL "$MAVEN_URL" -o "$TMP_DIR/maven.tar.gz"
  elif command -v wget >/dev/null 2>&1; then
    wget -q "$MAVEN_URL" -O "$TMP_DIR/maven.tar.gz"
  else
    echo "ERROR: curl or wget is required to download Maven." >&2
    exit 1
  fi
  tar -xzf "$TMP_DIR/maven.tar.gz" -C "$TMP_DIR"
  cp -R "$TMP_DIR/apache-maven-$MAVEN_VERSION/." "$MAVEN_HOME/"
fi

exec "$MAVEN_EXE" "$@"
