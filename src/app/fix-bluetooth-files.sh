#!/bin/bash

# RakshaNet - Bluetooth Configuration Fix Script
# This script automatically fixes the _headers file if it becomes a directory

echo "🔧 RakshaNet Bluetooth Configuration Checker & Fixer"
echo "=================================================="
echo ""

# Check if public/_headers exists and what type it is
if [ -d "public/_headers" ]; then
    echo "❌ ERROR: public/_headers is a DIRECTORY (should be a file)"
    echo "🔧 Fixing now..."
    
    # Delete the directory and its contents
    rm -rf public/_headers
    
    # Recreate as a proper file
    cat > public/_headers << 'EOF'
/*
  Permissions-Policy: bluetooth=(self), geolocation=(self), camera=(self), microphone=(self)
  Feature-Policy: bluetooth 'self'; geolocation 'self'; camera 'self'; microphone 'self'
EOF
    
    echo "✅ Fixed! public/_headers is now a proper file"
    
elif [ -f "public/_headers" ]; then
    echo "✅ public/_headers is correctly a FILE"
    
    # Verify content
    if grep -q "Permissions-Policy: bluetooth" public/_headers; then
        echo "✅ Content is correct (Bluetooth permissions present)"
    else
        echo "⚠️  WARNING: Content might be incorrect"
        echo "🔧 Recreating with correct content..."
        
        cat > public/_headers << 'EOF'
/*
  Permissions-Policy: bluetooth=(self), geolocation=(self), camera=(self), microphone=(self)
  Feature-Policy: bluetooth 'self'; geolocation 'self'; camera 'self'; microphone 'self'
EOF
        
        echo "✅ Content fixed!"
    fi
else
    echo "❌ ERROR: public/_headers does not exist"
    echo "🔧 Creating now..."
    
    cat > public/_headers << 'EOF'
/*
  Permissions-Policy: bluetooth=(self), geolocation=(self), camera=(self), microphone=(self)
  Feature-Policy: bluetooth 'self'; geolocation 'self'; camera 'self'; microphone 'self'
EOF
    
    echo "✅ Created! public/_headers is now a proper file"
fi

echo ""

# Check .htaccess
if [ -f ".htaccess" ]; then
    echo "✅ .htaccess exists"
    
    # Verify content
    if grep -q "Permissions-Policy" .htaccess; then
        echo "✅ .htaccess content is correct"
    else
        echo "⚠️  WARNING: .htaccess content might be incorrect"
        echo "🔧 Recreating with correct content..."
        
        cat > .htaccess << 'EOF'
<IfModule mod_headers.c>
    Header set Permissions-Policy "bluetooth=(self), geolocation=(self), camera=(self), microphone=(self)"
    Header set Feature-Policy "bluetooth 'self'; geolocation 'self'; camera 'self'; microphone 'self'"
</IfModule>
EOF
        
        echo "✅ .htaccess fixed!"
    fi
else
    echo "⚠️  .htaccess does not exist"
    echo "🔧 Creating now..."
    
    cat > .htaccess << 'EOF'
<IfModule mod_headers.c>
    Header set Permissions-Policy "bluetooth=(self), geolocation=(self), camera=(self), microphone=(self)"
    Header set Feature-Policy "bluetooth 'self'; geolocation 'self'; camera 'self'; microphone 'self'"
</IfModule>
EOF
    
    echo "✅ .htaccess created!"
fi

echo ""
echo "=================================================="
echo "🎊 All Bluetooth configuration files are correct!"
echo ""
echo "📋 File Status:"
ls -lh public/_headers 2>/dev/null && echo "   ✅ public/_headers (file)" || echo "   ❌ public/_headers missing"
ls -lh .htaccess 2>/dev/null && echo "   ✅ .htaccess (file)" || echo "   ❌ .htaccess missing"
ls -lh vercel.json 2>/dev/null && echo "   ✅ vercel.json" || echo "   ⚠️  vercel.json missing (only needed for Vercel)"
ls -lh netlify.toml 2>/dev/null && echo "   ✅ netlify.toml" || echo "   ⚠️  netlify.toml missing (only needed for Netlify)"

echo ""
echo "🚀 Next Steps:"
echo "   1. Test locally: npm run dev"
echo "   2. Deploy: git add . && git commit -m 'Fix Bluetooth config' && git push"
echo "   3. Connect your smartwatch!"
echo ""
echo "📚 See CONNECT_SMARTWATCH_GUIDE.md for detailed instructions"
echo "=================================================="
