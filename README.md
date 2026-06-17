<div align="center">

# ⚡ EXTER-LIB v2.0

### Premium Modern UI Library for FiveM QBCore

[![Version](https://img.shields.io/badge/version-2.0-22c55e?style=for-the-badge&labelColor=0a0a0f)](https://github.com)
[![Framework](https://img.shields.io/badge/QBCore-Compatible-6366f1?style=for-the-badge&labelColor=0a0a0f)](https://github.com)
[![License](https://img.shields.io/badge/license-MIT-eab308?style=for-the-badge&labelColor=0a0a0f)](LICENSE)

*A next-generation NUI library featuring glassmorphism design, buttery-smooth animations, and zero dependencies.*

---

</div>

## ✨ What's New in v2.0

| Feature | v1.0 | v2.0 |
|---------|------|------|
| **Design** | Basic colored boxes | Premium glassmorphism with backdrop blur |
| **Animations** | jQuery fadeIn/fadeOut | Spring physics, staggered entrances, micro-interactions |
| **Typography** | Montserrat | Geist (by Vercel) - modern, clean, optimized |
| **Progress Bar** | Segmented blocks | Smooth continuous fill with glow trail |
| **Dependencies** | jQuery required | Zero dependencies - Pure vanilla JS |
| **Performance** | setTimeout-based | requestAnimationFrame for 60fps animations |
| **Notifications** | 3 types | 4 types (error, info, success, warning) |
| **Timer** | SVG circle | Gradient progress line with smooth shrink |
| **Info Panel** | Basic text box | Animated accent line, glassmorphism card |

---

## 🎨 Design Philosophy

- **Glassmorphism** — Frosted glass effect with `backdrop-filter: blur(24px)` and subtle saturation
- **Micro-animations** — Spring-based entrances, pulse effects, shimmer highlights
- **Color-coded** — Each notification type has its own color system with glow, bg, border variants
- **Dark-first** — Designed for game overlays with semi-transparent dark backgrounds
- **Precision** — Sub-pixel rendering, antialiased fonts, tabular numbers

---

## 🚀 Installation

1. Drop the `exter-lib` folder into your server's `resources` directory
2. Add `ensure exter-lib` to your `server.cfg`
3. Replace QB notification/progressbar functions (see below)

---

## 📦 Components

### 🔔 Notifications

4 notification types with unique styling:

| Type | Color | Use Case |
|------|-------|----------|
| `error` | Rose Red `#f43f5e` | Errors, failures, denials |
| `info` | Indigo `#6366f1` | Information, hints, tips |
| `success` | Green `#22c55e` | Confirmations, completions |
| `warning` | Yellow `#eab308` | Warnings, low resources |

**Features:**
- Slide-in animation with spring overshoot
- Auto-stagger when multiple notifications appear
- Gradient timer bar showing remaining time
- Left accent line for quick type identification
- Title label + message text layout

### ⏳ Progress Bar

- Smooth continuous fill using `requestAnimationFrame`
- Gradient glow trail effect
- Shimmer highlight animation
- Pulsing dot at progress tip
- Percentage counter with tabular numbers
- Slide-up entrance / fade-out exit

### 📋 Info Panel

- Left-side positioned card
- Animated accent line with pulse glow
- Glassmorphism card with inner shadow
- Animated divider with glow sweep
- Smooth slide-in from left

---

## 🔧 QB-Core Integration

### Replace Notify Function

Open `qb-core/client/functions.lua` and replace `QBCore.Functions.Notify`:

```lua
function QBCore.Functions.Notify(text, texttype, length)
    length = length or 5000
    texttype = texttype or 'info'

    if texttype == "primary" then 
        texttype = "info"
    end

    TriggerEvent('exter-lib:notify', text, length, texttype)
end
```

### Replace Progressbar Function

Open `qb-core/client/functions.lua` and replace `QBCore.Functions.Progressbar`:

```lua
function QBCore.Functions.Progressbar(name, label, duration, useWhileDead, canCancel, disableControls, animation, prop, propTwo, onFinish, onCancel)
    if GetResourceState('exter-lib') ~= 'started' then 
        error('exter-lib needs to be started for QBCore.Functions.Progressbar to work') 
    end
    exports['exter-lib']:Progress({
        name = name:lower(),
        duration = duration,
        label = label,
        useWhileDead = useWhileDead,
        canCancel = canCancel,
        controlDisables = disableControls,
        animation = animation,
        prop = prop,
        propTwo = propTwo,
    }, function(cancelled)
        if not cancelled then
            if onFinish then
                onFinish()
            end
        else
            if onCancel then
                onCancel()
            end
        end
    end)
end
```

---

## 📖 Usage Examples

### Notifications

```lua
-- Basic usage
TriggerEvent('exter-lib:notify', 'Item added to inventory', 5000, 'success')
TriggerEvent('exter-lib:notify', 'Not enough money!', 4000, 'error')
TriggerEvent('exter-lib:notify', 'Press E to interact', 3000, 'info')
TriggerEvent('exter-lib:notify', 'Low fuel warning', 5000, 'warning')

-- Using QBCore wrapper
QBCore.Functions.Notify("Vehicle stored in garage", "success")
QBCore.Functions.Notify("Access denied", "error", 3000)
```

### Progress Bar

```lua
-- Simple usage
QBCore.Functions.Progressbar("lockpick", "Picking Lock...", 8000, false, true, {
    disableMovement = true,
    disableCarMovement = true,
    disableMouse = false,
    disableCombat = true,
}, {
    animDict = "anim@amb@clubhouse@tutorial@bkr_tut_ig3@",
    anim = "machinic_loop_mechandplayer",
    flags = 16,
}, {}, {}, function()
    -- On Complete
    QBCore.Functions.Notify("Lock picked successfully!", "success")
end, function()
    -- On Cancel
    QBCore.Functions.Notify("Lock picking cancelled", "error")
end)
```

### Info Panel

```lua
-- Client-side
TriggerEvent('exter-lib:openinfo', "Gruppe6 Contract", "Return the delivery vehicle back to HQ")
TriggerEvent('exter-lib:closeinfo')

-- Server-side
TriggerClientEvent('exter-lib:openinfo', source, "Police Alert", "Respond to robbery at Fleeca Bank")
TriggerClientEvent('exter-lib:closeinfo', source)
```

---

## 🧪 Test Commands

| Command | Description |
|---------|-------------|
| `/notify` | Shows all notification types |
| `/progbar` | Starts a 5-second progress bar |
| `/info` | Opens the info panel |
| `/closeinfo` | Closes the info panel |
| `/test1` | QB error notification |
| `/test2` | QB info notification |
| `/test3` | QB success notification |

---

## 🎯 Customization

All colors and design tokens are defined as CSS custom properties in `html/main.css`. You can easily customize:

```css
:root {
    /* Change the success color to cyan */
    --color-success: #06b6d4;
    --color-success-bg: rgba(6, 182, 212, 0.08);
    --color-success-border: rgba(6, 182, 212, 0.18);
    --color-success-glow: rgba(6, 182, 212, 0.35);
    
    /* Adjust glass intensity */
    --glass-blur: 30px; /* More blur = more frosted */
    --glass-bg: rgba(10, 10, 15, 0.8); /* More opaque */
    
    /* Change border radius */
    --radius-md: 16px; /* More rounded */
}
```

---

## 📁 File Structure

```
exter-lib/
├── client.lua          # Client-side Lua (events, progress logic, props)
├── fxmanifest.lua      # Resource manifest (v2.0)
├── html/
│   ├── index.html      # NUI markup (clean, semantic)
│   ├── index.js        # Pure vanilla JS (zero dependencies)
│   └── main.css        # Modern CSS with custom properties
├── LICENSE
└── README.md
```

---

## ⚡ Performance

- **Zero dependencies** — No jQuery, no external libraries
- **60fps animations** — Using `requestAnimationFrame` and CSS `will-change`
- **GPU-accelerated** — `transform` and `opacity` for all animations
- **Minimal DOM** — Notifications are created/destroyed dynamically
- **Efficient timers** — Single `requestAnimationFrame` loop for progress

---

## 📄 License

MIT License — Free to use, modify, and distribute.

---

<div align="center">

*exter-lib v2.0 — Premium UI for premium servers*

</div>
