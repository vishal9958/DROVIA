# Design a Premium Cross-Device P2P File Transfer Platform

Design a complete modern product called **[PROJECT NAME]**, a secure cross-device file transfer platform that allows users to transfer files between phones and laptops from anywhere using **WebRTC peer-to-peer technology**.

Create TWO connected products with the same visual identity:

1. **Web Application — Desktop + Mobile Responsive**
2. **Mobile Application — React Native**

The website and mobile app should feel like the same product, but each interface must be optimized for its platform.

## Overall Product Concept

The product allows:

* Phone → Laptop
* Laptop → Phone
* Laptop → Laptop
* Phone → Phone

Users can transfer files using:

* Drag & Drop
* File picker
* 6-digit PIN
* QR Code
* WebRTC P2P connection

The experience should be extremely simple:

**Select File → Share → Get PIN / QR → Receiver enters PIN or scans QR → WebRTC connects → Transfer starts → Download complete**

---

# VISUAL DIRECTION

Create a premium, futuristic but minimal SaaS interface.

Design language:

* Modern technology product
* Clean SaaS dashboard
* Subtle glassmorphism
* Soft gradients
* Large rounded cards
* Thin borders
* Minimal shadows
* Smooth micro-interactions
* Strong typography
* Generous whitespace
* Clear visual hierarchy

Avoid:

* Overly cyberpunk UI
* Excessive neon
* Cluttered dashboards
* Too many colors
* Gaming-style interface
* Complicated navigation

The product should feel like a combination of:

**AirDrop + WeTransfer + modern developer SaaS**

Use a dark-first visual identity with an optional light theme.

Suggested palette:

* Deep charcoal / near-black background
* White / off-white primary text
* Cool blue or violet primary accent
* Subtle cyan highlights
* Neutral gray secondary surfaces

Use one primary accent consistently.

---

# DESIGN SYSTEM

Create a complete Figma design system containing:

### Typography

Use a modern font such as:

* Inter
* Geist
* SF Pro style alternative

Typography hierarchy:

* Display
* H1
* H2
* H3
* Body Large
* Body
* Small
* Caption

### Components

Create reusable components for:

* Primary Button
* Secondary Button
* Ghost Button
* Icon Button
* Upload Dropzone
* File Card
* File List
* Progress Bar
* PIN Input
* QR Card
* Device Card
* Connection Status
* Transfer Status
* Toast Notification
* Modal
* Bottom Sheet
* Navigation
* Sidebar
* Header
* Empty State
* Error State
* Success State
* Loading State

Create variants for:

* Default
* Hover
* Pressed
* Disabled
* Loading
* Success
* Error

---

# WEBSITE DESIGN

Create a responsive web application.

## 1. Landing Page

Create a beautiful landing page explaining the product.

Hero:

Headline:

**Transfer files. Anywhere. Instantly.**

Supporting text:

**Send files directly between your devices using secure peer-to-peer connections. No cables. No complicated setup.**

Primary CTA:

**Send a File**

Secondary CTA:

**Receive a File**

Hero visual:

Show a laptop and smartphone connected through a glowing but subtle connection line.

Inside the hero visual, show:

**Laptop → WebRTC → Phone**

Include small floating file icons such as:

* PDF
* Image
* Video
* ZIP

Sections:

* How it works
* Features
* Security
* Supported devices
* FAQ
* Footer

---

# 2. Send File Screen

This is the main screen.

Header:

Logo + product name

Navigation:

* Send
* Receive
* Transfers
* Help

Main content:

Large centered drag-and-drop zone.

Text:

**Drop your files here**

Secondary text:

**or choose files from your device**

Button:

**Choose Files**

Support:

* Multiple files
* Large files
* Images
* Videos
* Documents
* ZIP files

Below the dropzone show:

**Your files**

Example:

`project.zip — 1.8 GB`

with:

* File icon
* Filename
* File size
* Remove button

Primary CTA:

**Create Transfer**

---

# 3. Transfer Created Screen

After clicking Create Transfer.

Show a large transfer card.

Title:

**Your transfer is ready**

Large PIN:

**482 913**

Add:

**Share this PIN with the receiver**

Buttons:

**Copy PIN**

**Show QR Code**

**Share Link**

QR code should be large and centered.

Show:

**Waiting for receiver...**

Animated connection indicator.

Status:

**Waiting for connection**

Include:

**Cancel Transfer**

---

# 4. Receiver Screen

Create a dedicated receive experience.

Heading:

**Receive a file**

Text:

**Enter the 6-digit PIN shared by the sender.**

Large PIN input:

`_ _ _   _ _ _`

Button:

**Connect**

Alternative:

**Scan QR Code**

Camera/QR scanning UI should be represented.

Also include:

**Don't have a PIN? Ask the sender to share their transfer code.**

---

# 5. Connecting Screen

After entering PIN.

Show an elegant connection animation.

Visual:

Sender device ↔ Receiver device

Status:

**Connecting securely...**

Progress stages:

1. Finding transfer
2. Establishing peer connection
3. Preparing file transfer

Use WebRTC-inspired subtle connection animation.

---

# 6. Incoming File Confirmation

After connection.

Show:

**Incoming file**

File card:

`video.mp4`

`2.4 GB`

Sender:

**Vishal's Laptop**

Buttons:

**Accept Transfer**

**Decline**

Add security note:

**Transfer will be sent directly between connected devices.**

---

# 7. Active Transfer Screen

Create a beautiful transfer progress interface.

Large circular progress indicator:

**67%**

Show:

`1.6 GB / 2.4 GB`

Transfer speed:

**18.4 MB/s**

Estimated time:

**42 seconds remaining**

Show animated connection between sender and receiver.

Controls:

**Pause**

