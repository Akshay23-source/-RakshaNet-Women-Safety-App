#!/bin/bash

echo "=================================="
echo " 🔍 Verifying Bluetooth Fix"
echo "=================================="
echo ""

# Check if _headers exists as a file
if [ -f "public/_headers" ]; then
    echo "✅ public/_headers exists as a file (correct)"
    echo "   Content preview:"
    head -n 3 public/_headers | sed 's/^/   /'
else
    if [ -d "public/_headers" ]; then
        echo "❌ public/_headers is a directory (wrong!)"
        echo "   This will cause the fix to fail."
    else
        echo "❌ public/_headers does not exist"
    fi
fi

echo ""

# Check netlify.toml
if [ -f "netlify.toml" ]; then
    echo "✅ netlify.toml exists"
    if grep -q "bluetooth=\*" netlify.toml; then
        echo "   ✅ Contains wildcard Bluetooth permissions"
    else
        echo "   ⚠️  May not have correct Bluetooth permissions"
    fi
else
    echo "ℹ️  netlify.toml not found (only needed for Netlify)"
fi

echo ""

# Check vercel.json
if [ -f "vercel.json" ]; then
    echo "✅ vercel.json exists"
    if grep -q "bluetooth=\*" vercel.json; then
        echo "   ✅ Contains wildcard Bluetooth permissions"
    else
        echo "   ⚠️  May not have correct Bluetooth permissions"
    fi
else
    echo "ℹ️  vercel.json not found (only needed for Vercel)"
fi

echo ""
echo "=================================="
echo " 📋 Summary"
echo "=================================="
echo ""

# Final recommendation
if [ -f "public/_headers" ] && [ -f "netlify.toml" ] && [ -f "vercel.json" ]; then
    echo "✅ All configuration files are in place!"
    echo ""
    echo "Next steps:"
    echo "1. git add ."
    echo "2. git commit -m 'Fix Bluetooth permissions policy'"
    echo "3. git push"
    echo "4. Deploy/Redeploy your application"
    echo "5. Test Bluetooth functionality"
else
    echo "⚠️  Some configuration files are missing"
    echo "   Please check BLUETOOTH_PERMISSIONS_FIX_COMPLETE.md for details"
fi

echo ""
echo "=================================="
