#!/bin/bash

# Setup script for RAG Learning Tool - Static Site React Project
# This script sets up the development environment for a Next.js static site

set -e  # Exit on any error

echo "🚀 Setting up RAG Learning Tool - Static Site React Project"
echo "================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if Node.js is installed
print_status "Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js version 22.15.0 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2)
REQUIRED_VERSION="22.15.0"
print_status "Current Node.js version: $NODE_VERSION"
print_status "Required Node.js version: $REQUIRED_VERSION"

# Check if pnpm is installed
print_status "Checking pnpm installation..."
if ! command -v pnpm &> /dev/null; then
    print_warning "pnpm is not installed. Installing pnpm..."
    npm install -g pnpm
    print_success "pnpm installed successfully"
else
    print_success "pnpm is already installed"
fi

# Use correct Node.js version if nvm is available
if command -v nvm &> /dev/null; then
    print_status "Using nvm to set Node.js version..."
    nvm use
elif [ -f ".nvmrc" ]; then
    print_warning "nvm not found but .nvmrc exists. Consider installing nvm for version management."
fi

# Install dependencies
print_status "Installing dependencies with pnpm..."
pnpm install

if [ $? -eq 0 ]; then
    print_success "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Create .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
    print_status "Creating .env.local file..."
    cat > .env.local << EOF
# Environment variables for development
# Add your environment variables here
EOF
    print_success ".env.local created"
else
    print_warning ".env.local already exists"
fi

# Check if TypeScript is configured properly
print_status "Checking TypeScript configuration..."
if [ -f "tsconfig.json" ]; then
    print_success "TypeScript configuration found"
else
    print_error "TypeScript configuration not found"
fi

# Check if Tailwind CSS is configured
print_status "Checking Tailwind CSS configuration..."
if [ -f "tailwind.config.ts" ]; then
    print_success "Tailwind CSS configuration found"
else
    print_error "Tailwind CSS configuration not found"
fi

# Verify the build process
print_status "Testing build process..."
pnpm build

if [ $? -eq 0 ]; then
    print_success "Build process completed successfully"
    print_success "Static files generated in 'out' directory"
else
    print_error "Build process failed"
    exit 1
fi

# Print setup completion message
echo ""
echo "================================================="
print_success "Setup completed successfully! 🎉"
echo ""
echo "📋 Next steps:"
echo "   1. Run 'pnpm dev' to start the development server"
echo "   2. Open http://localhost:3000 in your browser"
echo "   3. Run 'pnpm build' to create a production build"
echo "   4. Static files will be generated in the 'out' directory"
echo ""
echo "📝 Available commands:"
echo "   • pnpm dev      - Start development server"
echo "   • pnpm build    - Build for production"
echo "   • pnpm start    - Start production server"
echo "   • pnpm lint     - Run ESLint"
echo ""
print_success "Happy coding! 🚀"