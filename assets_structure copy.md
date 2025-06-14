# 📁 Assets Folder Structure

This guide outlines the recommended structure for your AI Life Platform assets folder to ensure optimal organization and functionality.

## 📂 Recommended Folder Structure

```
assets/
├── icons/
│   ├── icon-72x72.png           # PWA icon (Android)
│   ├── icon-96x96.png           # PWA icon
│   ├── icon-128x128.png         # PWA icon
│   ├── icon-144x144.png         # PWA icon (Android)
│   ├── icon-152x152.png         # PWA icon (iOS)
│   ├── icon-192x192.png         # PWA icon (Android)
│   ├── icon-384x384.png         # PWA icon
│   ├── icon-512x512.png         # PWA icon (Android)
│   ├── favicon.ico              # Browser favicon
│   ├── favicon-16x16.png        # Small favicon
│   ├── favicon-32x32.png        # Standard favicon
│   ├── apple-touch-icon.png     # iOS home screen icon
│   ├── badge-72x72.png          # Notification badge
│   ├── tile-70x70.png           # Windows tile (small)
│   ├── tile-150x150.png         # Windows tile (medium)
│   ├── tile-310x150.png         # Windows tile (wide)
│   ├── tile-310x310.png         # Windows tile (large)
│   └── shortcuts/
│       ├── shortcut-coach.png   # AI Coach shortcut
│       ├── shortcut-fusion.png  # Emotional Fusion shortcut
│       ├── shortcut-health.png  # Health Monitor shortcut
│       └── shortcut-labs.png    # AI Labs shortcut
├── screenshots/
│   ├── desktop-1.png            # Desktop app screenshot
│   ├── mobile-1.png             # Mobile app screenshot
│   ├── ai-coach.png             # AI Coach interface
│   ├── emotional-fusion.png     # Fusion Engine interface
│   ├── health-monitor.png       # Health dashboard
│   ├── performance.png          # Performance section
│   ├── growth.png               # Growth & Learning
│   ├── profile.png              # User profile
│   └── quantum-labs.png         # AI Labs interface
├── fonts/
│   ├── Inter-Regular.woff2      # Primary font (regular)
│   ├── Inter-Medium.woff2       # Primary font (medium)
│   ├── Inter-SemiBold.woff2     # Primary font (semi-bold)
│   ├── Inter-Bold.woff2         # Primary font (bold)
│   └── Inter-ExtraBold.woff2    # Primary font (extra-bold)
├── sounds/
│   ├── notification.mp3         # General notification sound
│   ├── achievement.mp3          # Achievement unlock sound
│   ├── biometric-alert.mp3      # Biometric threshold alert
│   ├── fusion-complete.mp3      # Emotional fusion complete
│   ├── quantum-ready.mp3        # Quantum analysis ready
│   └── focus-start.mp3          # Focus session start
├── animations/
│   ├── loading-quantum.json     # Quantum loading animation (Lottie)
│   ├── heart-pulse.json         # Heart rate visualization
│   ├── brain-activity.json      # Neural activity animation
│   ├── fusion-active.json       # Emotional fusion animation
│   └── achievement-unlock.json  # Achievement unlock effect
├── images/
│   ├── backgrounds/
│   │   ├── quantum-bg.webp      # Quantum interface background
│   │   ├── fusion-bg.webp       # Emotional fusion background
│   │   └── holographic-bg.webp  # Holographic pattern
│   ├── illustrations/
│   │   ├── ai-coach-avatar.svg  # AI Coach illustration
│   │   ├── biometric-sensors.svg # Sensor illustration
│   │   ├── quantum-particles.svg # Quantum visualization
│   │   └── brain-network.svg    # Neural network graphic
│   └── placeholders/
│       ├── profile-placeholder.png # Default profile image
│       └── chart-placeholder.svg   # Chart loading state
└── data/
    ├── sample-biometric.json    # Sample biometric data
    ├── sample-emotional.json    # Sample emotional data
    ├── personality-templates.json # Personality type templates
    └── quantum-algorithms.json  # Quantum algorithm definitions
```

## 🎨 Icon Requirements

