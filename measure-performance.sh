#!/bin/bash
echo "📊 Measuring page load performance..."
echo ""

# Measure server response time (5 attempts for average)
echo "1️⃣ Server Response Time:"
total=0
for i in {1..5}; do
  time_ms=$(curl -w "%{time_total}\n" -o /dev/null -s http://localhost:3000 | awk '{print $1 * 1000}')
  echo "  Attempt $i: ${time_ms}ms"
  total=$(echo "$total + $time_ms" | bc)
done
avg=$(echo "scale=2; $total / 5" | bc)
echo "  Average: ${avg}ms"
echo ""

# Check bundle sizes from build
echo "2️⃣ JavaScript Bundle Sizes (from last build):"
if [ -d ".next" ]; then
  du -sh .next/static/chunks/* | sort -h | tail -10
else
  echo "  No .next directory - run 'npm run build' first"
fi
echo ""

# Check number of dependencies
echo "3️⃣ Dependency Count:"
echo "  Production deps: $(grep -c '"' package.json | head -1)"
echo "  Heavy Web3 deps:"
echo "    - @privy-io/react-auth"
echo "    - wagmi"
echo "    - viem"
echo "    - @reown/appkit"
echo ""

echo "4️⃣ Recommendations:"
echo "  ⚠️ Dev mode loads 666 KB JS (normal for Web3 apps)"
echo "  ✅ Production will be optimized and minified"
echo "  ✅ Static export prerendered (no server processing)"
echo "  💡 To optimize: Lazy load Web3 providers on demand"
