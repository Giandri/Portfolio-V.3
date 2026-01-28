# Expandable Screens System

Sistem komponen untuk membuat expandable screens yang fully customizable per halaman.

## 📁 Struktur Files

```
src/components/screens/
├── index.ts              # Export semua screens
├── HomeScreen.tsx        # Screen untuk halaman Home
├── WorksScreen.tsx       # Screen untuk halaman Works
├── InfoScreen.tsx        # Screen untuk halaman Info
├── ScreenTemplate.tsx    # Template untuk membuat screen baru
└── README.md            # Dokumentasi ini
```

## 🎯 Cara Kerja

Setiap expandable screen sekarang menggunakan komponen terpisah yang bisa fully customized:

1. **HomeScreen**: Landing page dengan hero section dan features
2. **WorksScreen**: Showcase projects dengan grid layout
3. **InfoScreen**: About page dengan skills dan contact info
4. **ScreenTemplate**: Template reusable untuk screen baru

## 🚀 Cara Membuat Screen Baru

### 1. Buat File Screen Baru

```tsx
// src/components/screens/MyCustomScreen.tsx
"use client";

import { ScreenTemplate } from "./ScreenTemplate";
import { MyIcon } from "lucide-react";

export function MyCustomScreen() {
  return (
    <ScreenTemplate
      icon={<MyIcon size={100} className="text-blue-500" />}
      title="My Custom Page"
      subtitle="Deskripsi halaman custom"
      gradient="from-blue-500 to-purple-500"
    >
      {/* Konten custom Anda di sini */}
      <div className="max-w-4xl mx-auto">
        <h2>Konten Custom</h2>
        <p>Isi apa saja sesuai keinginan</p>
      </div>
    </ScreenTemplate>
  );
}
```

### 2. Export di index.ts

```tsx
// src/components/screens/index.ts
export { HomeScreen } from './HomeScreen';
export { WorksScreen } from './WorksScreen';
export { InfoScreen } from './InfoScreen';
export { MyCustomScreen } from './MyCustomScreen'; // Tambah export baru
```

### 3. Tambahkan di dockItems (page.tsx)

```tsx
const dockItems = [
  // ... existing items
  {
    id: "custom",
    gradient: "custom-gradient.jpg",
    icon: <MyIcon size={32} className="text-black dark:text-white" />,
    title: "Custom Page",
    bgColor: "dark:from-blue-900 dark:via-blue-800 dark:to-blue-900 from-blue-100 via-blue-50 to-blue-100",
  },
];
```

### 4. Gunakan di FullPageContainer

```tsx
<ExpandableContent id={item.id}>
  {item.id === "home" && <HomeScreen />}
  {item.id === "works" && <WorksScreen />}
  {item.id === "info" && <InfoScreen />}
  {item.id === "custom" && <MyCustomScreen />} {/* Tambah kondisi baru */}
</ExpandableContent>
```

## 🎨 Screen Components Yang Tersedia

### HomeScreen
- Hero section dengan animasi
- Features grid
- CTA button
- Background gradient

### WorksScreen
- Projects showcase grid
- Hover effects
- Tech stack badges
- Responsive layout

### InfoScreen
- Skills progress bars
- Fun facts grid
- Contact section
- Interactive elements

### ScreenTemplate
- Reusable template
- Custom icon, title, subtitle
- Gradient support
- Flexible content area

## 🎭 Features

- ✅ **Fully Customizable**: Setiap screen bisa punya layout berbeda
- ✅ **Theme Responsive**: Otomatis berubah di dark/light mode
- ✅ **Smooth Animations**: Menggunakan Framer Motion
- ✅ **Mobile Responsive**: Adaptive di semua ukuran layar
- ✅ **Reusable Components**: Template untuk konsistensi

## 📝 Tips Development

### 1. Ikuti Pattern yang Ada
- Gunakan ScreenTemplate untuk konsistensi
- Ikuti struktur animasi yang sama
- Pastikan responsive design

### 2. Theme Support
- Gunakan `text-black dark:text-white`
- Background: `bg-white/50 dark:bg-gray-800/50`
- Border: `border-gray-200 dark:border-gray-700`

### 3. Animasi
- Gunakan `motion.div` dari Framer Motion
- Initial: `opacity: 0, y: 50`
- Animate: `opacity: 1, y: 0`
- Stagger animations untuk efek yang lebih smooth

### 4. Performance
- Gunakan `use client` directive
- Import hanya yang diperlukan
- Optimalkan images dengan Next.js Image component

## 🔧 Customization Examples

### Custom Layout tanpa Template
```tsx
export function MyFullCustomScreen() {
  return (
    <div className="flex-1 p-8">
      {/* Layout fully custom */}
      <div className="grid grid-cols-3 gap-8 h-full">
        <div className="bg-red-500">Left Panel</div>
        <div className="bg-blue-500 col-span-2">Main Content</div>
      </div>
    </div>
  );
}
```

### Dengan Interactive Elements
```tsx
export function InteractiveScreen() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <ScreenTemplate
      icon={<SettingsIcon size={100} className="text-green-500" />}
      title="Settings"
      gradient="from-green-500 to-teal-500"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-4 mb-8">
          {['General', 'Appearance', 'Advanced'].map((tab, index) => (
            <button
              key={tab}
              onClick={() => setActiveTab(index)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === index
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="bg-white/50 dark:bg-gray-800/50 p-6 rounded-xl">
          {activeTab === 0 && <GeneralSettings />}
          {activeTab === 1 && <AppearanceSettings />}
          {activeTab === 2 && <AdvancedSettings />}
        </div>
      </div>
    </ScreenTemplate>
  );
}
```

## 🚀 Testing

Setelah membuat screen baru:
1. Import di `index.ts`
2. Tambahkan di `dockItems`
3. Tambahkan kondisi di `FullPageContainer`
4. Test di browser dengan klik dock item

## 📞 Support

Jika ada pertanyaan tentang implementasi screen baru, lihat contoh di file yang sudah ada atau tanya di development chat!