### PWA Icons
- **Format**: PNG with transparent background
- **Design**: Consistent with app branding
- **Colors**: Match theme colors (#667eea primary)
- **Style**: Modern, clean, recognizable at small sizes

### Favicon
- **Sizes**: 16x16, 32x32, 48x48
- **Format**: ICO file with multiple sizes
- **Fallback**: PNG versions for modern browsers

### Platform-Specific Icons
- **iOS**: Apple touch icon (180x180)
- **Android**: Various sizes (72, 96, 128, 144, 192, 384, 512)
- **Windows**: Tile images for different tile sizes

## 📱 Screenshot Guidelines

### Desktop Screenshots (1280x720)
- Show main interface elements
- Include realistic data
- Highlight key features
- Use actual app styling

### Mobile Screenshots (375x812)
- Portrait orientation
- Show mobile-optimized layout
- Include navigation elements
- Demonstrate touch interactions

### Feature Screenshots
- Focus on specific functionality
- High quality and clear visibility
- Consistent lighting and contrast
- Show real usage scenarios

## 🎵 Audio Assets

### Notification Sounds
- **Format**: MP3 (compressed) and WAV (high quality)
- **Duration**: 0.5-2 seconds
- **Volume**: Normalized, not too loud
- **Style**: Subtle, pleasant, not jarring

### Achievement Sounds
- **Format**: MP3
- **Duration**: 1-3 seconds
- **Style**: Positive, celebratory
- **Variants**: Different sounds for different achievement types

## 🎬 Animation Assets

### Lottie Animations
- **Format**: JSON (Lottie format)
- **Size**: Optimized for web (< 100KB)
- **Frame Rate**: 30fps or 60fps
- **Duration**: 2-5 seconds for loops
- **Style**: Match app's glassmorphism aesthetic

### CSS Animations
- **Implementation**: Pure CSS when possible
- **Performance**: GPU-accelerated transforms
- **Fallbacks**: Reduced motion preferences
- **Accessibility**: Respect prefers-reduced-motion

## 🖼️ Image Optimization

### Formats
- **WebP**: Modern browsers (preferred)
- **PNG**: Transparent images, fallback
- **SVG**: Icons and simple graphics
- **AVIF**: Next-gen format (optional)

### Compression
- **Quality**: Balance file size vs quality
- **Tools**: Use imagemin, squoosh, or similar
- **Responsive**: Multiple sizes for different screens
- **Lazy Loading**: Implement for performance

## 📊 Data Assets

### Sample Data
- **Format**: JSON
- **Purpose**: Development and demo
- **Privacy**: No real user data
- **Structure**: Match app data models

### Templates
- **Personality Types**: Pre-defined configurations
- **Algorithms**: Quantum processing templates
- **Correlations**: Example relationship mappings

## 🔧 Build Integration

### Automated Processing
```bash
# Example build script
npm run build:icons    # Generate all icon sizes
npm run optimize:images # Compress and convert images
npm run build:manifest # Update manifest with new assets
```

### Version Control
- **Track**: Source files (SVG, high-res PNG)
- **Ignore**: Generated/optimized files in .gitignore
- **Naming**: Use consistent naming conventions

## 📏 Size Guidelines

| Asset Type | Recommended Size | Max Size |
|------------|------------------|----------|
| PWA Icons | < 50KB each | 100KB |
| Screenshots | < 200KB each | 500KB |
| Sounds | < 100KB each | 200KB |
| Animations | < 100KB each | 250KB |
| Backgrounds | < 500KB each | 1MB |
| Total Assets | < 5MB | 10MB |

## 🚀 Performance Tips

1. **Preload Critical Assets**: Icons, fonts, key images
2. **Lazy Load**: Non-critical images and animations
3. **Service Worker Cache**: Cache important assets offline
4. **CDN**: Consider CDN for large assets
5. **Progressive Enhancement**: Fallbacks for older browsers

## 🎯 Accessibility

- **Alt Text**: Meaningful descriptions for images
- **High Contrast**: Ensure sufficient color contrast
- **Scalable**: Vector graphics when possible
- **Reduced Motion**: Alternative static versions
- **Screen Readers**: Proper semantic markup

## 🔄 Maintenance

### Regular Tasks
- [ ] Update screenshots when UI changes
- [ ] Optimize new images before adding
- [ ] Test icons on different devices
- [ ] Validate PWA manifest regularly
- [ ] Check asset loading performance

### Asset Auditing
- [ ] Remove unused assets
- [ ] Update outdated screenshots
- [ ] Optimize large files
- [ ] Check broken links/references
- [ ] Validate accessibility compliance

This structure ensures your AI Life Platform assets are well-organized, optimized for performance, and provide the best user experience across all devices and platforms.