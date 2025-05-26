#!/bin/bash
echo "Ì∫Ä GPT Export Package Setup"
echo "==========================="

# Check Node.js
if command -v node >/dev/null 2>&1; then
    echo "‚úÖ Node.js found: $(node --version)"
else
    echo "‚ùå Node.js not found. Please install Node.js 18+"
    exit 1
fi

# Install React dependencies
echo "Ì≥¶ Installing React dependencies..."
cd gpts/AI-SaaS-Builder
npm install
cd ../..

echo "‚úÖ Setup completed successfully!"
echo ""
echo "Ì∫Ä Next steps:"
echo "  1. Test React components: cd gpts/AI-SaaS-Builder && npm run dev"
echo "  2. Test PowerShell module: Import-Module ./gpts/SortCleanup/SortCleanup.psd1"
echo "  3. Read documentation: cat README.md"