**Cancel**

For multiple files, show a list with individual progress.

---

# 8. Transfer Complete Screen

Large success state.

Icon:

✓

Title:

**Transfer complete**

Text:

**video.mp4 was successfully transferred.**

Show:

* File name
* File size
* Transfer speed
* Duration

Buttons:

**Open File**

**Transfer Another File**

Secondary:

**Back to Home**

---

# 9. Transfer History

Create a dashboard showing previous transfers.

Tabs:

* Sent
* Received

Each transfer card:

* File icon
* Filename
* Size
* Date/time
* Device
* Status

Statuses:

Completed
Cancelled
Failed
Expired

Add search and filtering.

---

# 10. Settings

Create settings page containing:

### Transfer Settings

* Auto accept transfers
* Maximum transfer size
* Default download location
* Auto-delete expired transfers

### Privacy

* Device name
* Transfer expiry
* PIN security
* Connection permissions

### Appearance

* Dark
* Light
* System

### About

* Version
* Terms
* Privacy Policy

---

# MOBILE APP — REACT NATIVE

Create a complete mobile app design using the same design system.

The mobile experience should NOT simply be a scaled-down website.

Optimize specifically for touch interaction.

Use:

* Bottom navigation
* Bottom sheets
* Large touch targets
* Gesture-friendly controls
* Native-style modals
* Mobile-friendly cards

Bottom navigation:

**Home | Transfers | Settings**

---

# MOBILE HOME

Top:

Logo

Greeting:

**Ready to transfer?**

Two large action cards:

### Send

**Choose files and create a transfer**

### Receive

**Enter a PIN or scan QR**

Below:

**Recent Transfers**

Show recent files.

---

# MOBILE SEND FLOW

Screen:

**Select files**

Large upload area.

Buttons:

**Choose Files**

**Take Photo**

**Choose from Gallery**

After selecting files:

Show file list.

Bottom sticky button:

**Create Transfer**

---

# MOBILE TRANSFER PIN

Show:

**Share this PIN**

Large PIN:

**482 913**

QR Code underneath.

Buttons:

**Copy PIN**

**Share**

**Show QR**

Status:

**Waiting for receiver...**

Allow user to keep the screen open while waiting.

---

# MOBILE RECEIVE

Heading:

**Receive files**

PIN input:

`_ _ _   _ _ _`

Button:

**Connect**

Alternative large button:

**Scan QR Code**

Create a dedicated QR scanner screen.

---

# QR SCANNER

Full-screen camera interface.

Top:

**Scan Transfer QR**

Center:

Large square scanning frame.

Instruction:

**Point your camera at the sender's QR code**

Bottom:

**Enter PIN manually**

---

# MOBILE INCOMING TRANSFER

Show:

**Incoming transfer**

Sender device:

**Vishal's Laptop**

Files:

`project.zip`
`1.8 GB`

Buttons:

**Accept**

**Decline**

---

# MOBILE ACTIVE TRANSFER

Large circular progress:

**72%**

Show:

`1.3 GB / 1.8 GB`

Speed:

**24.8 MB/s**

Time remaining:

**18 seconds**

Buttons:

**Pause**
**Cancel**

---

# MOBILE SUCCESS

Large success animation.

Title:

**File received**

Show file details.

Buttons:

**Open File**

**Share**

**Transfer Another**

---

# RESPONSIVE WEB DESIGN

Create desktop breakpoints:

* 1440px
* 1280px
* 1024px

Tablet:

* 768px

Mobile:

* 390px
* 375px

Make sure the web experience remains usable on mobile browsers.

---

# UX DETAILS

Design the following states carefully:

### Empty

**No files selected**

### Uploading

**Preparing files...**

### Connecting

**Finding receiver...**

### Waiting

**Waiting for receiver**

### Active

**Transfer in progress**

### Paused

**Transfer paused**

### Success

**Transfer complete**

### Failed

**Transfer interrupted**

CTA:

**Retry Transfer**

### Expired PIN

**This transfer has expired**

CTA:

**Create New Transfer**

### Invalid PIN

**Invalid transfer code**

### Receiver Offline

**Receiver could not be reached**

---

# SECURITY VISUALIZATION

Create a small security section explaining:

**Peer-to-peer transfer**

**Secure connection**

**Temporary transfer PIN**

**No permanent file storage**

Use simple icons rather than technical diagrams.

Do not make unrealistic security claims.

---

# MICRO-INTERACTIONS

Prototype animations for:

* Drag file into dropzone
* Upload progress
* PIN generation
* PIN copy
* QR generation
* QR scanning
* Device connection
* WebRTC connection established
* Transfer progress
* Transfer completion
* Error states
* Toast notifications

Use smooth 200–400ms transitions.

Keep animations subtle and premium.

---

# FIGMA PROTOTYPE FLOW

Connect the primary prototype flow:

### Sender

Landing
→ Send File
→ Upload File
→ Create Transfer
→ PIN + QR
→ Waiting
→ Receiver Connected
→ Transfer Progress
→ Transfer Complete

### Receiver

Landing
→ Receive File
→ Enter PIN / Scan QR
→ Connecting
→ Incoming File
→ Accept
→ Transfer Progress
→ Transfer Complete

---

# FINAL FIGMA STRUCTURE

Organize the Figma file into:

01 — Design System

02 — Web Landing

03 — Web Application

04 — Web Responsive

05 — Mobile App

06 — Components

07 — Prototype Flows

08 — Icons & Assets

09 — Empty / Loading / Error States

10 — Developer Handoff

Make the final design production-ready, consistent, highly polished, accessible, responsive, and realistic enough to directly implement using **React for Web and React Native for Mobile**.

The final product should feel like a serious premium file-transfer platform rather than a student project.
