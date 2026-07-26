---
name: release-app
description: Automate the release process for Cacao app.
---

## Instructions

When the user invokes this skill with an app path:

1. **Extract version from filename**
   - The app filename format is `Cacao-v{VERSION}.app` (e.g., `Cacao-v1.18.0.app`)
   - Extract the version string including the 'v' prefix (e.g., `v1.18.0`)
   - Also extract just the number part for display (e.g., `1.18.0`)

2. **Verify the app exists**
   - Check if the provided app path exists
   - If not, report error and stop

3. **Rename app to Cacao.app**
   - Copy/rename the app to `Cacao.app` in the same directory
   - This ensures consistent naming when users install the app
   - Example: `cp -R ~/Documents/Cacao-v1.18.0 ~/Documents/Cacao.app`

4. **Create DMG**
   - Run: `create-dmg Cacao.app .` (use the renamed Cacao.app)  (use which for get path)
   - This creates a DMG in the current directory
   - Rename the output to `Cacao-{VERSION}.dmg` (e.g., `Cacao-v1.18.0.dmg`)
   - Clean up: remove the temporary Cacao.app copy

5. **Sign the DMG**
   - Run: `sign_update Cacao-{VERSION}.dmg` (use which for get path)
   - Capture the output which contains:
     - `sparkle:edSignature="..."`
     - `length="..."`
   - Parse and extract the signature and file size

6. **Get file size and checksum**
   - Get file size: `stat -f%z Cacao-{VERSION}.dmg`
   - Get SHA256 checksum: `shasum -a 256 Cacao-{VERSION}.dmg`

7. **Update web/appcast.xml**
   - Add a new `<item>` element at the top of the channel (before existing items)
   - Use current date in RFC 2822 format for pubDate
   - The download URL format: `https://github.com/cacao/Cacao/releases/download/{VERSION}/Cacao-{VERSION}.dmg`
   - Include the signature and length from sign_update output
   - If release notes provided, use them; otherwise generate from git log since previous version
   - the <sparkle:version> should be integer, e.g., 11901 (1.19.1 => 1*10000 + 19*100 + 1)

8. **Update web/index.html**
   - Update the download button version text and link
   - Add new release notes entry in the Release Notes section with checksum
   - Release notes (changelogs) translate into Vietnamese

9. **Update web/download.html**
   - Update the meta refresh URL to point to the new DMG release
   - Update the direct download link in the body
   - URL format: `https://github.com/cacao/Cacao/releases/download/{VERSION}/Cacao-{VERSION}.dmg`

10. **Summary**
   - Show summary of what was done
   - Show the DMG path for upload to GitHub
   - Remind user to:
     - Upload DMG to GitHub releases at the tag `{VERSION}`
     - Deploy updated web files

## Example appcast.xml item format

```xml
<item>
  <title>Version 1.18.0</title>
  <sparkle:version>1</sparkle:version>
  <sparkle:shortVersionString>1.18.0</sparkle:shortVersionString>
  <sparkle:minimumSystemVersion>13.0</sparkle:minimumSystemVersion>
  <pubDate>Thu, 30 Jan 2026 12:00:00 +0700</pubDate>
  <enclosure
    url="https://github.com/cacao/Cacao/releases/download/v1.18.0/Cacao-v1.18.0.dmg"
    sparkle:edSignature="SIGNATURE_HERE"
    length="12345678"
    type="application/octet-stream"
  />
  <description><![CDATA[
    <h2>What's New</h2>
    <ul>
      <li>Release notes here</li>
    </ul>
  ]]></description>
</item>
```

## Example index.html updates

Download button (around line 64):
```html
<button class="secondary" onclick="location.href='/download.html?v=1.18.0'">
    Tải app tại đây (v1.18.0)
</button>
```

Release notes section (after line 240):
```html
<div>
    <h5>v1.18.0</h5>
    <ul>
        <li>Checksum sha256 (Cacao-v1.18.0.dmg) :
            <code>CHECKSUM_HERE</code>
        </li>
        <li>Release notes here</li>
    </ul>
    <hr />
</div>
```

## Example download.html updates

Meta refresh tag (line 9):
```html
<meta
    http-equiv="refresh"
    content="2; URL=https://github.com/cacao/Cacao/releases/download/v1.18.0/Cacao-v1.18.0.dmg"
/>
```

Direct download link (line 24):
```html
<a
    href="https://github.com/cacao/Cacao/releases/download/v1.18.0/Cacao-v1.18.0.dmg"
    >bấm vào đây để tải ngay</a
>
```
